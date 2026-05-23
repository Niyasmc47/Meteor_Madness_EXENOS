// frontend/src/components/SidePanel.jsx
import React, { useState } from 'react';

// --- Page Components with Enhanced Styling and Icons ---
const Page1_Overview = ({ data }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/20 pb-2">
      Impact Overview
    </h3>
    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
      <p className="text-xs text-gray-300 mb-1">Total Energy Released</p>
      <p className="font-bold text-3xl text-white">{data.impact_energy_gt} <span className="text-lg text-gray-300">Gigatons TNT</span></p>
    </div>
    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
      <p className="text-xs text-gray-400 mb-2">Energy Comparison</p>
      <p className="text-sm">Equivalent to <span className="font-semibold text-white">{data.hurricane_comparison} days</span> of a Category 5 hurricane</p>
    </div>
    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
      <p className="text-xs text-gray-400 mb-2">Event Frequency</p>
      <p className="text-sm">Occurs approximately once every <span className="font-semibold text-white">{data.frequency_years_str} years</span></p>
    </div>
  </div>
);

const Page2_Crater = ({ data }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/20 pb-2">
      Crater Formation
    </h3>
    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
      <p className="text-xs text-gray-300 mb-1">Crater Diameter</p>
      <p className="font-bold text-3xl text-white">{data.diameter_km} <span className="text-lg text-gray-300">km</span></p>
      <p className="text-xs text-gray-400 mt-2">≈ Size of {data.city_comparison}</p>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white/5 p-3 rounded-lg border border-white/10">
        <p className="text-xs text-gray-400">Radius</p>
        <p className="font-semibold text-lg text-white">{data.radius_km} km</p>
      </div>
      <div className="bg-white/5 p-3 rounded-lg border border-white/10">
        <p className="text-xs text-gray-400">Depth</p>
        <p className="font-semibold text-lg text-white">{data.depth_km} km</p>
      </div>
    </div>
    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
      <p className="text-xs text-gray-400 mb-1">Ground Type</p>
      <p className="text-sm font-medium text-white">{data.ground_type}</p>
    </div>
  </div>
);

const Page2_Tsunami = ({ data }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/20 pb-2">
      Tsunami Generation
    </h3>
    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
      <p className="text-xs text-gray-300 mb-1">Initial Wave Height</p>
      <p className="font-bold text-3xl text-white">{data.initial_wave_height_m} <span className="text-lg text-gray-300">meters</span></p>
      <p className="text-xs text-gray-400 mt-2">≈ {data.tsunami_comparison}</p>
    </div>
    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
      <p className="text-xs text-gray-400 mb-2">Ocean Depth: {data.ocean_depth_category}</p>
      <p className="text-sm text-gray-200">{data.depth_description}</p>
      <p className="text-xs text-gray-500 mt-2">Water depth: {data.water_depth_m}m</p>
    </div>
    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
      <p className="text-xs text-gray-400 mb-1">Seafloor Crater</p>
      <p className="text-sm">Temporary crater <span className="font-semibold text-white">{data.crater_depth_on_seafloor_m}m</span> deep forms on the ocean floor</p>
    </div>
    {data.near_source_danger_zone_radius_km > 0 && (
      <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/30">
        <p className="text-xs text-red-300 mb-1">Near-Source Danger Zone</p>
        <p className="text-sm">Catastrophic damage within <span className="font-semibold text-white">{data.near_source_danger_zone_radius_km} km</span></p>
      </div>
    )}
  </div>
);

const Page3_Thermal = ({ data }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/20 pb-2">
      Thermal Radiation
    </h3>
    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
      <p className="text-xs text-gray-300 mb-1">Fireball Diameter</p>
      <p className="font-bold text-3xl text-white">{data.fireball_radius_km * 2} <span className="text-lg text-gray-300">km</span></p>
      <p className="text-xs text-gray-400 mt-2">Instant vaporization zone</p>
    </div>
    <div className="space-y-2">
      <div className="bg-orange-500/10 p-3 rounded-lg border-l-2 border-orange-500">
        <p className="text-xs text-orange-300 font-medium">3rd Degree Burns</p>
        <p className="text-sm mt-1">Within <span className="font-semibold text-white">{data.fireball_radius_km} km</span> radius</p>
      </div>
      <div className="bg-yellow-500/10 p-3 rounded-lg border-l-2 border-yellow-500">
        <p className="text-xs text-yellow-300 font-medium">Clothing Ignition</p>
        <p className="text-sm mt-1">Within <span className="font-semibold text-white">{data.clothes_fire_radius_km} km</span> radius</p>
      </div>
      <div className="bg-red-500/10 p-3 rounded-lg border-l-2 border-red-600">
        <p className="text-xs text-red-300 font-medium">Forest Fires</p>
        <p className="text-sm mt-1">Within <span className="font-semibold text-white">{data.trees_fire_radius_km} km</span> radius</p>
      </div>
    </div>
  </div>
);

