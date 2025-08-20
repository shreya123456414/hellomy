import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Heart, 
  Zap, 
  Trophy, 
  BookOpen, 
  Moon, 
  Users,
  TrendingUp,
  Shield,
  Sparkles,
  Gamepad2,
  Activity,
  Phone,
  Calendar
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { themes } from '../lib/themes';
import MoodTracker from './MoodTracker';
import GameProfile from './GameProfile';
import JournalEntry from './JournalEntry';
import DreamJournal from './DreamJournal';
import MentalAnalyzer from './MentalAnalyzer';
import StressReliefGames from './StressReliefGames';
import WellnessActivities from './WellnessActivities';
import EmergencySupport from './EmergencySupport';
import AppointmentScheduler from './AppointmentScheduler';

export default function Dashboard() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('mood');
  const theme = themes[state.currentTheme];

  const tabs = [
    { id: 'mood', name: 'Mood', icon: Heart },
    { id: 'journal', name: 'Journal', icon: BookOpen },
    { id: 'dreams', name: 'Dreams', icon: Moon },
    { id: 'analyzer', name: 'Analyzer', icon: Brain },
    { id: 'progress', name: 'Progress', icon: TrendingUp },
    { id: 'games', name: 'Games', icon: Gamepad2 },
    { id: 'wellness', name: 'Wellness', icon: Activity },
    { id: 'emergency', name: 'Emergency', icon: Phone },
    { id: 'appointments', name: 'Appointments', icon: Calendar },
  ];

  const stats = [
    { label: 'Current Level', value: state.gameProfile?.level || 1, icon: Trophy },
    { label: 'Total XP', value: state.gameProfile?.totalXp || 0, icon: Zap },
    { label: 'Active Streaks', value: Object.keys(state.gameProfile?.streaks || {}).length, icon: Shield },
    { label: 'Journal Entries', value: state.recentMoods.length, icon: BookOpen },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} transition-all duration-1000`}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-3xl font-bold bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent`}>
                Mental Health Companion
              </h1>
              <p className={`${theme.textSecondary} mt-1`}>
                Welcome back! Let's continue your healing journey.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${theme.primary} animate-pulse`} />
              <span className={`text-sm ${theme.textSecondary}`}>
                Theme: {state.currentTheme}
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${theme.surface} border border-white/20 rounded-xl p-4`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${theme.primary}`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className={`text-sm ${theme.textSecondary}`}>{stat.label}</p>
                    <p className={`text-2xl font-bold ${theme.text}`}>{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6">
        <div className={`${theme.surface} border border-white/20 rounded-xl p-2 mb-8 inline-flex`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${theme.primary} text-white`
                  : `${theme.textSecondary} hover:bg-white/50`
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'mood' && <MoodTracker />}
          {activeTab === 'journal' && <JournalEntry />}
          {activeTab === 'dreams' && <DreamJournal />}
          {activeTab === 'analyzer' && <MentalAnalyzer />}
          {activeTab === 'progress' && <GameProfile />}
          {activeTab === 'games' && <StressReliefGames />}
          {activeTab === 'wellness' && <WellnessActivities />}
          {activeTab === 'emergency' && <EmergencySupport />}
          {activeTab === 'appointments' && <AppointmentScheduler />}
        </motion.div>

        {/* Notifications */}
        {state.notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-6 right-6 max-w-sm"
          >
            {state.notifications.slice(0, 3).map((notification, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${theme.surface} border border-white/20 rounded-xl p-4 mb-2 shadow-lg`}
              >
                <div className="flex items-start gap-3">
                  <Sparkles className={`w-5 h-5 ${theme.text} mt-0.5`} />
                  <p className={`text-sm ${theme.text}`}>{notification}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}