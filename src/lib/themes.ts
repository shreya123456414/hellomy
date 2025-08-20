import { MoodTheme, ThemeColors } from '../types';

export const themes: Record<MoodTheme, ThemeColors> = {
  happy: {
    primary: 'from-orange-400 to-pink-400',
    secondary: 'from-yellow-300 to-orange-300',
    accent: '#F59E0B',
    background: 'from-orange-50 to-pink-50',
    surface: 'bg-white/80 backdrop-blur-sm',
    text: 'text-orange-900',
    textSecondary: 'text-orange-700'
  },
  calm: {
    primary: 'from-blue-400 to-teal-400',
    secondary: 'from-teal-300 to-blue-300',
    accent: '#0891B2',
    background: 'from-blue-50 to-teal-50',
    surface: 'bg-white/80 backdrop-blur-sm',
    text: 'text-blue-900',
    textSecondary: 'text-blue-700'
  },
  stressed: {
    primary: 'from-indigo-500 to-blue-600',
    secondary: 'from-blue-400 to-indigo-400',
    accent: '#3B82F6',
    background: 'from-indigo-100 to-blue-100',
    surface: 'bg-white/90 backdrop-blur-sm',
    text: 'text-indigo-900',
    textSecondary: 'text-indigo-700'
  },
  sad: {
    primary: 'from-purple-500 to-indigo-600',
    secondary: 'from-purple-300 to-indigo-400',
    accent: '#8B5CF6',
    background: 'from-purple-100 to-indigo-100',
    surface: 'bg-white/85 backdrop-blur-sm',
    text: 'text-purple-900',
    textSecondary: 'text-purple-700'
  },
  motivated: {
    primary: 'from-green-400 to-teal-500',
    secondary: 'from-emerald-300 to-green-400',
    accent: '#10B981',
    background: 'from-green-50 to-teal-50',
    surface: 'bg-white/80 backdrop-blur-sm',
    text: 'text-green-900',
    textSecondary: 'text-green-700'
  }
};

export const getMoodTheme = (mood: string, emotionalScore: number): MoodTheme => {
  const moodLower = mood.toLowerCase();
  
  if (moodLower.includes('happy') || moodLower.includes('joy') || moodLower.includes('excited')) {
    return 'happy';
  }
  if (moodLower.includes('calm') || moodLower.includes('peaceful') || moodLower.includes('relaxed')) {
    return 'calm';
  }
  if (moodLower.includes('stress') || moodLower.includes('anxious') || moodLower.includes('overwhelmed')) {
    return 'stressed';
  }
  if (moodLower.includes('sad') || moodLower.includes('down') || moodLower.includes('lonely')) {
    return 'sad';
  }
  if (moodLower.includes('motivated') || moodLower.includes('focused') || moodLower.includes('determined')) {
    return 'motivated';
  }

  // Default based on emotional score
  if (emotionalScore >= 80) return 'happy';
  if (emotionalScore >= 60) return 'calm';
  if (emotionalScore >= 40) return 'motivated';
  if (emotionalScore >= 20) return 'stressed';
  return 'sad';
};