const Page4_Shockwave = ({ data }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/20 pb-2">
      Air Blast & Shockwave
    </h3>
    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
      <p className="text-xs text-gray-300 mb-1">Sound Level</p>
      <p className="font-bold text-3xl text-white">{data.sound_db} <span className="text-lg text-gray-300">dB</span></p>
      <p className="text-xs text-gray-400 mt-2">Instantly deafening</p>
    </div>
    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
      <p className="text-xs text-gray-400 mb-1">Building Collapse Zone</p>
      <p className="text-sm">Total destruction within <span className="font-semibold text-red-300">{data.building_collapse_radius_km} km</span></p>
    </div>
    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
      <p className="text-xs text-gray-400 mb-1">Peak Wind Speed</p>
      <p className="font-semibold text-xl text-white">{data.peak_wind_kps} <span className="text-sm text-gray-300">km/s</span></p>
      <p className="text-xs text-gray-500 mt-1">= {(data.peak_wind_kps * 3600).toFixed(0)} km/h</p>
    </div>
  </div>
);

const Page5_Seismic = ({ data }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/20 pb-2">
      Seismic Activity
    </h3>
    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
      <p className="text-xs text-gray-300 mb-1">Earthquake Magnitude</p>
      <p className="font-bold text-3xl text-white">{data.magnitude} <span className="text-lg text-gray-300">Richter</span></p>
      <p className="text-xs text-gray-400 mt-2">≈ {data.earthquake_comparison}</p>
    </div>
    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
      <p className="text-xs text-gray-400 mb-1">Felt Radius</p>
      <p className="text-sm">Detectable shaking up to <span className="font-semibold text-white">{data.felt_radius_km} km</span> away</p>
    </div>
    <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/30">
      <p className="text-xs text-yellow-300">Note: Seismic effects vary based on local geology and building construction</p>
    </div>
  </div>
);

