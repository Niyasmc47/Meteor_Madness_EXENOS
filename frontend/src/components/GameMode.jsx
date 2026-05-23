// frontend/src/components/GameMode.jsx
import React, { useState, useEffect } from 'react';

function GameMode({ onGameStart, onGameEnd }) {
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [asteroidsDeflected, setAsteroidsDeflected] = useState(0);
  const [asteroidsImpacted, setAsteroidsImpacted] = useState(0);
  const [currentThreat, setCurrentThreat] = useState(null);
  const [budget, setBudget] = useState(1000000000); // $1 billion
  
  const deflectionCosts = {
    'kinetic': 500000000, // $500M
    'gravity': 2000000000, // $2B
    'laser': 1500000000, // $1.5B
    'nuclear': 3000000000 // $3B
  };

  const threats = [
    { name: 'Asteroid 2025-A1', diameter: 150, velocity: 15, timeToImpact: 180, difficulty: 'easy' },
    { name: 'Asteroid 2025-B2', diameter: 300, velocity: 20, timeToImpact: 120, difficulty: 'medium' },
    { name: 'Asteroid 2025-C3', diameter: 500, velocity: 25, timeToImpact: 60, difficulty: 'hard' },
    { name: 'Comet DOOM-1', diameter: 800, velocity: 40, timeToImpact: 30, difficulty: 'extreme' },
  ];

  useEffect(() => {
    if (gameActive && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeActive && timeRemaining === 0) {
      endGame();
    }
  }, [gameActive, timeRemaining]);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setLevel(1);
    setTimeRemaining(300);
    setAsteroidsDeflected(0);
    setAsteroidsImpacted(0);
    setBudget(1000000000);
    generateThreat();
    onGameStart();
  };

  const endGame = () => {
    setGameActive(false);
    onGameEnd({
      score,
      level,
      asteroidsDeflected,
      asteroidsImpacted,
      successRate: asteroidsDeflected / (asteroidsDeflected + asteroidsImpacted) * 100
    });
  };

  const generateThreat = () => {
    const levelThreats = threats.filter(t => {
      if (level <= 2) return t.difficulty === 'easy';
      if (level <= 4) return t.difficulty === 'medium';
      if (level <= 6) return t.difficulty === 'hard';
      return true;
    });
    const threat = levelThreats[Math.floor(Math.random() * levelThreats.length)];
    setCurrentThreat(threat);
  };

  const handleDeflection = (method) => {
    const cost = deflectionCosts[method];
    if (budget < cost) {
      alert('Insufficient budget! 💸');
      return;
    }

    const successChance = currentThreat.timeToImpact > 90 ? 0.9 : 
                          currentThreat.timeToImpact > 60 ? 0.7 : 
                          currentThreat.timeToImpact > 30 ? 0.5 : 0.3;
    
    const success = Math.random() < successChance;
    
    setBudget(budget - cost);
    
    if (success) {
      const points = Math.floor((currentThreat.diameter * currentThreat.velocity) / 100);
      setScore(score + points);
      setAsteroidsDeflected(asteroidsDeflected + 1);
      setLevel(level + 1);
      alert(`✅ Success! Asteroid deflected! +${points} points`);
    } else {
      setAsteroidsImpacted(asteroidsImpacted + 1);
      alert('❌ Deflection failed! Asteroid will impact!');
    }
    
    generateThreat();
  };

  const handleIgnore = () => {
    setAsteroidsImpacted(asteroidsImpacted + 1);
    setScore(score - 50);
    generateThreat();
  };

  if (!gameActive) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md rounded-lg p-6 border-2 border-purple-500/40">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">🎮 Defend Earth Mode</h2>
          <p className="text-sm text-gray-300">
            Multiple asteroids are incoming! Use your budget wisely to deflect them before they hit Earth.
          </p>
          <div className="bg-black/30 rounded-lg p-4 text-left space-y-2">
            <h3 className="font-bold text-yellow-400">How to Play:</h3>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Each asteroid has different size, speed, and time until impact</li>
              <li>• Choose deflection method based on time and budget</li>
              <li>• Earlier deflection = higher success rate</li>
              <li>• Manage your $1B budget carefully!</li>
              <li>• Survive 5 minutes to win</li>
            </ul>
          </div>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg px-8 py-3 text-white font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            🚀 Start Mission
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/60 backdrop-blur-md rounded-lg p-4 border-2 border-red-500/60 space-y-4">
      {/* Game Header */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white/10 rounded-lg p-2">
          <p className="text-xs text-gray-400">Score</p>
          <p className="text-xl font-bold text-yellow-400">{score}</p>
        </div>
        <div className="bg-white/10 rounded-lg p-2">
          <p className="text-xs text-gray-400">Level</p>
          <p className="text-xl font-bold text-cyan-400">{level}</p>
        </div>
        <div className="bg-white/10 rounded-lg p-2">
          <p className="text-xs text-gray-400">Time</p>
          <p className="text-xl font-bold text-white">
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </p>
        </div>
      </div>

      {/* Budget */}
      <div className="bg-green-900/30 rounded-lg p-3 border border-green-500/30">
        <p className="text-xs text-gray-400">Budget Remaining</p>
        <p className="text-lg font-bold text-green-400">
          ${(budget / 1000000000).toFixed(2)}B
        </p>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
            style={{ width: `${(budget / 1000000000) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current Threat */}
      {currentThreat && (
        <div className="bg-red-900/30 rounded-lg p-4 border-2 border-red-500/60">
          <h3 className="text-lg font-bold text-red-400 mb-3">⚠️ INCOMING THREAT</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Designation:</span>
              <span className="text-white font-bold">{currentThreat.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Diameter:</span>
              <span className="text-white">{currentThreat.diameter}m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Velocity:</span>
              <span className="text-white">{currentThreat.velocity} km/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Time to Impact:</span>
              <span className={`font-bold ${currentThreat.timeToImpact < 60 ? 'text-red-400' : 'text-yellow-400'}`}>
                {currentThreat.timeToImpact} days
              </span>
            </div>
          </div>

          {/* Deflection Options */}
          <div className="mt-4 space-y-2">
            <p className="text-xs text-gray-400 font-semibold">Select Deflection Method:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDeflection('kinetic')}
                disabled={budget < deflectionCosts['kinetic']}
                className="bg-blue-600/30 hover:bg-blue-600/50 disabled:bg-gray-600/20 disabled:cursor-not-allowed rounded-lg p-2 text-xs transition-all border border-blue-500/40"
              >
                <div className="font-bold">🚀 Kinetic</div>
                <div className="text-gray-400">${deflectionCosts['kinetic']/1000000}M</div>
              </button>
              <button
                onClick={() => handleDeflection('gravity')}
                disabled={budget < deflectionCosts['gravity']}
                className="bg-purple-600/30 hover:bg-purple-600/50 disabled:bg-gray-600/20 disabled:cursor-not-allowed rounded-lg p-2 text-xs transition-all border border-purple-500/40"
              >
                <div className="font-bold">🛸 Gravity</div>
                <div className="text-gray-400">${deflectionCosts['gravity']/1000000000}B</div>
              </button>
              <button
                onClick={() => handleDeflection('laser')}
                disabled={budget < deflectionCosts['laser']}
                className="bg-yellow-600/30 hover:bg-yellow-600/50 disabled:bg-gray-600/20 disabled:cursor-not-allowed rounded-lg p-2 text-xs transition-all border border-yellow-500/40"
              >
                <div className="font-bold">🔆 Laser</div>
                <div className="text-gray-400">${deflectionCosts['laser']/1000000000}B</div>
              </button>
              <button
                onClick={() => handleDeflection('nuclear')}
                disabled={budget < deflectionCosts['nuclear']}
                className="bg-red-600/30 hover:bg-red-600/50 disabled:bg-gray-600/20 disabled:cursor-not-allowed rounded-lg p-2 text-xs transition-all border border-red-500/40"
              >
                <div className="font-bold">💥 Nuclear</div>
                <div className="text-gray-400">${deflectionCosts['nuclear']/1000000000}B</div>
              </button>
            </div>
            <button
              onClick={handleIgnore}
              className="w-full bg-gray-700/30 hover:bg-gray-700/50 rounded-lg p-2 text-xs text-gray-400 transition-all border border-gray-600/40"
            >
              ⏭️ Ignore (Lose 50 points)
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-green-900/20 rounded-lg p-2 border border-green-500/20">
          <p className="text-gray-400">Deflected</p>
          <p className="text-lg font-bold text-green-400">{asteroidsDeflected}</p>
        </div>
        <div className="bg-red-900/20 rounded-lg p-2 border border-red-500/20">
          <p className="text-gray-400">Impacted</p>
          <p className="text-lg font-bold text-red-400">{asteroidsImpacted}</p>
        </div>
      </div>

      {/* End Game Button */}
      <button
        onClick={endGame}
        className="w-full bg-red-600/20 hover:bg-red-600/30 rounded-lg px-4 py-2 text-white text-xs font-medium transition-all border border-red-500/40"
      >
        End Mission
      </button>
    </div>
  );
}

export default GameMode;
