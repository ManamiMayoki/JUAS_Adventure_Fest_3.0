import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroBanner } from './components/hero/HeroBanner';
import { CampusMascots } from './components/hero/CampusMascots';
import { MissionBriefings } from './components/missions/MissionBriefings';
import { RulebookModal } from './components/missions/RulebookModal';
import { RegistrationWizard } from './components/registration/RegistrationWizard';
import { CampusMapSchedule } from './components/schedule/CampusMapSchedule';
import { LeaderboardFeed } from './components/leaderboard/LeaderboardFeed';
import { FAQSection } from './components/faq/FAQSection';
import { CampusRadar } from './components/hud/CampusRadar';
import { Footer } from './components/layout/Footer';
import { OrganizerLoginModal } from './components/organizer/OrganizerLoginModal';
import { OrganizerCostPortal } from './components/organizer/OrganizerCostPortal';
import { ParticipantLookup } from './components/dashboard/ParticipantLookup';
import { useAuth } from './context/AuthContext';

export function App() {
  const { isOrganizer } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCostPortalOpen, setIsCostPortalOpen] = useState(false);
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);
  const [selectedRulebookSegment, setSelectedRulebookSegment] = useState(null);

  const handleOrganizerClick = () => {
    if (isOrganizer) {
      setIsCostPortalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col relative selection:bg-[#00E5FF] selection:text-[#0B0F19]">
      {/* Top Navbar */}
      <Navbar
        onOpenOrganizerModal={handleOrganizerClick}
        onOpenLookupModal={() => setIsLookupModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 3D Wilderness Hero Section */}
        <HeroBanner />

        {/* Dual Campus Mascots: Golden Fox & Migratory Bird */}
        <CampusMascots />

        {/* Mission Briefing Cards (Segment Explorer) */}
        <MissionBriefings
          onOpenRulebook={(segment) => setSelectedRulebookSegment(segment)}
        />

        {/* Campus Map & Event Schedule */}
        <CampusMapSchedule />

        {/* Gamified 4-Step Registration Wizard */}
        <RegistrationWizard />

        {/* Live Leaderboard & Announcements Feed */}
        <LeaderboardFeed />

        {/* Knowledge Base & FAQs */}
        <FAQSection />
      </main>

      {/* Interactive Bottom-Left Radar HUD Widget */}
      <CampusRadar />

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <OrganizerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          if (isOrganizer) setIsCostPortalOpen(true);
        }}
      />

      <OrganizerCostPortal
        isOpen={isCostPortalOpen}
        onClose={() => setIsCostPortalOpen(false)}
      />

      <ParticipantLookup
        isOpen={isLookupModalOpen}
        onClose={() => setIsLookupModalOpen(false)}
      />

      <RulebookModal
        segment={selectedRulebookSegment}
        onClose={() => setSelectedRulebookSegment(null)}
      />
    </div>
  );
}

export default App;
