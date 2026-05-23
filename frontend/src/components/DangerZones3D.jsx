// frontend/src/components/DangerZones3D.jsx
import React, { useMemo } from 'react';
import * as THREE from 'three';

function DangerZones3D({ impactData }) {
  if (!impactData?.impact_location) return null;

  const { latitude, longitude } = impactData.impact_location;
  const { simulation_results } = impactData;

  // Convert lat/lng to 3D position
  const getPositionFromLatLng = (lat, lng, altitude = 0) => {
    const radius = 1 + altitude; // 1 is Earth radius
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    
    return [x, y, z];
  };

  // Create zone rings for land impacts
  const landZones = useMemo(() => {
    if (simulation_results.impact_type !== 'land') return [];
    
    const zones = [
      {
        name: 'crater',
        radius: simulation_results.page_2_crater.radius_km / 6371, // Earth radius = 6371 km
        color: '#8B0000',
        opacity: 0.7
      },
      {
        name: 'fireball',
        radius: simulation_results.page_3_thermal.fireball_radius_km / 6371,
        color: '#FF4500',
        opacity: 0.5
      },
      {
        name: 'thermal',
        radius: simulation_results.page_3_thermal.trees_fire_radius_km / 6371,
        color: '#FFD700',
        opacity: 0.3
      },
      {
        name: 'shockwave',
        radius: simulation_results.page_4_shockwave.building_collapse_radius_km / 6371,
        color: '#9370DB',
        opacity: 0.2
      }
    ];
    
    return zones;
  }, [simulation_results]);

  // Create zone rings for water impacts
  const waterZones = useMemo(() => {
    if (simulation_results.impact_type !== 'water') return [];
    
    const dangerRadius = simulation_results.page_2_tsunami.near_source_danger_zone_radius_km;
    
    return [
      {
        name: 'initial_wave',
        radius: simulation_results.page_2_tsunami.initial_wave_height_m / 6371000, // Convert to scene units
        color: '#00CED1',
        opacity: 0.6
      },
      ...(dangerRadius > 0 ? [{
        name: 'danger_zone',
        radius: dangerRadius / 6371,
        color: '#1E90FF',
        opacity: 0.3
      }] : [])
    ];
  }, [simulation_results]);

  const zones = simulation_results.impact_type === 'land' ? landZones : waterZones;
  const impactPosition = getPositionFromLatLng(latitude, longitude, 0.01);

  return (
    <group>
      {/* Impact point marker */}
      <mesh position={impactPosition}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      
      {/* Danger zone rings */}
      {zones.map((zone, index) => (
        <ZoneRing
          key={zone.name}
          position={impactPosition}
          radius={zone.radius}
          color={zone.color}
          opacity={zone.opacity}
          delay={index * 0.2}
        />
      ))}
    </group>
  );
}

// Individual zone ring component with fade-in animation
function ZoneRing({ position, radius, color, opacity, delay }) {
  const ringGeometry = useMemo(() => {
    // Create a ring geometry projected onto sphere surface
    const segments = 64;
    const points = [];
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = position[0] + radius * Math.cos(angle);
      const z = position[2] + radius * Math.sin(angle);
      const y = position[1];
      
      // Project onto sphere
      const length = Math.sqrt(x*x + y*y + z*z);
      points.push(new THREE.Vector3(x/length, y/length, z/length));
    }
    
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [position, radius]);

  return (
    <line geometry={ringGeometry}>
      <lineBasicMaterial 
        color={color} 
        opacity={opacity} 
        transparent 
        linewidth={2}
      />
    </line>
  );
}

export default DangerZones3D;
