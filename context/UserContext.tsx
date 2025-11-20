import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Subject, Proficiency } from '../types';

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  targetCourse: '',
  targetUniversity: '',
  proficiencies: {
    [Subject.MATH]: Proficiency.MEDIUM,
    [Subject.HUMANITIES]: Proficiency.MEDIUM,
    [Subject.NATURE]: Proficiency.MEDIUM,
    [Subject.LANGUAGES]: Proficiency.MEDIUM,
  },
  isOnboarded: false,
};

interface UserContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  resetProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('personaliza_enem_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('personaliza_enem_profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const resetProfile = () => {
    setProfile(DEFAULT_PROFILE);
    localStorage.removeItem('personaliza_enem_profile');
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile, resetProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};