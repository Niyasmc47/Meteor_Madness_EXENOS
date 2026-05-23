// frontend/src/components/Asteroid3D.jsx
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Utility: convert orbital elements (Keplerian) to 3D positions
function keplerianToCartesian(a, e, i, omega, w, M) {
  // This function uses a simple iterative solution (Newton-Raphson) to solve Kepler's equation
  // and convert to ECI-like coordinates. Units: a in AU (or scene units), angles in radians.
  const MAX_ITERS = 50;
  const TOL = 1e-6;

  // Solve Kepler's equation: M = E - e*sin(E)
  let E = M;
  for (let k = 0; k < MAX_ITERS; k++) {
    const f = E - e * Math.sin(E) - M;
    const f1 = 1 - e * Math.cos(E);
    const delta = f / f1;
    E = E - delta;
    if (Math.abs(delta) < TOL) break;
  }

  // True anomaly
  const cosE = Math.cos(E);
  const sinE = Math.sin(E);
  const sqrtOneMinusESq = Math.sqrt(1 - e * e);
  const cosNu = (cosE - e) / (1 - e * cosE);
  const sinNu = (sqrtOneMinusESq * sinE) / (1 - e * cosE);
  const nu = Math.atan2(sinNu, cosNu);

  // Distance r
  const r = a * (1 - e * cosE);

  // Position in orbital plane
  const xOrb = r * Math.cos(nu);
  const yOrb = r * Math.sin(nu);
  const zOrb = 0;

  // Rotate from orbital plane to ECI: rotate by argument of periapsis (w), inclination (i), RAAN (omega)
  // Rotation matrix R = Rz(omega) * Rx(i) * Rz(w)
  const cosW = Math.cos(w), sinW = Math.sin(w);
  const cosO = Math.cos(omega), sinO = Math.sin(omega);
  const cosI = Math.cos(i), sinI = Math.sin(i);

  const X = (cosO * cosW - sinO * sinW * cosI) * xOrb + (-cosO * sinW - sinO * cosW * cosI) * yOrb;
  const Y = (sinO * cosW + cosO * sinW * cosI) * xOrb + (-sinO * sinW + cosO * cosW * cosI) * yOrb;
  const Z = (sinW * sinI) * xOrb + (cosW * sinI) * yOrb;

  return new THREE.Vector3(X, Z, Y); // swap axes to match scene orientation
}

