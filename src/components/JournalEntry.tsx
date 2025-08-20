import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Save, Mic, MicOff, Brain } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { themes } from '../lib/themes';
import { analyzeText } from '../lib/emotionalAnalysis';

export default function JournalEntry() {
  const { state, dispatch } = useApp();
  const theme = themes[state.currentTheme];
  const [journalText, setJournalText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = () => {
    if (journalText.trim()) {
      const result = analyzeText(journalText);
      setAnalysis(result);
    }
  };

  const handleSave = () => {
    if (journalText.trim()) {
      const analysis = analyzeText(journalText);
      
      // Add to mood entries as journal-focused entry
      dispatch({
        type: 'ADD_MOOD',
        payload: {
          userId: state.currentUser,
          mood: analysis.primaryEmotion,
          emotionalScore: analysis.emotionalScore,
          journalEntry: journalText,
          stressLevel: 50,
          energyLevel: 50,
          anxietyLevel: 50,
          tags: analysis.stressIndicators.concat(analysis.positiveIndicators),
          createdAt: new Date().toISOString()
        }
      });

      dispatch({ type: 'ADD_XP', payload: 15 });
      
      // Add personalized response based on profile style
      let response = '';
      if (state.profile?.responseStyle === 'gentle') {
        response = '💝 Thank you for sharing your thoughts. Your feelings are valid and important.';
      } else if (state.profile?.responseStyle === 'motivational') {
        response = '⚡ Great job journaling! You\'re building emotional awareness and resilience.';
      } else {
        response = '🎯 Journal entry saved. Your emotional score today: ' + analysis.emotionalScore;
      }
      
      dispatch({ type: 'ADD_NOTIFICATION', payload: response });
      
      setJournalText('');
      setAnalysis(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Writing Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${theme.surface} border border-white/20 rounded-xl p-6`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold ${theme.text} flex items-center gap-2`}>
            <BookOpen className="w-5 h-5" />
            Therapeutic Journal
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isRecording 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : `bg-gradient-to-r ${theme.primary} text-white`
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="What's happening in your world today? Write about your thoughts, feelings, experiences, or anything that comes to mind..."
            className="w-full h-64 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700"
          />
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={handleAnalyze}
            disabled={!journalText.trim()}
            className={`flex-1 p-3 rounded-xl font-medium transition-all duration-200 ${
              journalText.trim()
                ? 'bg-white/50 hover:bg-white/70 text-gray-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={journalText.trim() ? { scale: 1.02 } : {}}
          >
            <Brain className="w-4 h-4 inline mr-2" />
            Analyze Emotions
          </motion.button>
          
          <motion.button
            onClick={handleSave}
            disabled={!journalText.trim()}
            className={`flex-1 p-3 rounded-xl font-medium transition-all duration-200 ${
              journalText.trim()
                ? `bg-gradient-to-r ${theme.primary} text-white hover:shadow-lg`
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={journalText.trim() ? { scale: 1.02 } : {}}
          >
            <Save className="w-4 h-4 inline mr-2" />
            Save & Earn 15 XP
          </motion.button>
        </div>
      </motion.div>

      {/* Analysis Results */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${theme.surface} border border-white/20 rounded-xl p-6`}
        >
          <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Emotional Analysis</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className={`font-medium ${theme.text} mb-2`}>Primary Emotion</h4>
              <p className={`text-2xl font-bold capitalize bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent`}>
                {analysis.primaryEmotion}
              </p>
              <p className={`text-sm ${theme.textSecondary} mt-1`}>
                Emotional Score: {analysis.emotionalScore}/100
              </p>
            </div>
            
            <div>
              <h4 className={`font-medium ${theme.text} mb-2`}>Recommendations</h4>
              <ul className={`text-sm ${theme.textSecondary} space-y-1`}>
                {analysis.recommendations.slice(0, 3).map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {analysis.positiveIndicators.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h5 className="font-medium text-green-800 mb-2">Positive Indicators Detected:</h5>
              <div className="flex flex-wrap gap-2">
                {analysis.positiveIndicators.map((indicator: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-sm">
                    {indicator}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.stressIndicators.length > 0 && (
            <div className="mt-4 p-4 bg-orange-50 rounded-lg">
              <h5 className="font-medium text-orange-800 mb-2">Stress Indicators Detected:</h5>
              <div className="flex flex-wrap gap-2">
                {analysis.stressIndicators.map((indicator: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-sm">
                    {indicator}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Previous Entries */}
      {state.recentMoods.filter(m => m.journalEntry).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${theme.surface} border border-white/20 rounded-xl p-6`}
        >
          <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Recent Journal Entries</h3>
          <div className="space-y-4">
            {state.recentMoods
              .filter(m => m.journalEntry)
              .slice(0, 3)
              .map((entry, index) => (
                <div key={index} className="p-4 bg-white/30 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`font-medium ${theme.text}`}>
                      {new Date(entry.createdAt!).toLocaleDateString()}
                    </span>
                    <span className={`text-sm ${theme.textSecondary}`}>
                      {entry.emotionalScore}/100
                    </span>
                  </div>
                  <p className={`${theme.text} text-sm line-clamp-3`}>
                    {entry.journalEntry}
                  </p>
                </div>
              ))
            }
          </div>
        </motion.div>
      )}
    </div>
  );
}