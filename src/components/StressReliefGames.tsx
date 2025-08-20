import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, 
  Puzzle, 
  Brain, 
  Target, 
  Timer, 
  Star,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Zap
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { themes } from '../lib/themes';

interface GameScore {
  game: string;
  score: number;
  time: number;
  completed: boolean;
}

export default function StressReliefGames() {
  const { state, dispatch } = useApp();
  const theme = themes[state.currentTheme];
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameScores, setGameScores] = useState<GameScore[]>([]);

  // Breathing Exercise Game
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [breathingCount, setBreathingCount] = useState(0);
  const [breathingActive, setBreathingActive] = useState(false);

  // Memory Game
  const [memoryCards, setMemoryCards] = useState<number[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);

  // Color Therapy Game
  const [colorSequence, setColorSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [colorLevel, setColorLevel] = useState(1);

  // Puzzle Game
  const [puzzlePieces, setPuzzlePieces] = useState<number[]>([]);
  const [puzzleMoves, setPuzzleMoves] = useState(0);
  const [puzzleComplete, setPuzzleComplete] = useState(false);

  const games = [
    {
      id: 'breathing',
      name: '4-7-8 Breathing',
      description: 'Calm your nervous system with guided breathing',
      icon: Target,
      color: 'blue',
      benefit: 'Reduces anxiety and promotes relaxation'
    },
    {
      id: 'memory',
      name: 'Memory Cards',
      description: 'Improve focus and cognitive function',
      icon: Brain,
      color: 'purple',
      benefit: 'Enhances concentration and mindfulness'
    },
    {
      id: 'colors',
      name: 'Color Therapy',
      description: 'Follow the calming color patterns',
      icon: Star,
      color: 'green',
      benefit: 'Stimulates positive emotions and creativity'
    },
    {
      id: 'puzzle',
      name: 'Sliding Puzzle',
      description: 'Organize your thoughts through problem-solving',
      icon: Puzzle,
      color: 'orange',
      benefit: 'Improves problem-solving and reduces stress'
    }
  ];

  // Breathing Exercise Logic
  useEffect(() => {
    if (!breathingActive) return;

    const phases = [
      { name: 'inhale', duration: 4000 },
      { name: 'hold', duration: 7000 },
      { name: 'exhale', duration: 8000 },
      { name: 'pause', duration: 1000 }
    ];

    const currentPhase = phases.find(p => p.name === breathingPhase);
    if (!currentPhase) return;

    const timer = setTimeout(() => {
      const currentIndex = phases.findIndex(p => p.name === breathingPhase);
      const nextIndex = (currentIndex + 1) % phases.length;
      setBreathingPhase(phases[nextIndex].name as any);
      
      if (breathingPhase === 'pause') {
        setBreathingCount(prev => prev + 1);
        if (breathingCount >= 4) {
          setBreathingActive(false);
          completeGame('breathing', breathingCount * 25, 60);
        }
      }
    }, currentPhase.duration);

    return () => clearTimeout(timer);
  }, [breathingPhase, breathingActive, breathingCount]);

  // Memory Game Logic
  const initializeMemoryGame = () => {
    const cards = Array.from({ length: 16 }, (_, i) => Math.floor(i / 2));
    setMemoryCards(cards.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMatchedCards([]);
    setMemoryMoves(0);
  };

  const flipCard = (index: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) return;

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves(prev => prev + 1);
      
      if (memoryCards[newFlipped[0]] === memoryCards[newFlipped[1]]) {
        setMatchedCards(prev => [...prev, ...newFlipped]);
        setFlippedCards([]);
        
        if (matchedCards.length + 2 === memoryCards.length) {
          completeGame('memory', Math.max(100 - memoryMoves * 5, 20), memoryMoves * 2);
        }
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  // Color Therapy Logic
  const startColorGame = () => {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const sequence = Array.from({ length: colorLevel + 2 }, () => 
      colors[Math.floor(Math.random() * colors.length)]
    );
    setColorSequence(sequence);
    setUserSequence([]);
    setShowingSequence(true);

    setTimeout(() => setShowingSequence(false), sequence.length * 800);
  };

  const addColorToSequence = (color: string) => {
    const newSequence = [...userSequence, color];
    setUserSequence(newSequence);

    if (newSequence[newSequence.length - 1] !== colorSequence[newSequence.length - 1]) {
      // Wrong color
      setUserSequence([]);
      setColorLevel(1);
    } else if (newSequence.length === colorSequence.length) {
      // Completed level
      setColorLevel(prev => prev + 1);
      completeGame('colors', colorLevel * 20, colorLevel * 10);
      setTimeout(startColorGame, 1000);
    }
  };

  // Puzzle Game Logic
  const initializePuzzle = () => {
    const pieces = Array.from({ length: 15 }, (_, i) => i + 1).concat([0]);
    setPuzzlePieces(pieces.sort(() => Math.random() - 0.5));
    setPuzzleMoves(0);
    setPuzzleComplete(false);
  };

  const movePuzzlePiece = (index: number) => {
    const emptyIndex = puzzlePieces.indexOf(0);
    const validMoves = [
      emptyIndex - 1, emptyIndex + 1, 
      emptyIndex - 4, emptyIndex + 4
    ].filter(i => 
      i >= 0 && i < 16 && 
      (Math.abs(i - emptyIndex) === 1 ? Math.floor(i / 4) === Math.floor(emptyIndex / 4) : true)
    );

    if (validMoves.includes(index)) {
      const newPieces = [...puzzlePieces];
      [newPieces[index], newPieces[emptyIndex]] = [newPieces[emptyIndex], newPieces[index]];
      setPuzzlePieces(newPieces);
      setPuzzleMoves(prev => prev + 1);

      // Check if solved
      const solved = newPieces.slice(0, 15).every((piece, i) => piece === i + 1);
      if (solved) {
        setPuzzleComplete(true);
        completeGame('puzzle', Math.max(200 - puzzleMoves * 2, 50), puzzleMoves);
      }
    }
  };

  const completeGame = (game: string, score: number, time: number) => {
    const gameScore: GameScore = { game, score, time, completed: true };
    setGameScores(prev => [...prev, gameScore]);
    dispatch({ type: 'ADD_XP', payload: Math.floor(score / 5) });
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: `🎮 Great job! You earned ${Math.floor(score / 5)} XP from ${games.find(g => g.id === game)?.name}!` 
    });
  };

  const resetGame = () => {
    setActiveGame(null);
    setBreathingActive(false);
    setBreathingCount(0);
    setBreathingPhase('inhale');
  };

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
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className={`w-16 h-16 bg-gradient-to-r ${theme.primary} rounded-full mx-auto mb-4 flex items-center justify-center`}
          >
            <Gamepad2 className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className={`text-2xl font-bold ${theme.text}`}>Stress Relief Games</h2>
          <p className={`${theme.textSecondary} mt-2`}>
            Therapeutic mini-games designed to reduce stress and improve mental wellness
          </p>
        </div>

        {/* Game Selection */}
        {!activeGame && (
          <div className="grid md:grid-cols-2 gap-4">
            {games.map((game, index) => (
              <motion.button
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setActiveGame(game.id);
                  if (game.id === 'memory') initializeMemoryGame();
                  if (game.id === 'colors') startColorGame();
                  if (game.id === 'puzzle') initializePuzzle();
                }}
                className={`p-6 rounded-xl text-left transition-all duration-200 bg-white/30 hover:bg-white/50 hover:scale-105`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-${game.color}-100`}>
                    <game.icon className={`w-6 h-6 text-${game.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${theme.text} mb-1`}>{game.name}</h3>
                    <p className={`text-sm ${theme.textSecondary} mb-2`}>{game.description}</p>
                    <p className={`text-xs ${theme.textSecondary} italic`}>✨ {game.benefit}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Active Game */}
      <AnimatePresence>
        {activeGame && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`${theme.surface} border border-white/20 rounded-xl p-6`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${theme.text}`}>
                {games.find(g => g.id === activeGame)?.name}
              </h3>
              <button
                onClick={resetGame}
                className={`p-2 rounded-lg bg-gradient-to-r ${theme.primary} text-white hover:shadow-lg transition-all duration-200`}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Breathing Exercise */}
            {activeGame === 'breathing' && (
              <div className="text-center">
                <motion.div
                  animate={{
                    scale: breathingPhase === 'inhale' ? 1.5 : breathingPhase === 'exhale' ? 0.8 : 1,
                  }}
                  transition={{ duration: breathingPhase === 'inhale' ? 4 : breathingPhase === 'hold' ? 0 : breathingPhase === 'exhale' ? 8 : 1 }}
                  className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r ${theme.primary} flex items-center justify-center`}
                >
                  <div className="text-white font-bold text-lg capitalize">{breathingPhase}</div>
                </motion.div>
                
                <p className={`text-lg ${theme.text} mb-4`}>
                  {breathingPhase === 'inhale' && 'Breathe in slowly...'}
                  {breathingPhase === 'hold' && 'Hold your breath...'}
                  {breathingPhase === 'exhale' && 'Breathe out slowly...'}
                  {breathingPhase === 'pause' && 'Pause and relax...'}
                </p>
                
                <p className={`${theme.textSecondary} mb-6`}>Cycle {breathingCount + 1} of 5</p>
                
                {!breathingActive && (
                  <button
                    onClick={() => setBreathingActive(true)}
                    className={`px-6 py-3 rounded-xl bg-gradient-to-r ${theme.primary} text-white font-semibold hover:shadow-lg transition-all duration-200`}
                  >
                    <Play className="w-4 h-4 inline mr-2" />
                    Start Breathing Exercise
                  </button>
                )}
              </div>
            )}

            {/* Memory Game */}
            {activeGame === 'memory' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className={`${theme.text}`}>Moves: {memoryMoves}</p>
                  <p className={`${theme.text}`}>Matches: {matchedCards.length / 2}/8</p>
                </div>
                
                <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                  {memoryCards.map((card, index) => (
                    <motion.button
                      key={index}
                      onClick={() => flipCard(index)}
                      className={`aspect-square rounded-lg text-white font-bold text-xl transition-all duration-200 ${
                        flippedCards.includes(index) || matchedCards.includes(index)
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {(flippedCards.includes(index) || matchedCards.includes(index)) ? card : '?'}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Therapy */}
            {activeGame === 'colors' && (
              <div className="text-center">
                <p className={`${theme.text} mb-4`}>Level {colorLevel}</p>
                <p className={`${theme.textSecondary} mb-6`}>
                  {showingSequence ? 'Watch the sequence...' : 'Repeat the pattern'}
                </p>
                
                <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto mb-6">
                  {['red', 'blue', 'green', 'yellow', 'purple', 'orange'].map((color) => (
                    <motion.button
                      key={color}
                      onClick={() => !showingSequence && addColorToSequence(color)}
                      className={`aspect-square rounded-xl transition-all duration-200`}
                      style={{ backgroundColor: color }}
                      animate={{
                        scale: showingSequence && colorSequence[Math.floor(Date.now() / 800) % colorSequence.length] === color ? 1.2 : 1,
                        opacity: showingSequence ? 0.7 : 1
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
                
                {!showingSequence && colorSequence.length > 0 && (
                  <button
                    onClick={startColorGame}
                    className={`px-4 py-2 rounded-lg bg-gradient-to-r ${theme.primary} text-white text-sm`}
                  >
                    Restart Level
                  </button>
                )}
              </div>
            )}

            {/* Sliding Puzzle */}
            {activeGame === 'puzzle' && (
              <div className="text-center">
                <p className={`${theme.text} mb-4`}>Moves: {puzzleMoves}</p>
                
                <div className="grid grid-cols-4 gap-1 max-w-xs mx-auto mb-6">
                  {puzzlePieces.map((piece, index) => (
                    <motion.button
                      key={index}
                      onClick={() => movePuzzlePiece(index)}
                      className={`aspect-square rounded-lg text-white font-bold transition-all duration-200 ${
                        piece === 0 
                          ? 'bg-transparent' 
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-lg'
                      }`}
                      whileHover={piece !== 0 ? { scale: 1.05 } : {}}
                      whileTap={piece !== 0 ? { scale: 0.95 } : {}}
                    >
                      {piece !== 0 && piece}
                    </motion.button>
                  ))}
                </div>
                
                {puzzleComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <CheckCircle className={`w-12 h-12 text-green-500 mx-auto mb-2`} />
                    <p className={`text-lg font-semibold ${theme.text}`}>Puzzle Complete!</p>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game History */}
      {gameScores.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${theme.surface} border border-white/20 rounded-xl p-6`}
        >
          <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center gap-2`}>
            <Zap className="w-5 h-5" />
            Recent Game Sessions
          </h3>
          
          <div className="space-y-3">
            {gameScores.slice(-5).map((score, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${theme.primary}`}>
                    {games.find(g => g.id === score.game)?.icon && 
                      React.createElement(games.find(g => g.id === score.game)!.icon, { 
                        className: "w-4 h-4 text-white" 
                      })
                    }
                  </div>
                  <div>
                    <p className={`font-medium ${theme.text}`}>
                      {games.find(g => g.id === score.game)?.name}
                    </p>
                    <p className={`text-sm ${theme.textSecondary}`}>
                      Score: {score.score} • Time: {score.time}s
                    </p>
                  </div>
                </div>
                <div className="text-2xl">🏆</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}