function Asteroid3D({ asteroidData, isOrbiting = true }) {
  const asteroidRef = useRef();
  const orbitRef = useRef();
  
  // Debug logging
  React.useEffect(() => {
    if (asteroidData) {
      console.log('🛸 Asteroid3D received data:', {
        name: asteroidData.name,
        hasOrbitalElements: !!asteroidData.orbital_elements,
        orbital_elements: asteroidData.orbital_elements
      });
    }
  }, [asteroidData]);
  
  // Calculate asteroid size (scaled for visibility)
  const asteroidSize = useMemo(() => {
    if (!asteroidData) return 0.08; // Visible size for near-Earth orbit
    const diameter = asteroidData.diameter_m || 370;
    // Scale: 370m asteroid = 0.08 scene units (visible but realistic proportion)
    return Math.max(0.05, Math.min(0.12, diameter / 4500)); 
  }, [asteroidData]);

  // Calculate orbital parameters
  const orbitParams = useMemo(() => {
    // Default simple orbit parameters (scene units)
    // NOTE: Earth radius in scene = 1.0, so we want asteroid orbit around 1.5-2.0 radius
    return {
      semiMajorAxis: 1.8, // Distance from Earth center in scene units (close orbit for visibility)
      eccentricity: 0.191,
      inclination: 3.3 * (Math.PI / 180), // Convert to radians
      speed: 0.3 // Orbital speed multiplier (slower for better visibility)
    };
  }, []);

  // Create orbit path
  const orbitPath = useMemo(() => {
    const points = [];
    const segments = 256;

    // Check if we have orbital elements (prefer this over orbital_data)
    const elems = asteroidData && asteroidData.orbital_elements ? asteroidData.orbital_elements : null;
    if (elems && elems.a_au) {
      try {
        const a_au = parseFloat(elems.a_au);
        const e = parseFloat(elems.e) || 0.0;
        const iRad = ((parseFloat(elems.i_deg) || 0) * Math.PI) / 180.0;
        const omega = ((parseFloat(elems.raan_deg) || 0) * Math.PI) / 180.0;
        const w = ((parseFloat(elems.argp_deg) || 0) * Math.PI) / 180.0;

        // Generate orbit path using SAME calculation as animation
        for (let j = 0; j <= segments; j++) {
          const M = (j / segments) * Math.PI * 2;
          const v = keplerianToCartesian(a_au, e, iRad, omega, w, M);
          v.multiplyScalar(2.0 / a_au); // Same scaling as animation
          points.push(v);
        }
      } catch (err) {
        // fallback to parametric orbit
        const { semiMajorAxis, eccentricity } = orbitParams;
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const r = semiMajorAxis * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(angle));
          const x = r * Math.cos(angle);
          const z = r * Math.sin(angle);
          const y = z * Math.sin(orbitParams.inclination);
          points.push(new THREE.Vector3(x, y, z));
        }
      }
    } else {
      const { semiMajorAxis, eccentricity } = orbitParams;
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const r = semiMajorAxis * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(angle));
        const x = r * Math.cos(angle);
        const z = r * Math.sin(angle);
        const y = z * Math.sin(orbitParams.inclination);
        points.push(new THREE.Vector3(x, y, z));
      }
    }

    return new THREE.BufferGeometry().setFromPoints(points);
  }, [orbitParams]);

  // Simple gray sphere material
  const asteroidMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#808080', // Gray color
      roughness: 0.9,
      metalness: 0.1,
    });
  }, []);

  // Animate asteroid orbit
  useFrame((state) => {
    if (asteroidRef.current && isOrbiting) {
      const elapsed = state.clock.elapsedTime;
      // Prefer cleaned orbital elements (numeric) from backend response
      const elems = asteroidData && asteroidData.orbital_elements ? asteroidData.orbital_elements : null;
      if (elems && elems.a_au) {
        try {
          const a_au = parseFloat(elems.a_au);
          const e = parseFloat(elems.e) || 0.0;
          const iRad = ((parseFloat(elems.i_deg) || 0) * Math.PI) / 180.0;
          const omega = ((parseFloat(elems.raan_deg) || 0) * Math.PI) / 180.0;
          const w = ((parseFloat(elems.argp_deg) || 0) * Math.PI) / 180.0;

          // Use a simple time-based mean anomaly for visible animation
          // Complete orbit every 20 seconds for demo purposes
          const orbitPeriod = 20.0; // seconds for one complete orbit
          const M_now = (elapsed / orbitPeriod) * (2 * Math.PI); // Mean anomaly increases with time

          // Scale to near-Earth orbit (normalized by semi-major axis)
          const pos = keplerianToCartesian(a_au, e, iRad, omega, w, M_now).multiplyScalar(2.0 / a_au);
          asteroidRef.current.position.set(pos.x, pos.y, pos.z);
          
          // Debug log every 5 seconds
          if (Math.floor(elapsed) % 5 === 0 && Math.floor(elapsed) !== Math.floor(elapsed - 0.016)) {
            console.log('🪨 Asteroid position:', {
              x: pos.x.toFixed(2),
              y: pos.y.toFixed(2), 
              z: pos.z.toFixed(2),
              distance: Math.sqrt(pos.x*pos.x + pos.y*pos.y + pos.z*pos.z).toFixed(2),
              M_deg: ((M_now * 180 / Math.PI) % 360).toFixed(1)
            });
          }
        } catch (err) {
          // fallback
          const t = elapsed * orbitParams.speed;
          const { semiMajorAxis, eccentricity, inclination } = orbitParams;
          const angle = t;
          const r = semiMajorAxis * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(angle));
          const x = r * Math.cos(angle);
          const z = r * Math.sin(angle);
          const y = z * Math.sin(inclination);
          asteroidRef.current.position.set(x, y, z);
        }
      } else {
        const t = elapsed * orbitParams.speed;
        const { semiMajorAxis, eccentricity, inclination } = orbitParams;
        const angle = t;
        const r = semiMajorAxis * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(angle));
        const x = r * Math.cos(angle);
        const z = r * Math.sin(angle);
        const y = z * Math.sin(inclination);
        asteroidRef.current.position.set(x, y, z);
      }
      
      // Irregular tumbling rotation for realism (asteroids tumble in space)
      asteroidRef.current.rotation.x += 0.008;
      asteroidRef.current.rotation.y += 0.012;
      asteroidRef.current.rotation.z += 0.005;
    }
  });

  return (
    <group ref={orbitRef} position={[0, 0, 0]}>
      {/* Orbit path visualization - bright and visible */}
      <line geometry={orbitPath}>
        <lineBasicMaterial 
          color="#00ff88" 
          opacity={0.9} 
          transparent 
          linewidth={2}
        />
      </line>
      
      {/* Asteroid mesh - simple gray sphere */}
      <mesh ref={asteroidRef} castShadow receiveShadow>
        <sphereGeometry args={[asteroidSize, 32, 32]} />
        <primitive object={asteroidMaterial} attach="material" />
      </mesh>

      {/* Name tag */}
      <Text
        position={[0, asteroidSize * 1.5, 0]}
        fontSize={0.08}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.003}
        outlineColor="#000000"
      >
        Impactor-2025
      </Text>
      
      {/* Subtle glow for visibility */}
      <mesh position={asteroidRef.current?.position || [1.8, 0, 0]} scale={1.2}>
        <sphereGeometry args={[asteroidSize, 16, 16]} />
        <meshBasicMaterial 
          color="#5c4a3d"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Subtle lighting for asteroid */}
      <pointLight 
        position={asteroidRef.current?.position || [2.5, 0, 0]}
        intensity={0.5} 
        distance={1.0} 
        color="#8b7355"
        decay={2.0}
      />
    </group>
  );
}

export default Asteroid3D;
