// frontend/src/components/Dashboard/Dashboard.jsx
import React from 'react';
import { StaticInfo } from './StaticInfo';
import { ResultRow } from './ResultRow';

const Dashboard = ({ appState, targetLocation, results, onLaunch, onReset, onHover }) => {
  
  const renderResults = () => {
    if (!results) return null;

    if (results.impact_type === 'land') {
      const { crater, fireball, shockwave, seismic } = results;
      return (
        <div>
          <h3 className="text-xl font-bold text-white mb-2 p-3">Land Impact Report <span className="text-sm font-normal text-gray-400">({results.ground_type})</span></h3>
          <ResultRow label={crater.label} value={crater.diameter_km} unit="km Diameter" onHover={onHover} />
          <ResultRow label={fireball.label} value={fireball.visualization_radius_km} unit="km Radius" onHover={onHover} />
          <ResultRow label={shockwave.label} value={shockwave.visualization_radius_km} unit="km Radius" onHover={onHover} />
          <ResultRow label={seismic.label} value={seismic.magnitude} unit="Magnitude" onHover={() => {}} />
        </div>
      );
    }

    if (results.impact_type === 'water') {
      const { tsunami } = results;
      return (
        <div>
          <h3 className="text-xl font-bold text-white mb-2 p-3">Water Impact Report <span className="text-sm font-normal text-gray-400">({results.ocean_depth_category})</span></h3>
          <ResultRow label="Initial Wave" value={tsunami.initial_wave_height_m} unit="m High" onHover={() => {}} />
          <ResultRow label={tsunami.label} value={tsunami.visualization_radius_km} unit="km Danger Zone" onHover={onHover} />
        </div>
      );
    }
  };

  return (
    <div className="w-full md:w-1/3 h-screen bg-gray-900 text-gray-200 flex flex-col">
      <StaticInfo />
      <div className="flex-grow p-4 overflow-y-auto">
        {appState === 'idle' && <p className="text-center text-gray-400 pt-10">Select a target on the map.</p>}
        
        {appState === 'targeting' && (
          <div className="text-center pt-10">
            <h3 className="text-xl font-bold">Target Acquired</h3>
            <button onClick={onLaunch} className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded text-xl animate-pulse">
              LAUNCH IMPACTOR
            </button>
          </div>
        )}

        {appState === 'loading' && <p className="text-center text-yellow-400 pt-10">Calculating Impact...</p>}
        {appState === 'results' && renderResults()}
      </div>
      <div className="p-4 mt-auto text-center border-t border-gray-700">
         {appState !== 'idle' && <button onClick={onReset} className="text-gray-400 hover:text-white text-sm">Reset Simulation</button>}
      </div>
    </div>
  );
};

export default Dashboard;