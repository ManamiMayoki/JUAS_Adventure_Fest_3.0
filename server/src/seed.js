const mongoose = require('mongoose');
const config = require('./config/env');
const logger = require('./utils/logger');
const User = require('./models/User');
const Segment = require('./models/Segment');
const BudgetItem = require('./models/BudgetItem');
const Registration = require('./models/Registration');
const AuditLog = require('./models/AuditLog');
const { defaultSegments, defaultBudgetItems } = require('./utils/seedData');
const { generateQRCodeDataURL } = require('./utils/qrGenerator');

const seed = async () => {
  try {
    logger.info('[Seed] Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri, {
      maxPoolSize: 10,
      family: 4,
    });
    logger.success('[Seed] Connected to database.');

    // 1. Seed Users (Super Admin and Organizer)
    await User.deleteMany({ email: { $in: [config.seedAdminEmail, config.seedOrganizerEmail, 'runner@ju.ac.bd'] } });

    const admin = await User.create({
      name: 'JUAS Chief Marshal',
      email: config.seedAdminEmail,
      password: config.seedAdminPassword,
      role: 'super_admin',
      department: 'JU Adventure Society Lead',
      university: 'Jahangirnagar University',
      avatarClass: 'Pathfinder Fox',
      phone: '01711000001',
    });

    const organizer = await User.create({
      name: 'JU Science Club Coordinator',
      email: config.seedOrganizerEmail,
      password: config.seedOrganizerPassword,
      role: 'organizer',
      department: 'JU Science Club & Logistics',
      university: 'Jahangirnagar University',
      avatarClass: 'Skywatcher Bird',
      phone: '01711000002',
    });

    logger.success(`[Seed] Seeded Users: \n  - Admin: ${admin.email}\n  - Organizer: ${organizer.email}`);

    // 2. Seed Segments
    await Segment.deleteMany({});
    const insertedSegments = await Segment.insertMany(defaultSegments);
    logger.success(`[Seed] Seeded ${insertedSegments.length} event quest segments.`);

    // 3. Seed Budget Items
    await BudgetItem.deleteMany({});
    const budgetWithUser = defaultBudgetItems.map((item) => ({
      ...item,
      updatedBy: admin.name,
    }));
    await BudgetItem.insertMany(budgetWithUser);
    logger.success(`[Seed] Seeded ${budgetWithUser.length} organizer budget line items.`);

    // 4. Seed Realistic Sample Registrations
    await Registration.deleteMany({});
    const marathonSeg = insertedSegments.find((s) => s.code === 'MARATHON');
    const treasureSeg = insertedSegments.find((s) => s.code === 'TREASURE_HUNT');

    const sampleQr = await generateQRCodeDataURL(
      JSON.stringify({
        id: 'JUAS-3.0#1042',
        name: 'Zubair Hossain',
        avatar: 'Pathfinder Fox',
        status: 'CONFIRMED',
        fest: 'JUAS Adventure Fest 3.0',
      })
    );

    await Registration.create([
      {
        registrationId: 'JUAS-3.0#1042',
        avatarClass: 'Pathfinder Fox',
        leadParticipant: {
          name: 'Zubair Hossain',
          email: 'zubair.ju48@gmail.com',
          phone: '01712345678',
          university: 'Jahangirnagar University',
          department: 'Computer Science & Engineering',
          studentId: 'CSE-48-1092',
          emergencyContact: '01812345678',
          tShirtSize: 'L',
        },
        squadName: 'Wild Foxes Alpha',
        segments: [marathonSeg._id, treasureSeg._id],
        totalFeeBDT: marathonSeg.feeBDT + treasureSeg.feeBDT,
        payment: {
          method: 'bKash',
          transactionId: 'BK99X874A2',
          senderNumber: '01712345678',
          amountPaidBDT: marathonSeg.feeBDT + treasureSeg.feeBDT,
          status: 'verified',
          verifiedAt: new Date(),
          verifiedBy: admin.email,
          verificationNote: 'bKash merchant confirmed',
        },
        questLevelStars: 5,
        qrCodeDataUrl: sampleQr,
      },
      {
        registrationId: 'JUAS-3.0#1099',
        avatarClass: 'Skywatcher Bird',
        leadParticipant: {
          name: 'Nusrat Jahan Promi',
          email: 'nusrat.promi@du.ac.bd',
          phone: '01898765432',
          university: 'Dhaka University',
          department: 'Zoology',
          studentId: 'DU-ZOO-2022',
          emergencyContact: '01987654321',
          tShirtSize: 'M',
        },
        squadName: 'Siberian Migrants',
        segments: [marathonSeg._id],
        totalFeeBDT: marathonSeg.feeBDT,
        payment: {
          method: 'Nagad',
          transactionId: 'NG77Y321B9',
          senderNumber: '01898765432',
          amountPaidBDT: marathonSeg.feeBDT,
          status: 'pending',
        },
        questLevelStars: 4,
        qrCodeDataUrl: sampleQr,
      },
    ]);

    logger.success('[Seed] Seeded sample participant registrations with verification states.');

    // 5. Initial Audit Log
    await AuditLog.create({
      action: 'ORGANIZER_LOGIN',
      targetId: 'SEED_INITIALIZATION',
      performerEmail: admin.email,
      performerRole: admin.role,
      details: 'System database initialized with Adventure Fest 3.0 quest parameters and budget model.',
    });

    console.log('\n======================================================');
    console.log('  JUAS ADVENTURE FEST 3.0 — DATABASE SEED COMPLETE');
    console.log('======================================================');
    console.log(`  Admin Email:     ${config.seedAdminEmail}`);
    console.log(`  Admin Password:  ${config.seedAdminPassword}`);
    console.log(`  Organizer Email: ${config.seedOrganizerEmail}`);
    console.log(`  Organizer Pass:  ${config.seedOrganizerPassword}`);
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    logger.error(`[Seed] Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seed();
