import React, { createContext, useContext, useState, useEffect } from 'react';

const QuestContext = createContext(null);

export const CAMPUS_ZONES = [
  { id: 'basecamp', name: 'Basecamp Central', tag: 'ZONE 01 // START' },
  { id: 'marathon', name: 'Marathon Lake Trails', tag: 'ZONE 02 // ENDURANCE' },
  { id: 'ruins', name: 'Treasure Ruins & Ciphers', tag: 'ZONE 03 // TACTICAL' },
  { id: 'nightcamp', name: 'Bushcraft & Stargaze Shore', tag: 'ZONE 04 // SURVIVAL' },
  { id: 'registration', name: 'Mission Pass Terminal', tag: 'ZONE 05 // CHECKPOINT' },
];

export const QuestProvider = ({ children }) => {
  const [questStars, setQuestStars] = useState(1); // 1 to 5
  const [currentZoneIndex, setCurrentZoneIndex] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState('Pathfinder Fox');
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [registrationSuccessData, setRegistrationSuccessData] = useState(null);

  // Monitor scroll progress across zones
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(Math.max(scrollPos / (totalHeight || 1), 0), 1);

      // Determine active zone index (0-4)
      const zoneIdx = Math.min(Math.floor(progress * CAMPUS_ZONES.length), CAMPUS_ZONES.length - 1);
      setCurrentZoneIndex(zoneIdx);

      // Dynamically calculate wanted star meter based on exploration & selections
      let baseStars = 1 + zoneIdx;
      if (selectedSegments.length > 0) baseStars = Math.max(baseStars, 3);
      if (registrationSuccessData) baseStars = 5;
      setQuestStars(Math.min(baseStars, 5));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedSegments, registrationSuccessData]);

  return (
    <QuestContext.Provider
      value={{
        questStars,
        setQuestStars,
        currentZone: CAMPUS_ZONES[currentZoneIndex],
        currentZoneIndex,
        selectedAvatar,
        setSelectedAvatar,
        selectedSegments,
        setSelectedSegments,
        registrationSuccessData,
        setRegistrationSuccessData,
      }}
    >
      {children}
    </QuestContext.Provider>
  );
};

export const useQuest = () => useContext(QuestContext);
