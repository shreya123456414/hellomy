import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Shield, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { MentalHealthProfile } from '../types';
import { useApp } from '../contexts/AppContext';

const questions = [
  {
    id: 'conditions',
    title: 'Help us understand your journey',
    subtitle: 'Do you currently experience or have a history of any of these? (Select all that apply)',
    type: 'multiple',
    options: [
      { value: 'anxiety', label: 'Anxiety' },
      { value: 'depression', label: 'Depression' },
      { value: 'bipolar', label: 'Bipolar disorder' },
      { value: 'ptsd', label: 'PTSD' },
      { value: 'adhd', label: 'ADHD' },
      { value: 'none', label: 'None / Prefer not to say' }
    ]
  },
  {
    id: 'treatment',
    title: 'Professional support',
    subtitle: 'Are you currently under treatment or seeing a mental health professional?',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'prefer-not-to-say', label: 'Prefer not to say' }
    ]
  },
  {
    id: 'medication',
    title: 'Medication status',
    subtitle: 'Are you currently taking any mental health medication?',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'prefer-not-to-say', label: 'Prefer not to say' }
    ]
  },
  {
    id: 'crisis',
    title: 'Crisis support',
    subtitle: 'Would you like the app to provide crisis support if signs of severe distress are detected?',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes, please provide crisis support' },
      { value: 'no', label: 'No, I prefer to handle this myself' }
    ]
  },
  {
    id: 'style',
    title: 'Communication preference',
    subtitle: 'How would you like me to respond to you?',
    type: 'single',
    options: [
      { value: 'gentle', label: '💝 Gentle - Soft, compassionate responses' },
      { value: 'motivational', label: '⚡ Motivational - Encouraging, energizing responses' },
      { value: 'neutral', label: '🎯 Neutral - Direct, balanced responses' }
    ]
  }
];

export default function Onboarding() {
  const { dispatch } = useApp();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleAnswer = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = () => {
    const profile: MentalHealthProfile = {
      userId: 'demo-user',
      conditions: Array.isArray(answers.conditions) ? answers.conditions : [answers.conditions],
      underTreatment: answers.treatment === 'yes' ? true : answers.treatment === 'no' ? false : null,
      onMedication: answers.medication === 'yes' ? true : answers.medication === 'no' ? false : null,
      crisisSupport: answers.crisis === 'yes',
      responseStyle: answers.style as 'gentle' | 'motivational' | 'neutral'
    };

    dispatch({ type: 'SET_PROFILE', payload: profile });
  };

  const question = questions[currentQuestion];
  const currentAnswer = answers[question.id];
  const canProceed = currentAnswer !== undefined && currentAnswer !== null && 
    (Array.isArray(currentAnswer) ? currentAnswer.length > 0 : true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-purple-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center"
              >
                {currentQuestion === 0 && <Heart className="w-8 h-8 text-white" />}
                {currentQuestion === 1 && <Shield className="w-8 h-8 text-white" />}
                {currentQuestion === 2 && <Shield className="w-8 h-8 text-white" />}
                {currentQuestion === 3 && <Shield className="w-8 h-8 text-white" />}
                {currentQuestion === 4 && <Sparkles className="w-8 h-8 text-white" />}
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{question.title}</h2>
              <p className="text-gray-600">{question.subtitle}</p>
            </div>

            <div className="space-y-3 mb-8">
              {question.options.map((option, index) => (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    if (question.type === 'multiple') {
                      const current = Array.isArray(currentAnswer) ? currentAnswer : [];
                      const updated = current.includes(option.value)
                        ? current.filter((v: string) => v !== option.value)
                        : [...current, option.value];
                      handleAnswer(question.id, updated);
                    } else {
                      handleAnswer(question.id, option.value);
                    }
                  }}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                    (question.type === 'multiple' && Array.isArray(currentAnswer) && currentAnswer.includes(option.value)) ||
                    (question.type === 'single' && currentAnswer === option.value)
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {((question.type === 'multiple' && Array.isArray(currentAnswer) && currentAnswer.includes(option.value)) ||
                      (question.type === 'single' && currentAnswer === option.value)) && (
                      <CheckCircle className="w-5 h-5" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            <motion.button
              onClick={nextQuestion}
              disabled={!canProceed}
              className={`w-full p-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                canProceed
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={canProceed ? { scale: 1.02 } : {}}
              whileTap={canProceed ? { scale: 0.98 } : {}}
            >
              {currentQuestion === questions.length - 1 ? 'Complete Setup' : 'Continue'}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}