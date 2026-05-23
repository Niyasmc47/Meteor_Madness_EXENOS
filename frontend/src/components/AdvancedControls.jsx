// frontend/src/components/AdvancedControls.jsx
import React, { useState } from 'react';

function AdvancedControls({ onParametersChange, onDeflectionSimulate }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showDeflection, setShowDeflection] = useState(false);
  
  // Asteroid parameters
  const [diameter, setDiameter] = useState(370); // meters
  const [velocity, setVelocity] = useState(7.42); // km/s
  const [angle, setAngle] = useState(45); // degrees
  const [density, setDensity] = useState(3000); // kg/m³
  const [composition, setComposition] = useState('stony');
  
  // Deflection parameters
  const [deflectionMethod, setDeflectionMethod] = useState('kinetic');
  const [deflectionTime, setDeflectionTime] = useState(365); // days before impact
  const [deflectionMass, setDeflectionMass] = useState(500); // kg spacecraft
  const [deflectionVelocity, setDeflectionVelocity] = useState(10); // km/s

  const compositions = {
    'stony': { density: 3000, description: 'Rocky asteroid (most common)', color: '#8B7355' },
    'iron': { density: 7800, description: 'Metallic asteroid (very dense)', color: '#556B2F' },
    'carbonaceous': { density: 1500, description: 'Carbon-rich asteroid (less dense)', color: '#2C2C2C' },
    'icy': { density: 900, description: 'Ice/comet material (least dense)', color: '#B0E0E6' }
  };

  const deflectionMethods = {
    'kinetic': { 
      name: 'Kinetic Impactor', 
      description: 'Spacecraft crashes into asteroid at high speed',
      icon: '🚀',
      effectiveness: 0.7,
      requiredTime: 180 // days
    },
    'gravity': { 
      name: 'Gravity Tractor', 
      description: 'Spacecraft uses gravity to slowly pull asteroid',
      icon: '🛸',
      effectiveness: 0.3,
      requiredTime: 730 // 2 years
    },
    'laser': { 
      name: 'Laser Ablation', 
      description: 'Laser vaporizes surface material creating thrust',
      icon: '🔆',
      effectiveness: 0.5,
      requiredTime: 365 // 1 year
    },
    'nuclear': { 
      name: 'Nuclear Standoff', 
      description: 'Nuclear device detonates near asteroid',
      effectiveness: 0.95,
      requiredTime: 90 // 3 months
    }
  };

  const handleCompositionChange = (comp) => {
    setComposition(comp);
    setDensity(compositions[comp].density);
  };

  const handleApplyParameters = () => {
    onParametersChange({
      diameter_m: diameter,
      velocity_kps: velocity,
      angle_deg: angle,
      density_kgm3: density,
      composition: composition
    });
    setShowAdvanced(false);
  };

  const handleSimulateDeflection = () => {
    const method = deflectionMethods[deflectionMethod];
    
    // Calculate deflection success probability
    const timeAvailable = deflectionTime;
    const timeRequired = method.requiredTime;
    const timeRatio = timeAvailable / timeRequired;
    const successProbability = Math.min(method.effectiveness * timeRatio, 0.99);
    
    // Calculate velocity change (Delta-V)
    let deltaV = 0;
    if (deflectionMethod === 'kinetic') {
      // Momentum transfer: deltaV = (2 * m_spacecraft * v_spacecraft) / m_asteroid
      const asteroidMass = (4/3) * Math.PI * Math.pow(diameter/2, 3) * density;
      deltaV = (2 * deflectionMass * deflectionVelocity * 1000) / asteroidMass; // m/s
    } else if (deflectionMethod === 'gravity') {
      // Gravity tractor: very slow accumulation
      deltaV = 0.0001 * (deflectionTime / 365); // m/s per year
    } else if (deflectionMethod === 'laser') {
      // Laser ablation: moderate thrust over time
      deltaV = 0.001 * (deflectionTime / 365); // m/s per year
    } else if (deflectionMethod === 'nuclear') {
      // Nuclear: instant large impulse
      deltaV = 10; // m/s (depends on standoff distance)
    }
    
    onDeflectionSimulate({
      method: deflectionMethod,
      methodDetails: method,
      timeBeforeImpact: deflectionTime,
      successProbability: successProbability,
      deltaV: deltaV,
      trajectoryChange: deltaV * 3600 * 24 * deflectionTime / 1000, // km deflection
      spacecraft: {
        mass: deflectionMass,
        velocity: deflectionVelocity
      }
    });
    setShowDeflection(false);
  };

  const Tooltip = ({ text }) => (
    <div className="group relative inline-block ml-1">
      <span className="text-cyan-400 cursor-help text-xs">ⓘ</span>
      <div className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-black/90 text-white text-xs rounded-lg p-2 shadow-lg border border-white/20 z-50">
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black/90"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-2">
      {/* Advanced Parameters Button */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 rounded-lg px-4 py-2 text-white text-sm font-medium transition-all flex items-center justify-between"
      >
        <span>Advanced Parameters</span>
        <span className="text-xs">{showAdvanced ? '▼' : '▶'}</span>
      </button>

      {/* Advanced Parameters Panel */}
      {showAdvanced && (
        <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-purple-500/30 space-y-4 animate-in slide-in-from-top-4">
          <h4 className="text-sm font-bold text-purple-300 flex items-center">
            Asteroid Parameters
            <Tooltip text="Adjust these to simulate different asteroid scenarios" />
          </h4>
          
          {/* Diameter Slider */}
          <div>
            <label className="text-xs text-gray-300 flex items-center">
              Diameter: {diameter}m
              <Tooltip text="Size of the asteroid. Larger asteroids cause more damage." />
            </label>
            <input
              type="range"
              min="50"
              max="2000"
              value={diameter}
              onChange={(e) => setDiameter(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>50m</span>
              <span>1km</span>
              <span>2km</span>
            </div>
          </div>

          {/* Velocity Slider */}
          <div>
            <label className="text-xs text-gray-300 flex items-center">
              Velocity: {velocity} km/s
              <Tooltip text="Impact speed. Typical asteroids: 10-30 km/s" />
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="0.1"
              value={velocity}
              onChange={(e) => setVelocity(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>5 km/s</span>
              <span>25 km/s</span>
              <span>50 km/s</span>
            </div>
          </div>

          {/* Angle Slider */}
          <div>
            <label className="text-xs text-gray-300 flex items-center">
              Impact Angle: {angle}°
              <Tooltip text="Angle from horizontal. 90° = straight down, 0° = grazing" />
            </label>
            <input
              type="range"
              min="15"
              max="90"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>15° Grazing</span>
              <span>45° Typical</span>
              <span>90° Vertical</span>
            </div>
          </div>

          {/* Composition Selector */}
          <div>
            <label className="text-xs text-gray-300 flex items-center mb-2">
              Composition
              <Tooltip text="Asteroid material type affects mass and impact energy" />
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(compositions).map((comp) => (
                <button
                  key={comp}
                  onClick={() => handleCompositionChange(comp)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border-2 ${
                    composition === comp
                      ? 'bg-white/20 border-white/40'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  style={{ borderColor: composition === comp ? compositions[comp].color : undefined }}
                >
                  <div className="font-semibold capitalize">{comp}</div>
                  <div className="text-xs text-gray-400">{compositions[comp].density} kg/m³</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleApplyParameters}
            className="w-full bg-purple-600 hover:bg-purple-700 rounded-lg px-4 py-2 text-white text-sm font-medium transition-all"
          >
            Apply Parameters
          </button>
        </div>
      )}

      {/* Deflection Strategies Button */}
      <button
        onClick={() => setShowDeflection(!showDeflection)}
        className="w-full bg-green-600/20 hover:bg-green-600/30 border border-green-500/40 rounded-lg px-4 py-2 text-white text-sm font-medium transition-all flex items-center justify-between"
      >
        <span>Deflection Strategies</span>
        <span className="text-xs">{showDeflection ? '▼' : '▶'}</span>
      </button>

      {/* Deflection Panel */}
      {showDeflection && (
        <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 border border-green-500/30 space-y-4 animate-in slide-in-from-top-4">
          <h4 className="text-sm font-bold text-green-300 flex items-center">
            Mitigation Methods
            <Tooltip text="Simulate asteroid deflection missions to save Earth!" />
          </h4>

          {/* Method Selector */}
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(deflectionMethods).map((method) => {
              const m = deflectionMethods[method];
              return (
                <button
                  key={method}
                  onClick={() => setDeflectionMethod(method)}
                  className={`p-3 rounded-lg text-left transition-all border-2 ${
                    deflectionMethod === method
                      ? 'bg-green-600/30 border-green-500/60'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="text-xl mb-1">{m.icon}</div>
                  <div className="text-xs font-semibold">{m.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{m.effectiveness * 100}% effective</div>
                </button>
              );
            })}
          </div>

          {/* Selected Method Description */}
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-xs text-gray-300">{deflectionMethods[deflectionMethod].description}</p>
            <p className="text-xs text-yellow-400 mt-2">
              ⏰ Requires {deflectionMethods[deflectionMethod].requiredTime} days minimum
            </p>
          </div>

          {/* Time Before Impact */}
          <div>
            <label className="text-xs text-gray-300 flex items-center">
              Warning Time: {deflectionTime} days
              <Tooltip text="How much time before impact to launch deflection mission" />
            </label>
            <input
              type="range"
              min="30"
              max="1095"
              step="30"
              value={deflectionTime}
              onChange={(e) => setDeflectionTime(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1 month</span>
              <span>1 year</span>
              <span>3 years</span>
            </div>
          </div>

          {/* Spacecraft Parameters (for kinetic impactor) */}
          {deflectionMethod === 'kinetic' && (
            <>
              <div>
                <label className="text-xs text-gray-300">Spacecraft Mass: {deflectionMass} kg</label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="100"
                  value={deflectionMass}
                  onChange={(e) => setDeflectionMass(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs text-gray-300">Impact Velocity: {deflectionVelocity} km/s</label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="0.5"
                  value={deflectionVelocity}
                  onChange={(e) => setDeflectionVelocity(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </>
          )}

          <button
            onClick={handleSimulateDeflection}
            className="w-full bg-green-600 hover:bg-green-700 rounded-lg px-4 py-2 text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            <span>🚀</span>
            <span>Simulate Deflection</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default AdvancedControls;
