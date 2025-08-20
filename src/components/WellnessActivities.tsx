import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, 
  Heart, 
  Dumbbell, 
  Headphones, 
  Play, 
  Pause, 
  SkipForward,
  Volume2,
  Timer,
  Target,
  Activity,
  Sparkles
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { themes } from '../lib/themes';

interface WellnessSession {
  id: string;
  type: 'music' | 'yoga' | 'exercise' | 'meditation';
  title: string;
  duration: number;
  completed: boolean;
  date: string;
}

export default function WellnessActivities() {
  const { state, dispatch } = useApp();
  const theme = themes[state.currentTheme];
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [sessions, setSessions] = useState<WellnessSession[]>([]);

  // Music therapy tracks based on mood
  const getMoodMusic = () => {
    const musicLibrary = {
      happy: [
        { title: 'Uplifting Piano', duration: 300, genre: 'Classical' },
        { title: 'Sunny Day Vibes', duration: 240, genre: 'Ambient' },
        { title: 'Joyful Strings', duration: 360, genre: 'Orchestral' }
      ],
      calm: [
        { title: 'Ocean Waves', duration: 600, genre: 'Nature' },
        { title: 'Peaceful Garden', duration: 480, genre: 'Ambient' },
        { title: 'Meditation Bells', duration: 420, genre: 'Spiritual' }
      ],
      stressed: [
        { title: 'Deep Relaxation', duration: 900, genre: 'Therapeutic' },
        { title: 'Stress Relief Sounds', duration: 720, genre: 'Binaural' },
        { title: 'Calming Rain', duration: 1200, genre: 'Nature' }
      ],
      sad: [
        { title: 'Healing Harmonies', duration: 540, genre: 'Therapeutic' },
        { title: 'Gentle Comfort', duration: 480, genre: 'Ambient' },
        { title: 'Emotional Support', duration: 600, genre: 'Classical' }
      ],
      motivated: [
        { title: 'Energy Boost', duration: 300, genre: 'Upbeat' },
        { title: 'Focus Flow', duration: 420, genre: 'Electronic' },
        { title: 'Motivation Mix', duration: 360, genre: 'Instrumental' }
      ]
    };
    
    return musicLibrary[state.currentTheme] || musicLibrary.calm;
  };

  // Yoga sequences based on mood and stress level
  const getYogaSequence = () => {
    const sequences = {
      beginner: [
        'Mountain Pose (2 min)',
        'Child\'s Pose (3 min)',
        'Cat-Cow Stretch (2 min)',
        'Downward Dog (2 min)',
        'Savasana (3 min)'
      ],
      stress_relief: [
        'Deep Breathing (3 min)',
        'Neck Rolls (2 min)',
        'Shoulder Shrugs (2 min)',
        'Seated Spinal Twist (3 min)',
        'Legs Up Wall (5 min)'
      ],
      energy_boost: [
        'Sun Salutation A (5 min)',
        'Warrior I & II (4 min)',
        'Tree Pose (2 min)',
        'Bridge Pose (3 min)',
        'Final Relaxation (3 min)'
      ]
    };

    if (state.recentMoods.length > 0) {
      const lastMood = state.recentMoods[0];
      if (lastMood.stressLevel > 70) return sequences.stress_relief;
      if (lastMood.energyLevel < 40) return sequences.energy_boost;
    }
    
    return sequences.beginner;
  };

  // Exercise routines
  const getExerciseRoutine = () => {
    const routines = {
      low_intensity: [
        'Gentle Stretching (5 min)',
        'Walking in Place (5 min)',
        'Arm Circles (2 min)',
        'Deep Breathing (3 min)'
      ],
      moderate: [
        'Jumping Jacks (2 min)',
        'Push-ups (3 min)',
        'Squats (3 min)',
        'Plank (2 min)',
        'Cool Down Stretch (5 min)'
      ],
      high_energy: [
        'Burpees (3 min)',
        'Mountain Climbers (3 min)',
        'High Knees (2 min)',
        'Jump Squats (3 min)',
        'Sprint Intervals (4 min)'
      ]
    };

    if (state.recentMoods.length > 0) {
      const lastMood = state.recentMoods[0];
      if (lastMood.energyLevel > 70) return routines.high_energy;
      if (lastMood.energyLevel > 40) return routines.moderate;
    }
    
    return routines.low_intensity;
  };

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && activeActivity) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= selectedDuration * 60) {
            setIsPlaying(false);
            completeSession();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, activeActivity, selectedDuration]);

  const completeSession = () => {
    const session: WellnessSession = {
      id: Date.now().toString(),
      type: activeActivity as any,
      title: getActivityTitle(activeActivity!),
      duration: selectedDuration,
      completed: true,
      date: new Date().toISOString()
    };

    setSessions(prev => [session, ...prev]);
    dispatch({ type: 'ADD_XP', payload: selectedDuration * 2 });
    
    let message = '';
    if (state.profile?.responseStyle === 'gentle') {
      message = `🌸 Beautiful work! You've completed a ${selectedDuration}-minute ${getActivityTitle(activeActivity!)} session.`;
    } else if (state.profile?.responseStyle === 'motivational') {
      message = `🔥 Amazing! You crushed that ${selectedDuration}-minute ${getActivityTitle(activeActivity!)} session!`;
    } else {
      message = `✅ Session complete: ${selectedDuration} minutes of ${getActivityTitle(activeActivity!)}`;
    }
    
    dispatch({ type: 'ADD_NOTIFICATION', payload: message });
    setActiveActivity(null);
    setCurrentTime(0);
  };

  const getActivityTitle = (activity: string) => {
    const titles = {
      music: 'Music Therapy',
      yoga: 'Yoga Practice',
      exercise: 'Exercise Routine',
      meditation: 'Meditation'
    };
    return titles[activity as keyof typeof titles] || activity;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const activities = [
    {
      id: 'music',
      name: 'Music Therapy',
      description: 'Mood-adaptive healing sounds',
      icon: Music,
      color: 'purple',
      benefit: 'Regulates emotions and reduces cortisol'
    },
    {
      id: 'yoga',
      name: 'Guided Yoga',
      description: 'Mindful movement and stretching',
      icon: Heart,
      color: 'pink',
      benefit: 'Improves flexibility and mental clarity'
    },
    {
      id: 'exercise',
      name: 'Wellness Exercise',
      description: 'Adaptive fitness routines',
      icon: Dumbbell,
      color: 'green',
      benefit: 'Boosts endorphins and energy levels'
    },
    {
      id: 'meditation',
      name: 'Meditation',
      description: 'Mindfulness and breathing exercises',
      icon: Target,
      color: 'blue',
      benefit: 'Reduces anxiety and improves focus'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${theme.surface} border border-white/20 rounded-xl p-6`}
      >
        <div className="text-center mb-6">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className={`w-16 h-16 bg-gradient-to-r ${theme.primary} rounded-full mx-auto mb-4 flex items-center justify-center`}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className={`text-2xl font-bold ${theme.text}`}>Wellness Activities</h2>
          <p className={`${theme.textSecondary} mt-2`}>
            Personalized therapeutic activities adapted to your current emotional state
          </p>
        </div>

        {/* Activity Selection */}
        {!activeActivity && (
          <div className="grid md:grid-cols-2 gap-4">
            {activities.map((activity, index) => (
              <motion.button
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveActivity(activity.id)}
                className="p-6 rounded-xl text-left transition-all duration-200 bg-white/30 hover:bg-white/50 hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-${activity.color}-100`}>
                    <activity.icon className={`w-6 h-6 text-${activity.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${theme.text} mb-1`}>{activity.name}</h3>
                    <p className={`text-sm ${theme.textSecondary} mb-2`}>{activity.description}</p>
                    <p className={`text-xs ${theme.textSecondary} italic`}>✨ {activity.benefit}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Active Session */}
      <AnimatePresence>
        {activeActivity && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`${theme.surface} border border-white/20 rounded-xl p-6`}
          >
            <div className="text-center">
              <h3 className={`text-xl font-bold ${theme.text} mb-4`}>
                {getActivityTitle(activeActivity)}
              </h3>

              {/* Duration Selection */}
              {!isPlaying && (
                <div className="mb-6">
                  <p className={`${theme.textSecondary} mb-3`}>Choose session duration:</p>
                  <div className="flex justify-center gap-2">
                    {[5, 10, 15, 20, 30].map(duration => (
                      <button
                        key={duration}
                        onClick={() => setSelectedDuration(duration)}
                        className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                          selectedDuration === duration
                            ? `bg-gradient-to-r ${theme.primary} text-white`
                            : 'bg-white/30 hover:bg-white/50'
                        }`}
                      >
                        {duration}m
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Timer Display */}
              <motion.div
                animate={{ scale: isPlaying ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
                className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r ${theme.primary} flex items-center justify-center`}
              >
                <div className="text-white text-center">
                  <div className="text-2xl font-bold">{formatTime(currentTime)}</div>
                  <div className="text-sm opacity-80">/ {selectedDuration}:00</div>
                </div>
              </motion.div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${theme.primary}`}
                    animate={{ width: `${(currentTime / (selectedDuration * 60)) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Activity Content */}
              {activeActivity === 'music' && (
                <div className="mb-6">
                  <h4 className={`font-semibold ${theme.text} mb-3`}>
                    Recommended for {state.currentTheme} mood:
                  </h4>
                  <div className="space-y-2">
                    {getMoodMusic().slice(0, 3).map((track, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Headphones className="w-4 h-4 text-purple-600" />
                          <div className="text-left">
                            <p className={`font-medium ${theme.text} text-sm`}>{track.title}</p>
                            <p className={`text-xs ${theme.textSecondary}`}>{track.genre}</p>
                          </div>
                        </div>
                        <span className={`text-xs ${theme.textSecondary}`}>
                          {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeActivity === 'yoga' && (
                <div className="mb-6">
                  <h4 className={`font-semibold ${theme.text} mb-3`}>Today's Sequence:</h4>
                  <div className="space-y-2">
                    {getYogaSequence().map((pose, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-white/30 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center">
                          <span className="text-xs font-bold text-pink-600">{index + 1}</span>
                        </div>
                        <span className={`text-sm ${theme.text}`}>{pose}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeActivity === 'exercise' && (
                <div className="mb-6">
                  <h4 className={`font-semibold ${theme.text} mb-3`}>Your Routine:</h4>
                  <div className="space-y-2">
                    {getExerciseRoutine().map((exercise, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-white/30 rounded-lg">
                        <Activity className="w-4 h-4 text-green-600" />
                        <span className={`text-sm ${theme.text}`}>{exercise}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeActivity === 'meditation' && (
                <div className="mb-6">
                  <div className={`p-4 bg-gradient-to-r ${theme.primary} bg-opacity-10 rounded-lg`}>
                    <p className={`text-sm ${theme.text} mb-2`}>
                      <strong>Focus:</strong> Breath awareness and present moment mindfulness
                    </p>
                    <p className={`text-xs ${theme.textSecondary}`}>
                      Find a comfortable position, close your eyes, and focus on your natural breathing rhythm.
                    </p>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-6 py-3 rounded-xl bg-gradient-to-r ${theme.primary} text-white font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Pause' : 'Start'}
                </button>
                
                <button
                  onClick={() => {
                    setActiveActivity(null);
                    setIsPlaying(false);
                    setCurrentTime(0);
                  }}
                  className="px-4 py-3 rounded-xl bg-white/30 hover:bg-white/50 transition-all duration-200"
                >
                  Stop
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session History */}
      {sessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${theme.surface} border border-white/20 rounded-xl p-6`}
        >
          <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
            <Timer className="w-5 h-5" />
            Recent Sessions
          </h3>
          
          <div className="space-y-3">
            {sessions.slice(0, 5).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${theme.primary}`}>
                    {activities.find(a => a.id === session.type)?.icon && 
                      React.createElement(activities.find(a => a.id === session.type)!.icon, { 
                        className: "w-4 h-4 text-white" 
                      })
                    }
                  </div>
                  <div>
                    <p className={`font-medium ${theme.text}`}>{session.title}</p>
                    <p className={`text-sm ${theme.textSecondary}`}>
                      {session.duration} minutes • {new Date(session.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-2xl">✨</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}