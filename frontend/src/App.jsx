// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import SidePanel from './components/SidePanel';
import { runImpactSimulation } from './services/simulationService';

function App() {
  const [impactData, setImpactData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [density, setDensity] = useState(1000); // Default to suburban
  const [lastImpactLocation, setLastImpactLocation] = useState(null);

  // This function handles the initial map click
  const handleMapClick = async (latlng) => {
    setIsLoading(true);
    setError(null);
    setLastImpactLocation(latlng); // Save the location
    
    try {
      // Pass the current density setting to the API
      const locationWithDensity = { lat: latlng.lat, lng: latlng.lng, population_density: density };
      const results = await runImpactSimulation(locationWithDensity);
      setImpactData(results);
    } catch (err) {
      setError('Failed to fetch simulation.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // This effect re-runs the simulation if the density is changed
  useEffect(() => {
    // Only re-run if there was a previous impact
    if (lastImpactLocation && impactData?.simulation_results.impact_type === 'land') {
      handleMapClick(lastImpactLocation);
    }
  }, [density]); // Dependency array: this effect runs ONLY when 'density' changes

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-800">
      <Map onMapClick={handleMapClick} impactData={impactData} />
      <SidePanel 
        results={impactData ? impactData.simulation_results : null} 
        isLoading={isLoading} 
        density={density}
        setDensity={setDensity}
      />
    </div>
  );
}

export default App;