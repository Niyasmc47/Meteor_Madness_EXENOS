// frontend/src/components/SidePanel.jsx
import React from 'react';

// A small helper component for consistent styling
const InfoRow = ({ label, value, unit = '' }) => (
  <div className="flex justify-between items-baseline py-2 border-b border-gray-700">
    <span className="text-sm font-medium text-gray-400">{label}</span>
    <span className="text-base font-bold text-white">{value} {unit}</span>
  </div>
);

const SidePanel = ({ results, density, setDensity, isLoading }) => {
  
  const handleDensityChange = (e) => {
    setDensity(Number(e.target.value));
  };

  const renderLandResults = () => (
    <>
      <InfoRow label="Impact Energy" value={results.impact_energy_mt.toLocaleString()} unit="Megatons" />
      <h4 className="text-cyan-400 font-bold mt-4 mb-2">Crater Dimensions</h4>
      <InfoRow label="Diameter" value={results.crater.diameter_km} unit="km" />
      <InfoRow label="Depth (Est.)" value={results.crater.depth_km} unit="km" />
      
      <h4 className="text-cyan-400 font-bold mt-4 mb-2">Thermal Effects</h4>
      <InfoRow label="3rd-Degree Burn Radius" value={results.thermal_radiation.radius_3rd_degree_burns_km} unit="km" />

      <h4 className="text-cyan-400 font-bold mt-4 mb-2">Air Blast (Shockwave)</h4>
      {results.air_blast.map(blast => (
        <div key={blast.distance_km} className="text-xs py-1">
          <span className="font-bold">{blast.distance_km} km away:</span> {blast.overpressure_psi} PSI ({blast.context})
        </div>
      ))}

      <h4 className="text-cyan-400 font-bold mt-4 mb-2">Seismic Effects</h4>
      <InfoRow label="Magnitude" value={results.seismic.magnitude} unit="Richter" />
      <p className="text-xs italic text-gray-400 mt-1">{results.seismic.context}</p>

      <h4 className="text-cyan-400 font-bold mt-4 mb-2">Population Estimate</h4>
      <p className="text-xs text-gray-400 mb-2">Select population density for the impact zone:</p>
      <select value={density} onChange={handleDensityChange} className="bg-gray-700 text-white p-2 rounded w-full">
        <option value={50}>Rural (50 people/km²)</option>
        <option value={1000}>Suburban (1,000 people/km²)</option>
        <option value={8000}>Urban (8,000 people/km²)</option>
      </select>
      <InfoRow label="Affected Population" value={results.estimated_affected_population.toLocaleString()} />
    </>
  );
  
  const renderWaterResults = () => (
     <>
      <InfoRow label="Impact Energy" value={results.impact_energy_mt.toLocaleString()} unit="Megatons" />
      <InfoRow label="Ocean Depth" value={results.water_depth_m} unit="m" />
      <h4 className="text-cyan-400 font-bold mt-4 mb-2">Tsunami Generation</h4>
      <InfoRow label="Initial Wave Height" value={results.tsunami_generation.initial_wave_height_m} unit="m" />
       <h5 className="text-gray-300 font-semibold mt-3 mb-1">Wave Propagation:</h5>
       {results.tsunami_generation.propagation.map(prop => (
         <div key={prop.distance_km} className="text-xs py-1">
           <span className="font-bold">{prop.distance_km} km away:</span> {prop.wave_height_m}m high, arrives in ~{prop.arrival_time_min} mins
         </div>
       ))}
    </>
  );

  return (
    <div className="w-full md:w-1/3 h-screen bg-gray-900 text-gray-200 p-4 overflow-y-auto">
      {/* Section 1: Static Asteroid Info */}
      <div className="pb-4 border-b-2 border-cyan-500">
        <h2 className="text-2xl font-bold text-white">Impactor-2025</h2>
        <p className="text-xs text-gray-400">Based on data for PHA 99942 Apophis</p>
        <div className="mt-4 space-y-2">
          <InfoRow label="Diameter" value="370" unit="m" />
          <InfoRow label="Velocity" value="12.6" unit="km/s" />
          <InfoRow label="Composition" value="Stony Asteroid" />
        </div>
      </div>
      
      {/* Section 2: Dynamic Impact Results */}
      <div className="mt-4">
        <h3 className="text-xl font-bold text-white">Impact Simulation</h3>
        {isLoading && <p className="text-yellow-400 animate-pulse mt-4">Calculating...</p>}
        {!isLoading && !results && <p className="text-gray-400 mt-2">Click on the map to begin.</p>}
        {results && results.impact_type === 'land' && renderLandResults()}
        {results && results.impact_type === 'water' && renderWaterResults()}
      </div>
    </div>
  );
};

export default SidePanel;