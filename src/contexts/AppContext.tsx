import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { MentalHealthProfile, MoodEntry, GameProfile, MoodTheme } from '../types';
import { getMoodTheme } from '../lib/themes';

interface AppState {
  currentUser: string;
  profile: MentalHealthProfile | null;
  gameProfile: GameProfile | null;
  currentTheme: MoodTheme;
  isOnboarding: boolean;
  recentMoods: MoodEntry[];
  notifications: string[];
}

type AppAction = 
  | { type: 'SET_PROFILE'; payload: MentalHealthProfile }
  | { type: 'SET_GAME_PROFILE'; payload: GameProfile }
  | { type: 'SET_THEME'; payload: MoodTheme }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'ADD_MOOD'; payload: MoodEntry }
  | { type: 'ADD_XP'; payload: number }
  | { type: 'ADD_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' };

const initialState: AppState = {
  currentUser: 'demo-user',
  profile: null,
  gameProfile: null,
  currentTheme: 'calm',
  isOnboarding: true,
  recentMoods: [],
  notifications: []
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload, isOnboarding: false };
    case 'SET_GAME_PROFILE':
      return { ...state, gameProfile: action.payload };
    case 'SET_THEME':
      return { ...state, currentTheme: action.payload };
    case 'COMPLETE_ONBOARDING':
      return { ...state, isOnboarding: false };
    case 'ADD_MOOD':
      const newTheme = getMoodTheme(action.payload.mood, action.payload.emotionalScore);
      return { 
        ...state, 
        recentMoods: [action.payload, ...state.recentMoods.slice(0, 9)],
        currentTheme: newTheme
      };
    case 'ADD_XP':
      if (!state.gameProfile) return state;
      const newXp = state.gameProfile.xp + action.payload;
      const newTotalXp = state.gameProfile.totalXp + action.payload;
      const newLevel = Math.floor(newTotalXp / 100) + 1;
      return {
        ...state,
        gameProfile: {
          ...state.gameProfile,
          xp: newXp,
          totalXp: newTotalXp,
          level: newLevel
        }
      };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize demo data
  useEffect(() => {
    const demoGameProfile: GameProfile = {
      userId: 'demo-user',
      level: 3,
      xp: 45,
      totalXp: 245,
      abilities: ['Inner Calm', 'Anxiety Shield'],
      streaks: { mindfulness: 5, journaling: 3 }
    };
    dispatch({ type: 'SET_GAME_PROFILE', payload: demoGameProfile });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}