// frontend/src/components/SidePanel.jsx
import React from 'react';
// Import all our page components
import { Page1_Overview } from '../pages/Page1_Overview';
import { Page2_Crater } from '../pages/Page2_Crater';
import { Page2_Tsunami } from '../pages/Page2_Tsunami';
import { Page3_Thermal } from '../pages/Page3_Thermal';
import { Page4_Shockwave } from '../pages/Page4_Shockwave';
import { Page5_Seismic } from '../pages/Page5_Seismic';

const SidePanel = ({ appState, targetLocation, results, onLaunch, onReset, currentPage, setCurrentPage }) => {

  const pages = results ? (results.impact_type === 'land'
    ? [
        <Page1_Overview data={results.page_1_overview} />,
        <Page2_Crater data={results.page_2_crater} />,
        <Page3_Thermal data={results.page_3_thermal} />,
        <Page4_Shockwave data={results.page_4_shockwave} />,
        <Page5_Seismic data={results.page_5_seismic} />
      ]
    : [ // Water impact pages
        <Page1_Overview data={results.page_1_overview} />,
        <Page2_Tsunami data={results.page_2_tsunami} />
      ]) : [];

  const canGoNext = currentPage < pages.length - 1;
  const canGoPrev = currentPage > 0;

  return (
    <div className="w-full md:w-1/3 h-screen bg-gray-900 text-gray-200 p-6 flex flex-col">
      <div className="pb-4 border-b-2 border-cyan-500">
        <h2 className="text-2xl font-bold text-white">Impactor-2025</h2>
        <p className="text-xs text-gray-400">A NASA Space Apps Challenge Simulation</p>
      </div>

      <div className="flex-grow mt-4 flex flex-col justify-center">
        {appState === 'idle' && <p className="text-center text-gray-400">Select a target on the map.</p>}
        
        {appState === 'targeting' && (
          <div className="text-center">
            <h3 className="text-xl font-bold">Target Acquired</h3>
            <p className="text-sm text-gray-400">Lat: {targetLocation.lat.toFixed(4)}, Lng: {targetLocation.lng.toFixed(4)}</p>
            <button onClick={onLaunch} className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded text-xl">
              LAUNCH IMPACTOR
            </button>
          </div>
        )}

        {appState === 'loading' && <p className="text-center text-yellow-400 animate-pulse">Calculating Impact...</p>}

        {appState === 'results' && results && (
          <div className="flex flex-col h-full">
            <div className="flex-grow p-4 bg-gray-800 rounded">
              {pages[currentPage]}
            </div>
            <div className="flex justify-between items-center mt-4">
              <button onClick={() => setCurrentPage(p => p - 1)} disabled={!canGoPrev} className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50">{"< Prev"}</button>
              <span>Page {currentPage + 1} of {pages.length}</span>
              <button onClick={() => setCurrentPage(p => p + 1)} disabled={!canGoNext} className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50">{"Next >"}</button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-auto pt-4 text-center">
         {(appState !== 'idle') && <button onClick={onReset} className="text-gray-400 hover:text-white text-sm">Reset Simulation</button>}
      </div>
    </div>
  );
};

export default SidePanel;