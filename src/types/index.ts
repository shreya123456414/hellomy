export interface MentalHealthProfile {
  id?: string;
  userId: string;
  conditions: string[];
  underTreatment: boolean | null;
  onMedication: boolean | null;
  crisisSupport: boolean;
  responseStyle: 'gentle' | 'motivational' | 'neutral';
  createdAt?: string;
}

export interface MoodEntry {
  id?: string;
  userId: string;
  mood: string;
  emotionalScore: number;
  journalEntry?: string;
  dreamEntry?: string;
  stressLevel: number;
  energyLevel: number;
  anxietyLevel: number;
  tags: string[];
  createdAt?: string;
}

export interface GameProfile {
  id?: string;
  userId: string;
  level: number;
  xp: number;
  totalXp: number;
  abilities: string[];
  streaks: Record<string, number>;
  lastActivity?: string;
}

export interface EmotionalAnalysis {
  primaryEmotion: string;
  emotionalScore: number;
  stressIndicators: string[];
  positiveIndicators: string[];
  recommendations: string[];
  crisisRisk: boolean;
}

export type MoodTheme = 'happy' | 'calm' | 'stressed' | 'sad' | 'motivated';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}