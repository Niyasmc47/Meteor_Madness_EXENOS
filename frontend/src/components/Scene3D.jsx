// frontend/src/components/Scene3D.jsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import Earth3D from './Earth3D';
import Asteroid3D from './Asteroid3D';
import DangerZones3D from './DangerZones3D';

function Scene3D({ appState, onMapClick, targetLocation, impactData }) {
  // Loading fallback
  const Loader = () => (
    <div className="flex items-center justify-center h-full bg-black text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mb-4 mx-auto"></div>
        <p>Loading 3D Earth...</p>
      </div>
    </div>
  );

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* 3D Canvas */}
      <Canvas style={{ width: '100%', height: '100%' }}>
        <Suspense fallback={null}>
          {/* Camera */}
          <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={45} />
          
          {/* Lighting - Much brighter for better visibility */}
          <ambientLight intensity={0.8} />
          <directionalLight 
            position={[5, 3, 5]} 
            intensity={2.0} 
            castShadow
          />
          <directionalLight 
            position={[-5, -3, -5]} 
            intensity={1.0} 
          />
          <pointLight position={[0, 5, 0]} intensity={0.8} color="#ffffff" />
          
          {/* Stars background */}
          <Stars 
            radius={300} 
            depth={60} 
            count={5000} 
            factor={7} 
            saturation={0} 
            fade 
          />
          
          {/* Earth */}
          <Earth3D 
            onEarthClick={onMapClick}
            targetLocation={targetLocation}
          />
          
          {/* Asteroid (Apophis/Impactor-2025) - Always visible */}
          <Asteroid3D 
            asteroidData={impactData?.asteroid_details || {
              name: "Apophis (99942)",
              diameter_m: 370,
              velocity_kps: 7.42,
              mass_kg: 6.1e10,
              approach_date: "2029-04-13",
              // Real Apophis orbital elements (adjusted for near-Earth visibility)
              orbital_elements: {
                a_au: 0.9224,           // Semi-major axis in AU
                e: 0.1911,              // Eccentricity
                i_deg: 3.339,           // Inclination in degrees
                raan_deg: 204.43,       // Longitude of ascending node
                argp_deg: 126.40,       // Argument of periapsis
                M_deg: 213.89,          // Mean anomaly at epoch
                epoch_unix_ms: Date.now() - (30 * 24 * 60 * 60 * 1000) // ~30 days ago for demo
              }
            }}
            isOrbiting={appState === 'idle' || appState === 'targeting'}
            modelPath={null}
          />
          
          {/* Danger zones after impact calculation */}
          {appState === 'results' && impactData && (
            <DangerZones3D impactData={impactData} />
          )}
          
          {/* Camera controls */}
          <OrbitControls 
            enablePan={false}
            minDistance={1.5}
            maxDistance={8}
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlays */}
      {appState === 'idle' && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-md text-white px-5 py-3 rounded-lg border border-white/20 shadow-lg z-10 pointer-events-none transition-all duration-300">
          <p className="text-sm font-medium">Click on Earth to select impact location</p>
          <p className="text-xs text-gray-400 mt-1">Drag to rotate • Scroll to zoom</p>
        </div>
      )}
      
      {/* Loading indicator */}
      {appState === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20">
          <div className="bg-black/80 backdrop-blur-md p-6 rounded-lg border border-white/20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4 mx-auto"></div>
            <p className="text-white text-sm font-medium mb-2">Calculating Impact...</p>
            <p className="text-gray-400 text-xs">Fetching NASA & geological data</p>
          </div>
        </div>
      )}
      
      {/* Controls hint */}
      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white px-3 py-2 rounded-lg border border-white/20 text-xs z-10 transition-all duration-300">
        <p className="font-medium mb-1">Controls:</p>
        <p className="text-gray-400">Left drag: Rotate</p>
        <p className="text-gray-400">Scroll: Zoom</p>
        <p className="text-gray-400">Click Earth: Target</p>
      </div>
    </div>
  );
}

export default Scene3D;
