// frontend/src/App.jsx
import React, { useState } from 'react';
import Map from './components/Map';
import SidePanel from './components/SidePanel';
import { runImpactSimulation } from './services/simulationService';

function App() {
  // 'idle' -> 'targeting' -> 'loading' -> 'results'
  const [appState, setAppState] = useState('idle');
  const [targetLocation, setTargetLocation] = useState(null);
  const [impactData, setImpactData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleMapClick = (latlng) => {
    // This function is called by the Map component when a target is selected
    setTargetLocation(latlng);
    setAppState('targeting');
  };

  const handleLaunch = async () => {
    // This function is called by the SidePanel when the LAUNCH button is clicked
    if (!targetLocation) return;
    setAppState('loading');
    try {
      const data = await runImpactSimulation(targetLocation);
      setImpactData(data); // Store the full results from the backend
      setCurrentPage(0); // Reset to the first page of results
      setAppState('results');
    } catch (error) {
      console.error("Simulation failed", error);
      // Handle error state here if desired (e.g., show an error message)
      handleReset();
    }
  };

  const handleReset = () => {
    // This resets the entire application to its initial state
    setAppState('idle');
    setTargetLocation(null);
    setImpactData(null);
    setCurrentPage(0);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-800">
      <Map 
        appState={appState}
        onMapClick={handleMapClick} 
        targetLocation={targetLocation}
        impactData={impactData} // Pass the full data to the map for visualization
      />
      <SidePanel 
        appState={appState}
        targetLocation={targetLocation}
        results={impactData ? impactData.simulation_results : null} // Pass just the results part to the panel
        onLaunch={handleLaunch}
        onReset={handleReset}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default App;