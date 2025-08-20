import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Star, Brain, Save, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { themes } from '../lib/themes';
import { analyzeDream } from '../lib/emotionalAnalysis';

export default function DreamJournal() {
  const { state, dispatch } = useApp();
  const theme = themes[state.currentTheme];
  const [dreamText, setDreamText] = useState('');
  const [dreamMood, setDreamMood] = useState('');
  const [symbols, setSymbols] = useState<string[]>([]);

  const handleAnalyze = () => {
    if (dreamText.trim()) {
      const dreamSymbols = analyzeDream(dreamText);
      setSymbols(dreamSymbols);
    }
  };

  const handleSave = () => {
    if (dreamText.trim()) {
      // Add dream as a special mood entry
      dispatch({
        type: 'ADD_MOOD',
        payload: {
          userId: state.currentUser,
          mood: dreamMood || 'dreamy',
          emotionalScore: 60, // Neutral dream score
          dreamEntry: dreamText,
          stressLevel: 30,
          energyLevel: 70,
          anxietyLevel: 20,
          tags: ['dream', 'subconscious'],
          createdAt: new Date().toISOString()
        }
      });

      dispatch({ type: 'ADD_XP', payload: 25 });
      
      let response = '';
      if (state.profile?.responseStyle === 'gentle') {
        response = '🌙 Thank you for sharing your dream. Dreams can offer beautiful insights into our inner world.';
      } else if (state.profile?.responseStyle === 'motivational') {
        response = '⭐ Excellent dream journaling! You\'re exploring the depths of your subconscious mind.';
      } else {
        response = '🎯 Dream logged successfully. Your subconscious patterns are being tracked.';
      }
      
      dispatch({ type: 'ADD_NOTIFICATION', payload: response });
      
      setDreamText('');
      setDreamMood('');
      setSymbols([]);
    }
  };

  const dreamMoods = [
    { emoji: '🌙', label: 'Peaceful', value: 'peaceful' },
    { emoji: '⭐', label: 'Magical', value: 'magical' },
    { emoji: '🌊', label: 'Emotional', value: 'emotional' },
    { emoji: '🔥', label: 'Intense', value: 'intense' },
    { emoji: '🌸', label: 'Pleasant', value: 'pleasant' },
    { emoji: '⚡', label: 'Strange', value: 'strange' }
  ];

  return (
    <div className="space-y-8">
      {/* Dream Entry Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${theme.surface} border border-white/20 rounded-xl p-6`}
      >
        <div className="text-center mb-6">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className={`w-16 h-16 bg-gradient-to-r ${theme.primary} rounded-full mx-auto mb-4 flex items-center justify-center`}
          >
            <Moon className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className={`text-xl font-bold ${theme.text}`}>AI Dream Journal</h2>
          <p className={`${theme.textSecondary} mt-1`}>
            Explore your subconscious mind and discover hidden patterns
          </p>
        </div>

        {/* Dream Mood Selection */}
        <div className="mb-6">
          <label className={`block text-sm font-medium ${theme.text} mb-3`}>
            How did your dream feel?
          </label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {dreamMoods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setDreamMood(mood.value)}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  dreamMood === mood.value
                    ? `bg-gradient-to-r ${theme.primary} scale-105 shadow-lg`
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              >
                <div className="text-2xl mb-1">{mood.emoji}</div>
                <div className={`text-xs ${
                  dreamMood === mood.value ? 'text-white' : theme.text
                }`}>
                  {mood.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dream Description */}
        <div className="mb-6">
          <label className={`block text-sm font-medium ${theme.text} mb-2`}>
            Describe your dream
          </label>
          <textarea
            value={dreamText}
            onChange={(e) => setDreamText(e.target.value)}
            placeholder="What happened in your dream? Include people, places, emotions, colors, and any symbols you remember..."
            className="w-full h-48 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={handleAnalyze}
            disabled={!dreamText.trim()}
            className={`flex-1 p-3 rounded-xl font-medium transition-all duration-200 ${
              dreamText.trim()
                ? 'bg-white/50 hover:bg-white/70 text-gray-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={dreamText.trim() ? { scale: 1.02 } : {}}
          >
            <Brain className="w-4 h-4 inline mr-2" />
            Analyze Symbols
          </motion.button>
          
          <motion.button
            onClick={handleSave}
            disabled={!dreamText.trim()}
            className={`flex-1 p-3 rounded-xl font-medium transition-all duration-200 ${
              dreamText.trim()
                ? `bg-gradient-to-r ${theme.primary} text-white hover:shadow-lg`
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={dreamText.trim() ? { scale: 1.02 } : {}}
          >
            <Save className="w-4 h-4 inline mr-2" />
            Save Dream & Earn 25 XP
          </motion.button>
        </div>
      </motion.div>

      {/* Dream Symbol Analysis */}
      {symbols.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${theme.surface} border border-white/20 rounded-xl p-6`}
        >
          <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
            <Sparkles className="w-5 h-5" />
            Dream Symbol Analysis
          </h3>
          
          <div className="space-y-4">
            {symbols.map((symbol, index) => {
              const [symbolName, meaning] = symbol.split(': ');
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/30 rounded-lg"
                >
                  <h4 className={`font-semibold ${theme.text} capitalize mb-1`}>
                    {symbolName}
                  </h4>
                  <p className={`text-sm ${theme.textSecondary}`}>
                    {meaning}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className={`mt-4 p-4 bg-gradient-to-r ${theme.primary} bg-opacity-10 rounded-lg`}>
            <p className={`text-sm ${theme.text}`}>
              💫 <strong>Dream Insight:</strong> Your subconscious mind is processing experiences and emotions through these symbols. 
              Regular dream journaling can help you understand recurring patterns and emotional themes in your life.
            </p>
          </div>
        </motion.div>
      )}

      {/* Recent Dreams */}
      {state.recentMoods.filter(m => m.dreamEntry).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${theme.surface} border border-white/20 rounded-xl p-6`}
        >
          <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
            <Star className="w-5 h-5" />
            Recent Dreams
          </h3>
          <div className="space-y-4">
            {state.recentMoods
              .filter(m => m.dreamEntry)
              .slice(0, 3)
              .map((entry, index) => (
                <div key={index} className="p-4 bg-white/30 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`font-medium ${theme.text}`}>
                      {new Date(entry.createdAt!).toLocaleDateString()}
                    </span>
                    <span className={`text-sm ${theme.textSecondary} capitalize`}>
                      {entry.mood}
                    </span>
                  </div>
                  <p className={`${theme.text} text-sm line-clamp-3`}>
                    {entry.dreamEntry}
                  </p>
                </div>
              ))
            }
          </div>
        </motion.div>
      )}

      {/* Dream Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`${theme.surface} border border-white/20 rounded-xl p-6`}
      >
        <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Dream Journaling Tips</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className={`p-1 rounded-full bg-gradient-to-r ${theme.primary} mt-1`}>
                <div className="w-2 h-2" />
              </div>
              <div>
                <h4 className={`font-medium ${theme.text} text-sm`}>Keep by your bedside</h4>
                <p className={`text-xs ${theme.textSecondary}`}>Dreams fade quickly upon waking</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className={`p-1 rounded-full bg-gradient-to-r ${theme.primary} mt-1`}>
                <div className="w-2 h-2" />
              </div>
              <div>
                <h4 className={`font-medium ${theme.text} text-sm`}>Record immediately</h4>
                <p className={`text-xs ${theme.textSecondary}`}>Capture details before they disappear</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className={`p-1 rounded-full bg-gradient-to-r ${theme.primary} mt-1`}>
                <div className="w-2 h-2" />
              </div>
              <div>
                <h4 className={`font-medium ${theme.text} text-sm`}>Include emotions</h4>
                <p className={`text-xs ${theme.textSecondary}`}>How did the dream make you feel?</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className={`p-1 rounded-full bg-gradient-to-r ${theme.primary} mt-1`}>
                <div className="w-2 h-2" />
              </div>
              <div>
                <h4 className={`font-medium ${theme.text} text-sm`}>Look for patterns</h4>
                <p className={`text-xs ${theme.textSecondary}`}>Recurring themes reveal insights</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}