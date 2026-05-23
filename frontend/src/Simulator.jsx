// frontend/src/Simulator.jsx
import React, { useState } from 'react';
import Map from './components/Map';
import Scene3D from './components/Scene3D';
import SidePanel from './components/SidePanel';
import AdvancedControls from './components/AdvancedControls';
import SocialShare from './components/SocialShare';
import { runImpactSimulation } from './services/simulationService';

function Simulator() {
  const [appState, setAppState] = useState('idle');
  const [targetLocation, setTargetLocation] = useState(null);
  const [impactData, setImpactData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState(null);
  const [view3D, setView3D] = useState(true); // Toggle between 2D and 3D
  const [customParameters, setCustomParameters] = useState(null);
  const [deflectionData, setDeflectionData] = useState(null);

  const handleMapClick = (latlng) => {
    console.log('Target selected:', latlng);
    
    // Allow target selection in idle or targeting state (can change mind before launch)
    if (appState === 'idle' || appState === 'targeting') {
      setTargetLocation(latlng);
      setAppState('targeting');
      setError(null);
      return;
    }
    
    // Auto-reset if currently viewing results - allows quick new simulations
    if (appState === 'results') {
      console.log('Auto-resetting previous simulation...');
      setImpactData(null);
      setCurrentPage(0);
      setDeflectionData(null);
      setTargetLocation(latlng);
      setAppState('targeting');
      setError(null);
    }
  };

  const handleLaunch = async () => {
    if (!targetLocation) return;
    setAppState('loading');
    setError(null);
    try {
      const data = await runImpactSimulation(targetLocation);
      setImpactData(data);
      if (view3D) {
        setAppState('animating');
      } else {
        setCurrentPage(0);
        setAppState('results');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "A connection error occurred. Please try again.";
      setError(errorMessage);
      setAppState('targeting');
    }
  };

  const handleAnimationComplete = () => {
    setCurrentPage(0);
    setAppState('results');
  };

  const handleReset = () => {
    setAppState('idle');
    setTargetLocation(null);
    setImpactData(null);
    setCurrentPage(0);
    setError(null);
    setDeflectionData(null);
  };

  const handleParametersChange = (params) => {
    console.log('Custom parameters set:', params);
    setCustomParameters(params);
    alert('Custom parameters applied! Click on Earth to simulate with new values.');
  };

  const handleDeflectionSimulate = (deflection) => {
    console.log('🛡️ Deflection simulation:', deflection);
    setDeflectionData(deflection);
    
    // Show success/failure message based on probability
    if (deflection.successProbability > 0.7) {
      alert(`HIGH CHANCE OF SUCCESS (${(deflection.successProbability * 100).toFixed(1)}%)\nTrajectory change: ${deflection.trajectoryChange.toFixed(2)} km`);
    } else if (deflection.successProbability > 0.4) {
      alert(`MODERATE CHANCE (${(deflection.successProbability * 100).toFixed(1)}%)\nMore time needed for better results.`);
    } else {
      alert(`LOW CHANCE (${(deflection.successProbability * 100).toFixed(1)}%)\nNeed more warning time or different method!`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black overflow-hidden">
      {/* Main View - 3D or 2D */}
      <div className="flex-1 relative overflow-hidden">
        {/* View Toggle Button - Upper Left Corner */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => setView3D(!view3D)}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 text-white text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-lg"
          >
            {view3D ? 'Switch to 2D Map' : 'Switch to 3D Globe'}
          </button>
        </div>
        
        {view3D ? (
          <Scene3D
            appState={appState}
            onMapClick={handleMapClick}
            targetLocation={targetLocation}
            impactData={impactData}
            deflectionData={deflectionData}
            onAnimationComplete={handleAnimationComplete}
          />
        ) : (
          <Map
            appState={appState}
            onMapClick={handleMapClick}
            targetLocation={targetLocation}
            impactData={impactData}
          />
        )}
      </div>

      {/* Sidebar */}
      <SidePanel
        appState={appState}
        error={error}
        targetLocation={targetLocation}
        results={impactData}
        onLaunch={handleLaunch}
        onReset={handleReset}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        deflectionData={deflectionData}
        customComponents={{
          advancedControls: appState === 'idle' && (
            <AdvancedControls
              onParametersChange={handleParametersChange}
              onDeflectionSimulate={handleDeflectionSimulate}
            />
          )
        }}
      />
    </div>
  );
}

export default Simulator;