// --- Mitigation Strategies Component ---
const MitigationStrategies = ({ asteroidData }) => {
  const [selectedStrategy, setSelectedStrategy] = useState(null);

  const strategies = [
    {
      id: 1,
      name: "Kinetic Impactor",
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M2.81 14.12L5.64 11.29L8.17 10.79C6.68 6.88 7.39 2.44 10.29 0C10.29 6.3 13.41 9.7 17.76 9.7C18.66 9.7 19.56 9.55 20.4 9.26L21.97 15.87L19.8 16.6C19.53 17.36 18.38 18.5 17.62 18.77L14.16 19.85L6.12 13.59L2.81 14.12Z"/></svg>,
      effectiveness: "High",
      timeRequired: "10-20 years",
      status: "Proven (NASA DART 2022)",
      description: "Spacecraft crashes into asteroid at high speed to transfer momentum and alter orbit.",
      pros: ["Proven technology", "No nuclear material", "Relatively simple"],
      cons: ["Requires early detection", "Ineffective for large asteroids >1km"],
      deltaV: "0.5 mm/s to 1 cm/s",
      color: "blue"
    },
    {
      id: 2,
      name: "Gravity Tractor",
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41C3.37 14.2 4.63 14.2 5.41 13.41L11 7.83V21C11 21.55 11.45 22 12 22S13 21.55 13 21V7.83L18.59 13.41C19.37 14.2 20.63 14.2 21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2M12 4.83L19.17 12L12 19.17L4.83 12L12 4.83Z"/></svg>,
      effectiveness: "Medium",
      timeRequired: "10-20 years",
      status: "Theoretical (ESA Study)",
      description: "Spacecraft hovers near asteroid using gravity to slowly pull it into different orbit.",
      pros: ["Very precise control", "No surface damage", "Works on rubble piles"],
      cons: ["Extremely slow", "Requires massive spacecraft", "Needs early warning"],
      deltaV: "1-10 mm/s over 10 years",
      color: "purple"
    },
    {
      id: 3,
      name: "Ion Beam Shepherd",
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11 15H6L13 1V9H18L11 23V15Z"/></svg>,
      effectiveness: "Medium",
      timeRequired: "10-20 years",
      status: "Conceptual (ESA/NASA)",
      description: "Spacecraft fires ion beams at asteroid creating steady thrust to push it gradually.",
      pros: ["Adjustable thrust", "Real-time steering", "No fragmentation risk"],
      cons: ["Very power-hungry", "Long operation period", "Complex station-keeping"],
      deltaV: "1 cm/s over 10 years",
      color: "cyan"
    },
    {
      id: 4,
      name: "Laser Ablation",
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2M12 6.3L10.04 10.28L5.74 10.91L8.87 13.97L8.13 18.23L12 16.11L15.87 18.23L15.13 13.97L18.26 10.91L13.96 10.28L12 6.3Z"/></svg>,
      effectiveness: "Low-Medium",
      timeRequired: "10-20 years",
      status: "Research Stage",
      description: "Focused lasers vaporize asteroid surface creating gas jet that pushes it away.",
      pros: ["Continuous control", "Works from distance", "Can be automated"],
      cons: ["Requires megawatt power", "Affected by rotation", "Still experimental"],
      deltaV: "Variable",
      color: "red"
    },
    {
      id: 5,
      name: "Nuclear Deflection",
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C11.5 2 11 2.19 10.59 2.59C10.2 3 10 3.5 10 4V5.08C7.61 5.57 5.57 7.61 5.08 10H4C3.5 10 3 10.2 2.59 10.59C2.19 11 2 11.5 2 12C2 12.5 2.19 13 2.59 13.41C3 13.8 3.5 14 4 14H5.08C5.57 16.39 7.61 18.43 10 18.92V20C10 20.5 10.2 21 10.59 21.41C11 21.8 11.5 22 12 22C12.5 22 13 21.8 13.41 21.41C13.8 21 14 20.5 14 20V18.92C16.39 18.43 18.43 16.39 18.92 14H20C20.5 14 21 13.8 21.41 13.41C21.8 13 22 12.5 22 12C22 11.5 21.8 11 21.41 10.59C21 10.2 20.5 10 20 10H18.92C18.43 7.61 16.39 5.57 14 5.08V4C14 3.5 13.8 3 13.41 2.59C13 2.19 12.5 2 12 2M12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8Z"/></svg>,
      effectiveness: "Very High",
      timeRequired: "Months to years",
      status: "Last Resort Option",
      description: "Nuclear device detonated near asteroid to vaporize surface and thrust it away rapidly.",
      pros: ["Works on large asteroids >1km", "Effective with short notice", "Rapid deflection"],
      cons: ["Nuclear treaties prohibit", "Political/ethical risks", "May cause fragmentation"],
      deltaV: "1-10 cm/s",
      color: "orange"
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/20 pb-2">
        Mitigation Strategies
      </h3>
      <p className="text-xs text-gray-400 mb-4">
        Real planetary defense methods to deflect or destroy asteroids before Earth impact.
      </p>
      
      <div className="space-y-3">
        {strategies.map((strategy) => (
          <div key={strategy.id} className="transition-all duration-300">
            <button
              onClick={() => setSelectedStrategy(selectedStrategy === strategy.id ? null : strategy.id)}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-300 ${
                selectedStrategy === strategy.id
                  ? `bg-${strategy.color}-900/30 border-${strategy.color}-500/50`
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="text-white opacity-80">{strategy.icon}</div>
                  <span className="text-sm font-semibold text-white">{strategy.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    strategy.effectiveness === 'Very High' ? 'bg-green-500/20 text-green-300' :
                    strategy.effectiveness === 'High' ? 'bg-blue-500/20 text-blue-300' :
                    strategy.effectiveness === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {strategy.effectiveness}
                  </span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${
                      selectedStrategy === strategy.id ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </button>
            
            {selectedStrategy === strategy.id && (
              <div className={`mt-2 p-4 rounded-lg bg-${strategy.color}-900/20 border border-${strategy.color}-500/30 animate-fadeIn`}>
                <p className="text-xs text-gray-300 mb-3">{strategy.description}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div className="bg-black/30 p-2 rounded">
                    <p className="text-gray-500">Time Required</p>
                    <p className="text-white font-medium">{strategy.timeRequired}</p>
                  </div>
                  <div className="bg-black/30 p-2 rounded">
                    <p className="text-gray-500">Delta-V</p>
                    <p className="text-white font-medium">{strategy.deltaV}</p>
                  </div>
                  <div className="col-span-2 bg-black/30 p-2 rounded">
                    <p className="text-gray-500">Status</p>
                    <p className="text-white font-medium">{strategy.status}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div>
                    <p className="text-green-400 font-medium mb-1">Advantages:</p>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {strategy.pros.map((pro, idx) => (
                        <li key={idx}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-red-400 font-medium mb-1">Limitations:</p>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {strategy.cons.map((con, idx) => (
                        <li key={idx}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
        <p className="text-xs text-blue-300">
          <strong>Note:</strong> Early detection is crucial. Most methods require 10-20 years warning time.
        </p>
      </div>
    </div>
  );
};

// --- Static Header Component with Glassmorphism ---
const StaticInfo = ({ asteroidDetails, isCollapsed }) => {
  if (isCollapsed) return null;
  
  return (
    <div className="px-5 py-4 border-b border-white/10 backdrop-blur-md">
      <h2 className="text-2xl font-bold text-white">
        IMPACTOR-2025
      </h2>
      <p className="text-xs text-gray-400 mt-1">
        {asteroidDetails ? `Based on ${asteroidDetails.name}` : 'NASA Space Apps Challenge'}
      </p>
    </div>
  );
};

// --- Main Dashboard Component ---
const SidePanel = ({ appState, error, targetLocation, results, onLaunch, onReset, currentPage, setCurrentPage, deflectionData, customComponents }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Add population data page if available
  const PopulationImpact = ({ data }) => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white mb-4 border-b border-white/20 pb-2">
        Population Impact
      </h3>
      {data.nearest_major_city && (
        <div className="bg-yellow-900/30 rounded-lg p-4 border border-yellow-500/40">
          <p className="text-xs text-yellow-300 mb-1">Nearest Major City</p>
          <p className="font-bold text-lg text-white">{data.nearest_major_city.name}, {data.nearest_major_city.country}</p>
          <p className="text-sm text-gray-300 mt-1">{data.nearest_major_city.distance_km} km away</p>
          <p className="text-sm text-gray-300">{data.nearest_major_city.population} million people</p>
        </div>
      )}
      <div className="bg-red-900/30 rounded-lg p-4 border border-red-500/40">
        <p className="text-xs text-red-300 mb-1">Estimated Total Affected</p>
        <p className="font-bold text-3xl text-white">{data.total_affected_millions}M</p>
        <p className="text-xs text-gray-400 mt-2">people in danger zones</p>
      </div>
      {data.nearest_cities && data.nearest_cities.length > 0 && (
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-xs text-gray-400 mb-2 font-semibold">Nearest Cities:</p>
          <div className="space-y-2">
            {data.nearest_cities.map((city, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <span className="text-gray-300">{city.name}, {city.country}</span>
                <span className="text-white font-medium">{city.distance_km} km</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const pages = results ? (results.simulation_results.impact_type === 'land'
    ? [
        <Page1_Overview key="1" data={results.simulation_results.page_1_overview} />,
        <Page2_Crater key="2" data={results.simulation_results.page_2_crater} />,
        <Page3_Thermal key="3" data={results.simulation_results.page_3_thermal} />,
        <Page4_Shockwave key="4" data={results.simulation_results.page_4_shockwave} />,
        <Page5_Seismic key="5" data={results.simulation_results.page_5_seismic} />,
        ...(results.population_impact ? [<PopulationImpact key="6" data={results.population_impact} />] : []),
        <MitigationStrategies key="7" asteroidData={results.asteroid_details} />
      ]
    : [
        <Page1_Overview key="1" data={results.simulation_results.page_1_overview} />,
        <Page2_Tsunami key="2" data={results.simulation_results.page_2_tsunami} />,
        ...(results.population_impact ? [<PopulationImpact key="3" data={results.population_impact} />] : []),
        <MitigationStrategies key="4" asteroidData={results.asteroid_details} />
      ]) : [];

  const canGoNext = currentPage < pages.length - 1;
  const canGoPrev = currentPage > 0;

  const renderContent = () => {
    if (isCollapsed) return null;
    
    // Priority 1: Show an error if one exists
    if (error) {
      return (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-5 text-center backdrop-blur-sm">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      );
    }
    
    // Render content based on the application's current state
    switch(appState) {
      case 'idle':
        return (
          <div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-gray-300 text-sm mb-2">Select Impact Location</p>
              <p className="text-gray-500 text-xs">Click anywhere on the map to target</p>
            </div>
          </div>
        );
      
      case 'targeting':
        return (
          <div className="text-center p-5 animate-fadeIn">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center border border-green-500/30 animate-pulse">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">Target Acquired</h3>
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20 mb-5">
              <p className="text-xs text-gray-400 mb-1">Coordinates</p>
              <p className="text-white font-mono text-sm">{targetLocation.lat.toFixed(4)}°, {targetLocation.lng.toFixed(4)}°</p>
            </div>
            <p className="text-xs text-gray-500 mb-4">Click map again to change target</p>
            <button 
              onClick={onLaunch} 
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-8 rounded-lg text-sm transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-red-500/50"
            >
              LAUNCH IMPACTOR
            </button>
          </div>
        );

      case 'loading':
        return (
          <div className="text-center p-6">
            <div className="mb-5">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
            <p className="text-white text-sm font-medium mb-2">Calculating Impact...</p>
            <p className="text-gray-400 text-xs">Fetching NASA & geological data</p>
          </div>
        );

      case 'results':
        if (!results) {
          return <p className="text-center text-red-400 text-sm">Error: Simulation data unavailable.</p>;
        }
        return (
          <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto p-4 backdrop-blur-sm">
              {pages[currentPage]}
            </div>
            <div className="flex justify-between items-center mt-3 bg-white/5 p-2 rounded-lg border border-white/10">
              <button 
                onClick={() => setCurrentPage(p => p - 1)} 
                disabled={!canGoPrev} 
                className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium"
              >
                ← Prev
              </button>
              <span className="text-gray-300 text-sm">
                <span className="text-white font-semibold">{currentPage + 1}</span> / {pages.length}
              </span>
              <button 
                onClick={() => setCurrentPage(p => p + 1)} 
                disabled={!canGoNext} 
                className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-medium"
              >
                Next →
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className={`h-screen bg-black/30 backdrop-blur-md text-gray-200 flex flex-col shadow-2xl border-l border-white/10 transition-all duration-300 relative ${
        isCollapsed ? 'w-16' : 'w-full md:w-1/3'
      }`}
    >
      {/* Collapse Toggle Button - Top right corner */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-lg border border-white/20 transition-all"
        title={isCollapsed ? "Expand Panel" : "Collapse Panel"}
      >
        <svg 
          className={`w-5 h-5 transition-transform ${
            isCollapsed ? 'rotate-180' : ''
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {!isCollapsed && (
        <>
          <StaticInfo asteroidDetails={results ? results.asteroid_details : null} isCollapsed={isCollapsed} />
          <div className="flex-grow p-5 flex flex-col justify-center overflow-y-auto">
            {renderContent()}
          </div>
          
          {/* Launch Another Asteroid Button - Only show after results */}
          {appState === 'results' && (
            <div className="mt-auto p-4 text-center border-t border-white/10 bg-black/20 backdrop-blur-sm">
              <button 
                onClick={onReset} 
                className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 text-white text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
              >
                Launch Another Asteroid
              </button>
              <p className="text-xs text-gray-500 mt-2">Or click the map to select new target</p>
            </div>
          )}
        </>
      )}
      
      {/* Collapsed State - Vertical Text */}
      {isCollapsed && (
        <div className="flex-grow flex items-center justify-center">
          <div className="transform -rotate-90 whitespace-nowrap">
            <p className="text-sm font-semibold text-gray-300 tracking-wider">IMPACTOR-2025</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidePanel;