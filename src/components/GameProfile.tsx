import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Shield, Flame, Star, Award } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { themes } from '../lib/themes';

const abilities = [
  { id: 'inner-calm', name: 'Inner Calm', description: '5-day mindfulness streak', icon: Shield, requirement: 5 },
  { id: 'anxiety-shield', name: 'Anxiety Shield', description: '7-day breathing practice streak', icon: Shield, requirement: 7 },
  { id: 'mood-master', name: 'Mood Master', description: 'Track mood for 14 days', icon: Star, requirement: 14 },
  { id: 'dream-walker', name: 'Dream Walker', description: 'Log 10 dreams', icon: Star, requirement: 10 },
  { id: 'journal-sage', name: 'Journal Sage', description: 'Write 20 journal entries', icon: Award, requirement: 20 }
];

export default function GameProfile() {
  const { state } = useApp();
  const theme = themes[state.currentTheme];
  const gameProfile = state.gameProfile;

  if (!gameProfile) return null;

  const xpForNextLevel = (gameProfile.level * 100) - gameProfile.totalXp + (gameProfile.level * 100);
  const progressToNextLevel = (gameProfile.xp / 100) * 100;

  return (
    <div className="space-y-8">
      {/* Level and XP */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${theme.surface} border border-white/20 rounded-xl p-6`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${theme.text} flex items-center gap-2`}>
              <Trophy className="w-6 h-6" />
              Level {gameProfile.level} Healer
            </h2>
            <p className={`${theme.textSecondary} mt-1`}>
              {gameProfile.totalXp} total XP earned on your healing journey
            </p>
          </div>
          <div className={`p-4 rounded-xl bg-gradient-to-r ${theme.primary}`}>
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* XP Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className={theme.text}>Progress to Level {gameProfile.level + 1}</span>
            <span className={theme.text}>{gameProfile.xp}/100 XP</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${theme.primary}`}
              initial={{ width: 0 }}
              animate={{ width: `${progressToNextLevel}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Active Streaks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`${theme.surface} border border-white/20 rounded-xl p-6`}
      >
        <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
          <Flame className="w-5 h-5" />
          Active Streaks
        </h3>
        
        {Object.keys(gameProfile.streaks).length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(gameProfile.streaks).map(([activity, streak]) => (
              <div key={activity} className="flex items-center justify-between p-4 bg-white/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className={`font-medium ${theme.text} capitalize`}>{activity}</p>
                    <p className={`text-sm ${theme.textSecondary}`}>{streak} days</p>
                  </div>
                </div>
                <div className="text-2xl">🔥</div>
              </div>
            ))}
          </div>
        ) : (
          <p className={`${theme.textSecondary} text-center py-8`}>
            Start tracking your mood or journaling to build streaks!
          </p>
        )}
      </motion.div>

      {/* Abilities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`${theme.surface} border border-white/20 rounded-xl p-6`}
      >
        <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
          <Star className="w-5 h-5" />
          Healing Abilities
        </h3>
        
        <div className="space-y-4">
          {abilities.map((ability) => {
            const isUnlocked = gameProfile.abilities.includes(ability.name);
            const IconComponent = ability.icon;
            
            return (
              <motion.div
                key={ability.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-200 ${
                  isUnlocked
                    ? `bg-gradient-to-r ${theme.primary} text-white`
                    : 'bg-white/30'
                }`}
              >
                <div className={`p-2 rounded-lg ${isUnlocked ? 'bg-white/20' : `bg-gradient-to-r ${theme.primary}`}`}>
                  <IconComponent className={`w-5 h-5 ${isUnlocked ? 'text-white' : 'text-white'}`} />
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${isUnlocked ? 'text-white' : theme.text}`}>
                    {ability.name}
                  </h4>
                  <p className={`text-sm ${isUnlocked ? 'text-white/80' : theme.textSecondary}`}>
                    {ability.description}
                  </p>
                </div>
                {isUnlocked ? (
                  <div className="text-2xl">✨</div>
                ) : (
                  <div className={`text-sm ${theme.textSecondary} text-center`}>
                    <p>Locked</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}