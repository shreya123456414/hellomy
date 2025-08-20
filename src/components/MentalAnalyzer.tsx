import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Heart, 
  Zap, 
  Shield,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Lightbulb,
  Clock,
  Users
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar } from 'recharts';
import { useApp } from '../contexts/AppContext';
import { themes } from '../lib/themes';
import { format, subDays, parseISO } from 'date-fns';

interface MentalHealthInsight {
  category: string;
  insight: string;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
  confidence: number;
}

interface EmotionalPattern {
  emotion: string;
  frequency: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  triggers: string[];
}

export default function MentalAnalyzer() {
  const { state } = useApp();
  const theme = themes[state.currentTheme];
  const [analysisType, setAnalysisType] = useState<'overview' | 'patterns' | 'insights' | 'predictions'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [insights, setInsights] = useState<MentalHealthInsight[]>([]);
  const [patterns, setPatterns] = useState<EmotionalPattern[]>([]);

  // Generate mock data for demonstration
  useEffect(() => {
    generateInsights();
    generatePatterns();
  }, [state.recentMoods, timeRange]);

  const generateInsights = () => {
    const mockInsights: MentalHealthInsight[] = [
      {
        category: 'Emotional Stability',
        insight: 'Your emotional scores show high variability (±25 points) over the past week',
        severity: 'medium',
        recommendation: 'Consider implementing daily mindfulness practices to improve emotional regulation',
        confidence: 85
      },
      {
        category: 'Stress Patterns',
        insight: 'Stress levels peak consistently on Monday and Wednesday evenings',
        severity: 'high',
        recommendation: 'Schedule relaxation activities before these high-stress periods',
        confidence: 92
      },
      {
        category: 'Sleep-Mood Correlation',
        insight: 'Lower mood scores correlate with entries made after 11 PM',
        severity: 'medium',
        recommendation: 'Establish an earlier evening routine to improve mood stability',
        confidence: 78
      },
      {
        category: 'Positive Indicators',
        insight: 'Gratitude expressions have increased by 40% this month',
        severity: 'low',
        recommendation: 'Continue gratitude practices - they\'re showing measurable benefits',
        confidence: 95
      }
    ];
    setInsights(mockInsights);
  };

  const generatePatterns = () => {
    const mockPatterns: EmotionalPattern[] = [
      {
        emotion: 'Anxiety',
        frequency: 35,
        trend: 'decreasing',
        triggers: ['work deadlines', 'social situations', 'financial concerns']
      },
      {
        emotion: 'Joy',
        frequency: 28,
        trend: 'increasing',
        triggers: ['exercise', 'time with friends', 'creative activities']
      },
      {
        emotion: 'Stress',
        frequency: 42,
        trend: 'stable',
        triggers: ['workload', 'time pressure', 'decision making']
      },
      {
        emotion: 'Calm',
        frequency: 25,
        trend: 'increasing',
        triggers: ['meditation', 'nature walks', 'reading']
      }
    ];
    setPatterns(mockPatterns);
  };

  // Generate chart data
  const generateMoodTrendData = () => {
    const days = parseInt(timeRange.replace('d', ''));
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), days - i - 1);
      return {
        date: format(date, 'MMM dd'),
        mood: Math.floor(Math.random() * 40) + 40 + (Math.sin(i / 7) * 15),
        stress: Math.floor(Math.random() * 30) + 30,
        energy: Math.floor(Math.random() * 35) + 45
      };
    });
  };

  const generateEmotionDistribution = () => {
    return [
      { name: 'Happy', value: 25, color: '#10B981' },
      { name: 'Calm', value: 20, color: '#3B82F6' },
      { name: 'Anxious', value: 18, color: '#F59E0B' },
      { name: 'Stressed', value: 15, color: '#EF4444' },
      { name: 'Sad', value: 12, color: '#8B5CF6' },
      { name: 'Motivated', value: 10, color: '#06B6D4' }
    ];
  };

  const moodTrendData = generateMoodTrendData();
  const emotionDistribution = generateEmotionDistribution();

  const analysisTypes = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'patterns', name: 'Patterns', icon: TrendingUp },
    { id: 'insights', name: 'Insights', icon: Lightbulb },
    { id: 'predictions', name: 'Predictions', icon: Target }
  ];

  const timeRanges = [
    { id: '7d', name: '7 Days' },
    { id: '30d', name: '30 Days' },
    { id: '90d', name: '90 Days' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${theme.surface} border border-white/20 rounded-xl p-6`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${theme.text} flex items-center gap-3`}>
              <div className={`p-3 rounded-xl bg-gradient-to-r ${theme.primary}`}>
                <Brain className="w-6 h-6 text-white" />
              </div>
              Mental Health Analyzer
            </h2>
            <p className={`${theme.textSecondary} mt-2`}>
              Deep psychological insights and pattern recognition from your mental health data
            </p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex gap-2">
            {timeRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  timeRange === range.id
                    ? `bg-gradient-to-r ${theme.primary} text-white`
                    : `${theme.textSecondary} hover:bg-white/50`
                }`}
              >
                {range.name}
              </button>
            ))}
          </div>
        </div>

        {/* Analysis Type Navigation */}
        <div className="flex gap-2 overflow-x-auto">
          {analysisTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setAnalysisType(type.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all duration-200 ${
                analysisType === type.id
                  ? `bg-gradient-to-r ${theme.primary} text-white shadow-lg`
                  : `bg-white/30 ${theme.textSecondary} hover:bg-white/50`
              }`}
            >
              <type.icon className="w-4 h-4" />
              {type.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Overview Tab */}
      {analysisType === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mood Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${theme.surface} border border-white/20 rounded-xl p-6`}
          >
            <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
              <Activity className="w-5 h-5" />
              Mood Trends Over Time
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Line type="monotone" dataKey="mood" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} />
                  <Line type="monotone" dataKey="stress" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }} />
                  <Line type="monotone" dataKey="energy" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Emotion Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${theme.surface} border border-white/20 rounded-xl p-6`}
          >
            <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
              <PieChart className="w-5 h-5" />
              Emotion Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={emotionDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {emotionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {emotionDistribution.map((emotion) => (
                <div key={emotion.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: emotion.color }} />
                  <span className={`text-sm ${theme.textSecondary}`}>
                    {emotion.name} ({emotion.value}%)
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Patterns Tab */}
      {analysisType === 'patterns' && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${theme.surface} border border-white/20 rounded-xl p-6`}
          >
            <h3 className={`text-lg font-semibold ${theme.text} mb-6 flex items-center gap-2`}>
              <TrendingUp className="w-5 h-5" />
              Emotional Patterns & Triggers
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {patterns.map((pattern, index) => (
                <motion.div
                  key={pattern.emotion}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/30 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-semibold ${theme.text}`}>{pattern.emotion}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${theme.textSecondary}`}>{pattern.frequency}%</span>
                      <div className={`p-1 rounded-full ${
                        pattern.trend === 'increasing' ? 'bg-green-100' :
                        pattern.trend === 'decreasing' ? 'bg-red-100' : 'bg-gray-100'
                      }`}>
                        <TrendingUp className={`w-3 h-3 ${
                          pattern.trend === 'increasing' ? 'text-green-600' :
                          pattern.trend === 'decreasing' ? 'text-red-600 rotate-180' : 'text-gray-600'
                        }`} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${theme.primary}`}
                        style={{ width: `${pattern.frequency}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <p className={`text-xs ${theme.textSecondary} mb-2`}>Common Triggers:</p>
                    <div className="flex flex-wrap gap-1">
                      {pattern.triggers.map((trigger, i) => (
                        <span key={i} className="px-2 py-1 bg-white/50 rounded-full text-xs">
                          {trigger}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Insights Tab */}
      {analysisType === 'insights' && (
        <div className="space-y-6">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${theme.surface} border border-white/20 rounded-xl p-6`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  insight.severity === 'high' ? 'bg-red-100' :
                  insight.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  {insight.severity === 'high' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                  {insight.severity === 'medium' && <Clock className="w-5 h-5 text-yellow-600" />}
                  {insight.severity === 'low' && <Shield className="w-5 h-5 text-green-600" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold ${theme.text}`}>{insight.category}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      insight.confidence >= 90 ? 'bg-green-100 text-green-800' :
                      insight.confidence >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {insight.confidence}% confidence
                    </span>
                  </div>
                  
                  <p className={`${theme.text} mb-3`}>{insight.insight}</p>
                  
                  <div className={`p-3 bg-gradient-to-r ${theme.primary} bg-opacity-10 rounded-lg`}>
                    <p className={`text-sm ${theme.text}`}>
                      <strong>Recommendation:</strong> {insight.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Predictions Tab */}
      {analysisType === 'predictions' && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${theme.surface} border border-white/20 rounded-xl p-6`}
          >
            <h3 className={`text-lg font-semibold ${theme.text} mb-6 flex items-center gap-2`}>
              <Target className="w-5 h-5" />
              Predictive Mental Health Analysis
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Risk Prediction */}
              <div className="p-4 bg-white/30 rounded-xl">
                <h4 className={`font-semibold ${theme.text} mb-3 flex items-center gap-2`}>
                  <AlertTriangle className="w-4 h-4" />
                  Risk Assessment
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme.textSecondary}`}>Stress Episode Risk</span>
                    <span className="text-sm font-medium text-yellow-600">Medium (35%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme.textSecondary}`}>Mood Drop Risk</span>
                    <span className="text-sm font-medium text-green-600">Low (15%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme.textSecondary}`}>Anxiety Spike Risk</span>
                    <span className="text-sm font-medium text-red-600">High (65%)</span>
                  </div>
                </div>
              </div>

              {/* Wellness Forecast */}
              <div className="p-4 bg-white/30 rounded-xl">
                <h4 className={`font-semibold ${theme.text} mb-3 flex items-center gap-2`}>
                  <Calendar className="w-4 h-4" />
                  7-Day Wellness Forecast
                </h4>
                <div className="space-y-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div key={day} className="flex justify-between items-center">
                      <span className={`text-sm ${theme.textSecondary}`}>{day}</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-16 h-2 bg-gray-200 rounded-full overflow-hidden`}>
                          <div 
                            className={`h-full ${
                              i % 3 === 0 ? 'bg-green-500' : 
                              i % 3 === 1 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${60 + (i * 5)}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">
                          {60 + (i * 5)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Personalized Recommendations */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <h4 className={`font-semibold ${theme.text} mb-3 flex items-center gap-2`}>
                <Lightbulb className="w-4 h-4" />
                AI-Powered Recommendations
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className={`text-sm font-medium ${theme.text} mb-2`}>Immediate Actions</h5>
                  <ul className={`text-sm ${theme.textSecondary} space-y-1`}>
                    <li>• Schedule 10-min breathing exercise for 3 PM</li>
                    <li>• Avoid caffeine after 2 PM today</li>
                    <li>• Take a 5-min walk before your 4 PM meeting</li>
                  </ul>
                </div>
                <div>
                  <h5 className={`text-sm font-medium ${theme.text} mb-2`}>Weekly Goals</h5>
                  <ul className={`text-sm ${theme.textSecondary} space-y-1`}>
                    <li>• Maintain 7+ hours sleep for 5 days</li>
                    <li>• Complete 3 mindfulness sessions</li>
                    <li>• Journal for 15 minutes, 4 times this week</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Mental Health Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`${theme.surface} border border-white/20 rounded-xl p-6`}
      >
        <h3 className={`text-lg font-semibold ${theme.text} mb-6 flex items-center gap-2`}>
          <Heart className="w-5 h-5" />
          Mental Health Score Card
        </h3>
        
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: 'Overall Wellness', score: 78, color: 'blue', icon: Heart },
            { label: 'Emotional Stability', score: 65, color: 'purple', icon: Shield },
            { label: 'Stress Management', score: 82, color: 'green', icon: Zap },
            { label: 'Resilience Factor', score: 71, color: 'orange', icon: Target }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + (index * 0.1) }}
              className="text-center p-4 bg-white/30 rounded-xl"
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-${metric.color}-100 flex items-center justify-center`}>
                <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
              </div>
              <div className={`text-2xl font-bold ${theme.text} mb-1`}>{metric.score}</div>
              <div className={`text-xs ${theme.textSecondary}`}>{metric.label}</div>
              <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-${metric.color}-500`}
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.score}%` }}
                  transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}