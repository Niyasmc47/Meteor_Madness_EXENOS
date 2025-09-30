// frontend/src/App.jsx
import React, { useState } from 'react';
import Map from './components/Map';
import Dashboard from './components/Dashboard/Dashboard';
import { runImpactSimulation } from './services/simulationService';

function App() {
  const [appState, setAppState] = useState('idle');
  const [targetLocation, setTargetLocation] = useState(null);
  const [impactData, setImpactData] = useState(null);
  const [hoveredLabel, setHoveredLabel] = useState(null);

  const handleMapClick = (latlng) => {
    setTargetLocation(latlng);
    setAppState('targeting');
  };

  const handleLaunch = async () => {
    if (!targetLocation) return;
    setAppState('loading');
    try {
      const data = await runImpactSimulation(targetLocation);
      setImpactData(data);
      setAppState('results');
    } catch (error) {
      console.error("Simulation failed", error);
      handleReset();
    }
  };

  const handleReset = () => {
    setAppState('idle');
    setTargetLocation(null);
    setImpactData(null);
    setHoveredLabel(null);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-800">
      <Map 
        appState={appState}
        onMapClick={handleMapClick} 
        targetLocation={targetLocation}
        impactData={impactData}
        hoveredLabel={hoveredLabel}
      />
      <Dashboard 
        appState={appState}
        targetLocation={targetLocation}
        results={impactData ? impactData.simulation_results : null}
        onLaunch={handleLaunch}
        onReset={handleReset}
        onHover={setHoveredLabel}
      />
    </div>
  );
}

export default App;