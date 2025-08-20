import { EmotionalAnalysis } from '../types';

const emotionKeywords = {
  happy: ['happy', 'joy', 'excited', 'grateful', 'content', 'cheerful', 'elated', 'blissful'],
  sad: ['sad', 'down', 'depressed', 'lonely', 'hopeless', 'empty', 'grief', 'melancholy'],
  anxious: ['anxious', 'worried', 'nervous', 'panic', 'fearful', 'tense', 'restless', 'uneasy'],
  angry: ['angry', 'furious', 'irritated', 'frustrated', 'rage', 'annoyed', 'livid', 'bitter'],
  calm: ['calm', 'peaceful', 'serene', 'relaxed', 'tranquil', 'centered', 'balanced', 'zen'],
  stressed: ['stressed', 'overwhelmed', 'pressure', 'burden', 'exhausted', 'burned out', 'frazzled'],
  motivated: ['motivated', 'inspired', 'determined', 'focused', 'driven', 'ambitious', 'energized']
};

const crisisKeywords = [
  'suicide', 'kill myself', 'end it all', 'worthless', 'better off dead', 
  'no point', 'can\'t go on', 'hurt myself', 'self harm'
];

const positiveIndicators = [
  'grateful', 'accomplished', 'progress', 'better', 'improving', 'healing',
  'hopeful', 'optimistic', 'blessed', 'thankful', 'proud', 'achieved'
];

const stressIndicators = [
  'can\'t sleep', 'insomnia', 'headache', 'racing thoughts', 'can\'t focus',
  'heart racing', 'sweating', 'shaking', 'dizzy', 'nauseous'
];

export function analyzeText(text: string): EmotionalAnalysis {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  // Detect crisis risk
  const crisisRisk = crisisKeywords.some(keyword => lowerText.includes(keyword));
  
  // Count emotion keywords
  const emotionScores: Record<string, number> = {};
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    emotionScores[emotion] = keywords.filter(keyword => lowerText.includes(keyword)).length;
  }
  
  // Find primary emotion
  const primaryEmotion = Object.keys(emotionScores).reduce((a, b) => 
    emotionScores[a] > emotionScores[b] ? a : b
  );
  
  // Calculate emotional score (0-100)
  const positiveWords = positiveIndicators.filter(indicator => lowerText.includes(indicator)).length;
  const negativeEmotions = emotionScores.sad + emotionScores.anxious + emotionScores.angry + emotionScores.stressed;
  const positiveEmotions = emotionScores.happy + emotionScores.calm + emotionScores.motivated;
  
  let emotionalScore = 50; // Neutral baseline
  emotionalScore += (positiveEmotions * 10) + (positiveWords * 5);
  emotionalScore -= (negativeEmotions * 8);
  emotionalScore = Math.max(0, Math.min(100, emotionalScore));
  
  // Generate recommendations
  const recommendations: string[] = [];
  if (emotionalScore < 30) {
    recommendations.push('Try a 5-minute breathing exercise');
    recommendations.push('Consider journaling about what\'s bothering you');
    recommendations.push('Reach out to a trusted friend or family member');
    recommendations.push('Play a stress relief game to calm your mind');
    recommendations.push('Try a guided meditation or yoga session');
  } else if (emotionalScore < 50) {
    recommendations.push('Take a short walk outside');
    recommendations.push('Practice gratitude by listing 3 good things from today');
    recommendations.push('Listen to calming music');
    recommendations.push('Engage in a mindfulness activity');
  } else if (emotionalScore >= 70) {
    recommendations.push('Share your positive energy with others');
    recommendations.push('Try a new creative activity');
    recommendations.push('Set a new personal goal');
    recommendations.push('Consider scheduling a wellness activity');
  }
  
  const detectedStressIndicators = stressIndicators.filter(indicator => lowerText.includes(indicator));
  const detectedPositiveIndicators = positiveIndicators.filter(indicator => lowerText.includes(indicator));
  
  return {
    primaryEmotion: primaryEmotion || 'neutral',
    emotionalScore,
    stressIndicators: detectedStressIndicators,
    positiveIndicators: detectedPositiveIndicators,
    recommendations,
    crisisRisk
  };
}

export function generatePersonalizedResponse(
  analysis: EmotionalAnalysis, 
  responseStyle: 'gentle' | 'motivational' | 'neutral'
): string {
  const { primaryEmotion, emotionalScore, crisisRisk } = analysis;
  
  if (crisisRisk) {
    return "I notice you might be going through a really difficult time right now. Your feelings are valid, and you don't have to face this alone. Please consider reaching out to a crisis support line or a trusted person in your life. You matter, and there is help available.";
  }
  
  if (responseStyle === 'gentle') {
    if (emotionalScore < 30) {
      return `I can sense you're feeling ${primaryEmotion} right now, and that's completely okay. Your emotions are valid, and it's brave of you to acknowledge them. Take things one moment at a time, and be gentle with yourself. 💝`;
    } else if (emotionalScore < 50) {
      return `It sounds like you're experiencing some ${primaryEmotion} feelings today. Remember that it's normal to have ups and downs. You're doing the best you can, and that's enough. 🌸`;
    } else {
      return `I'm glad to hear you're feeling ${primaryEmotion}! It's wonderful when we can recognize and appreciate these positive moments. Keep nurturing this feeling. ✨`;
    }
  } else if (responseStyle === 'motivational') {
    if (emotionalScore < 30) {
      return `I see you're dealing with ${primaryEmotion} right now - and you know what? You're still here, still fighting, and that makes you incredibly strong! Every challenge is an opportunity to grow stronger. You've got this! 💪`;
    } else if (emotionalScore < 50) {
      return `Feeling ${primaryEmotion} is part of the human experience, and you're handling it like a champion! Use this as fuel to push forward and create positive change. Your resilience is inspiring! 🔥`;
    } else {
      return `Yes! That ${primaryEmotion} energy is exactly what I love to see! You're radiating positivity and strength. Channel this amazing energy into achieving your goals! 🚀`;
    }
  } else {
    if (emotionalScore < 30) {
      return `Analysis shows primary emotion: ${primaryEmotion}. Emotional score: ${emotionalScore}/100. Consider implementing stress management techniques and seeking support if needed.`;
    } else if (emotionalScore < 50) {
      return `Current emotional state: ${primaryEmotion}. Score: ${emotionalScore}/100. This indicates room for improvement through targeted wellness activities.`;
    } else {
      return `Emotional analysis: ${primaryEmotion} with score of ${emotionalScore}/100. This reflects a positive mental state. Continue current practices.`;
    }
  }
}
export function analyzeDream(dreamText: string): string[] {
  const lowerText = dreamText.toLowerCase();
  const symbols: string[] = [];
  
  const dreamSymbols = {
    'water': 'Represents emotions and the subconscious mind',
    'flying': 'Suggests freedom, ambition, or desire to escape limitations',
    'falling': 'May indicate feelings of losing control or anxiety',
    'animals': 'Often represent instincts or aspects of personality',
    'house': 'Symbolizes the self or different aspects of your life',
    'death': 'Usually represents transformation or endings leading to new beginnings',
    'chase': 'May indicate avoidance of something in waking life',
    'lost': 'Could represent feeling directionless or confused'
  };
  
  for (const [symbol, meaning] of Object.entries(dreamSymbols)) {
    if (lowerText.includes(symbol)) {
      symbols.push(`${symbol}: ${meaning}`);
    }
  }
  
  return symbols;
}