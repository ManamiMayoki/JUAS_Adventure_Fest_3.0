const BudgetItem = require('../models/BudgetItem');
const Registration = require('../models/Registration');
const AuditLog = require('../models/AuditLog');
const { getClient } = require('../config/redis');

exports.getBudgetSummary = async (req, res, next) => {
  try {
    const cache = getClient();
    const cacheKey = 'juas:budget:summary';

    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        source: 'cache',
        data: JSON.parse(cachedData),
      });
    }

    // 1. Calculate live participant counts from MongoDB
    const [totalRegistrations, verifiedRegistrations, pendingRegistrations] = await Promise.all([
      Registration.countDocuments(),
      Registration.countDocuments({ 'payment.status': 'verified' }),
      Registration.countDocuments({ 'payment.status': 'pending' }),
    ]);

    // 2. Compute total collected registration revenue
    const revenueAggregation = await Registration.aggregate([
      { $match: { 'payment.status': 'verified' } },
      { $group: { _id: null, totalCollected: { $sum: '$payment.amountPaidBDT' } } },
    ]);
    const registrationRevenueBDT = revenueAggregation[0]?.totalCollected || 0;

    // 3. Aggregate all budget items (expenses vs sponsorship)
    const budgetItems = await BudgetItem.find().sort({ createdAt: -1 });

    let totalPlannedExpensesBDT = 0;
    let totalActualExpensesBDT = 0;
    let totalSponsorshipInflowBDT = 0;

    const categoryBreakdown = {};

    budgetItems.forEach((item) => {
      if (item.isIncome || item.category === 'Sponsorship & Grant Inflow') {
        totalSponsorshipInflowBDT += item.actualAmountBDT || item.plannedAmountBDT;
      } else {
        totalPlannedExpensesBDT += item.plannedAmountBDT || 0;
        totalActualExpensesBDT += item.actualAmountBDT || 0;

        if (!categoryBreakdown[item.category]) {
          categoryBreakdown[item.category] = { planned: 0, actual: 0 };
        }
        categoryBreakdown[item.category].planned += item.plannedAmountBDT || 0;
        categoryBreakdown[item.category].actual += item.actualAmountBDT || 0;
      }
    });

    // 4. Calculate Net Surplus / Deficit & Per-Head breakdown
    const totalInflowBDT = registrationRevenueBDT + totalSponsorshipInflowBDT;
    const netSurplusDeficitBDT = totalInflowBDT - totalActualExpensesBDT;
    const confirmedCount = Math.max(verifiedRegistrations, 1);
    const perParticipantCostBDT = Math.round(totalActualExpensesBDT / confirmedCount);
    const breakEvenParticipantsNeeded =
      registrationRevenueBDT > 0
        ? Math.ceil(totalActualExpensesBDT / (registrationRevenueBDT / confirmedCount))
        : 100;

    const summary = {
      participants: {
        totalRegistrations,
        verifiedRegistrations,
        pendingRegistrations,
      },
      financials: {
        registrationRevenueBDT,
        sponsorshipInflowBDT: totalSponsorshipInflowBDT,
        totalInflowBDT,
        totalPlannedExpensesBDT,
        totalActualExpensesBDT,
        netSurplusDeficitBDT,
        perParticipantCostBDT,
        breakEvenParticipantsNeeded,
      },
      categoryBreakdown,
      items: budgetItems,
    };

    // Cache for 30 seconds
    await cache.set(cacheKey, JSON.stringify(summary), 'EX', 30);

    res.status(200).json({
      success: true,
      source: 'live_database',
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllBudgetItems = async (req, res, next) => {
  try {
    const items = await BudgetItem.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

exports.createBudgetItem = async (req, res, next) => {
  try {
    const itemData = {
      ...req.body,
      updatedBy: req.user.name || req.user.email,
    };

    const newItem = await BudgetItem.create(itemData);

    await AuditLog.create({
      action: 'BUDGET_ITEM_CREATE',
      targetId: newItem._id.toString(),
      performerEmail: req.user.email,
      performerRole: req.user.role,
      details: `Created budget item '${newItem.title}' in category '${newItem.category}' for BDT ${newItem.plannedAmountBDT}`,
    });

    const cache = getClient();
    await cache.del('juas:budget:summary');

    res.status(201).json({
      success: true,
      message: 'Budget line item added successfully.',
      data: newItem,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBudgetItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await BudgetItem.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Budget item not found.',
      });
    }

    const previousValue = item.toObject();
    Object.assign(item, req.body, { updatedBy: req.user.name || req.user.email });
    await item.save();

    await AuditLog.create({
      action: 'BUDGET_ITEM_UPDATE',
      targetId: item._id.toString(),
      performerEmail: req.user.email,
      performerRole: req.user.role,
      details: `Updated budget item '${item.title}'`,
      diff: { before: previousValue, after: item.toObject() },
    });

    const cache = getClient();
    await cache.del('juas:budget:summary');

    res.status(200).json({
      success: true,
      message: 'Budget item updated successfully.',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBudgetItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await BudgetItem.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Budget item not found.',
      });
    }

    await AuditLog.create({
      action: 'BUDGET_ITEM_DELETE',
      targetId: id,
      performerEmail: req.user.email,
      performerRole: req.user.role,
      details: `Deleted budget item '${item.title}' (${item.category})`,
    });

    const cache = getClient();
    await cache.del('juas:budget:summary');

    res.status(200).json({
      success: true,
      message: 'Budget item deleted.',
    });
  } catch (error) {
    next(error);
  }
};

exports.exportBudgetCSV = async (req, res, next) => {
  try {
    const items = await BudgetItem.find().sort({ category: 1, createdAt: 1 });

    let csvContent = 'Category,Item Title,Type,Planned Amount (BDT),Actual Amount (BDT),Variance (BDT),Status,Receipt Note,Last Updated By\n';

    items.forEach((item) => {
      const type = item.isIncome ? 'Inflow' : 'Expense';
      const variance = (item.plannedAmountBDT || 0) - (item.actualAmountBDT || 0);
      const row = [
        `"${item.category}"`,
        `"${item.title.replace(/"/g, '""')}"`,
        type,
        item.plannedAmountBDT,
        item.actualAmountBDT,
        variance,
        item.status,
        `"${(item.receiptNote || '').replace(/"/g, '""')}"`,
        `"${item.updatedBy}"`,
      ].join(',');
      csvContent += row + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="JUAS_Adventure_Fest_3.0_Budget.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};
