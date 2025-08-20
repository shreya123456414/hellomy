import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Frown, Meh, Heart, Brain, Zap } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { themes } from '../lib/themes';
import { analyzeText } from '../lib/emotionalAnalysis';
import { MoodEntry } from '../types';

const moodEmojis = [
  { emoji: '😢', label: 'Very Sad', value: 10 },
  { emoji: '😞', label: 'Sad', value: 25 },
  { emoji: '😐', label: 'Neutral', value: 50 },
  { emoji: '🙂', label: 'Happy', value: 75 },
  { emoji: '😄', label: 'Very Happy', value: 90 }
];

export default function MoodTracker() {
  const { state, dispatch } = useApp();
  const theme = themes[state.currentTheme];
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [journalText, setJournalText] = useState('');
  const [stressLevel, setStressLevel] = useState(50);
  const [energyLevel, setEnergyLevel] = useState(50);
  const [anxietyLevel, setAnxietyLevel] = useState(50);

  const handleSubmit = () => {
    if (selectedMood === null) return;

    const analysis = analyzeText(journalText);
    
    const moodEntry: MoodEntry = {
      userId: state.currentUser,
      mood: moodEmojis.find(m => m.value === selectedMood)?.label || 'Neutral',
      emotionalScore: analysis.emotionalScore,
      journalEntry: journalText,
      stressLevel,
      energyLevel,
      anxietyLevel,
      tags: analysis.stressIndicators.concat(analysis.positiveIndicators),
      createdAt: new Date().toISOString()
    };

    dispatch({ type: 'ADD_MOOD', payload: moodEntry });
    dispatch({ type: 'ADD_XP', payload: 20 });
    
    // Add recommendations as notifications
    analysis.recommendations.forEach(rec => {
      dispatch({ type: 'ADD_NOTIFICATION', payload: rec });
    });

    if (analysis.crisisRisk && state.profile?.crisisSupport) {
      dispatch({ 
        type: 'ADD_NOTIFICATION', 
        payload: 'I notice you might be struggling. Please consider reaching out to a crisis helpline: 988 (US) or emergency services.' 
      });
    }

    // Reset form
    setSelectedMood(null);
    setJournalText('');
    setStressLevel(50);
    setEnergyLevel(50);
    setAnxietyLevel(50);
  };

  return (
    <div className="space-y-8">
      {/* Mood Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${theme.surface} border border-white/20 rounded-xl p-6`}
      >
        <h2 className={`text-xl font-bold ${theme.text} mb-4 flex items-center gap-2`}>
          <Heart className="w-5 h-5" />
          How are you feeling right now?
        </h2>
        
        <div className="flex justify-center gap-4 mb-6">
          {moodEmojis.map((mood) => (
            <motion.button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`p-4 rounded-xl transition-all duration-200 ${
                selectedMood === mood.value
                  ? `bg-gradient-to-r ${theme.primary} scale-110 shadow-lg`
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-4xl mb-2">{mood.emoji}</div>
              <div className={`text-sm font-medium ${
                selectedMood === mood.value ? 'text-white' : theme.text
              }`}>
                {mood.label}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Level Sliders */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              <Brain className="w-4 h-4 inline mr-1" />
              Stress Level: {stressLevel}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              <Zap className="w-4 h-4 inline mr-1" />
              Energy Level: {energyLevel}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
              <Heart className="w-4 h-4 inline mr-1" />
              Anxiety Level: {anxietyLevel}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={anxietyLevel}
              onChange={(e) => setAnxietyLevel(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Journal Text */}
        <div className="mb-6">
          <label className={`block text-sm font-medium ${theme.text} mb-2`}>
            What's on your mind? (Optional)
          </label>
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Express your thoughts, feelings, or what happened today..."
            className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <motion.button
          onClick={handleSubmit}
          disabled={selectedMood === null}
          className={`w-full p-4 rounded-xl font-semibold transition-all duration-200 ${
            selectedMood !== null
              ? `bg-gradient-to-r ${theme.primary} text-white hover:shadow-lg`
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          whileHover={selectedMood !== null ? { scale: 1.02 } : {}}
          whileTap={selectedMood !== null ? { scale: 0.98 } : {}}
        >
          Track Mood & Earn 20 XP
        </motion.button>
      </motion.div>

      {/* Recent Moods */}
      {state.recentMoods.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${theme.surface} border border-white/20 rounded-xl p-6`}
        >
          <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Recent Mood Entries</h3>
          <div className="space-y-3">
            {state.recentMoods.slice(0, 5).map((mood, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {moodEmojis.find(m => m.label === mood.mood)?.emoji || '😐'}
                  </div>
                  <div>
                    <p className={`font-medium ${theme.text}`}>{mood.mood}</p>
                    <p className={`text-sm ${theme.textSecondary}`}>
                      Score: {mood.emotionalScore}/100
                    </p>
                  </div>
                </div>
                <div className={`text-sm ${theme.textSecondary}`}>
                  {new Date(mood.createdAt!).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}