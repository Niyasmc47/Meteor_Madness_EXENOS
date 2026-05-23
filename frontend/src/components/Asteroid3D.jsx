// frontend/src/components/Asteroid3D.jsx
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
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

function Asteroid3D({ asteroidData, isOrbiting = true, appState, targetLocation, onAnimationComplete }) {
  const { camera } = useThree();
  const asteroidRef = useRef();
  const orbitRef = useRef();
  const explosionRef = useRef();
  const fireTrailRef = useRef();
  const asteroidGroupRef = useRef();
  const initialCameraState = useRef({ pos: null, rot: null });
  
  const [animationPhase, setAnimationPhase] = React.useState('orbiting');
  const [startPosition, setStartPosition] = React.useState(null);
  const timingRef = useRef({ fallStart: 0, explosionStart: 0 });

  // Calculate target 3D position based on lat/lng and Earth's rotation
  const targetPosition = useMemo(() => {
    if (!targetLocation) return new THREE.Vector3(0, 0, 0);
    const radius = 1.01; // Slightly above Earth surface
    const lat = targetLocation.lat;
    const lng = targetLocation.lng;
    const earthRotation = targetLocation.earthRotation || 0;
    
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = lng * (Math.PI / 180);
    
    const xBase = radius * Math.sin(phi) * Math.sin(theta);
    const yBase = radius * Math.cos(phi);
    const zBase = radius * Math.sin(phi) * Math.cos(theta);
    
    const x = xBase * Math.cos(earthRotation) + zBase * Math.sin(earthRotation);
    const y = yBase;
    const z = -xBase * Math.sin(earthRotation) + zBase * Math.cos(earthRotation);
    
    return new THREE.Vector3(x, y, z);
  }, [targetLocation]);

  // Handle App State changes for animations
  React.useEffect(() => {
    if (appState === 'animating' && targetLocation) {
      setAnimationPhase('falling');
      timingRef.current.fallStart = 0; // Will be set in useFrame
      if (asteroidGroupRef.current) {
        setStartPosition(asteroidGroupRef.current.position.clone());
      }
    } else if (appState === 'idle' || appState === 'targeting') {
      setAnimationPhase('orbiting');
      if (asteroidGroupRef.current) asteroidGroupRef.current.visible = true;
      if (explosionRef.current) explosionRef.current.visible = false;
    } else if (appState === 'results') {
      setAnimationPhase('done');
      if (asteroidGroupRef.current) asteroidGroupRef.current.visible = false;
      if (explosionRef.current) explosionRef.current.visible = false;
    }
  }, [appState, targetLocation]);

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
  }, [orbitParams, asteroidData]);

  // Simple gray sphere material
  const asteroidMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#808080', // Gray color
      roughness: 0.9,
      metalness: 0.1,
    });
  }, []);

  // Animate asteroid orbit or falling
  useFrame((state) => {
    if (!asteroidGroupRef.current) return;
    
    if (animationPhase === 'orbiting') {
      const elapsed = state.clock.elapsedTime;
      let pos = new THREE.Vector3();

      const elems = asteroidData && asteroidData.orbital_elements ? asteroidData.orbital_elements : null;
      if (elems && elems.a_au) {
        try {
          const a_au = parseFloat(elems.a_au);
          const e = parseFloat(elems.e) || 0.0;
          const iRad = ((parseFloat(elems.i_deg) || 0) * Math.PI) / 180.0;
          const omega = ((parseFloat(elems.raan_deg) || 0) * Math.PI) / 180.0;
          const w = ((parseFloat(elems.argp_deg) || 0) * Math.PI) / 180.0;

          const orbitPeriod = 20.0;
          const M_now = (elapsed / orbitPeriod) * (2 * Math.PI); 

          pos = keplerianToCartesian(a_au, e, iRad, omega, w, M_now).multiplyScalar(2.0 / a_au);
        } catch (err) {
          const t = elapsed * orbitParams.speed;
          const { semiMajorAxis, eccentricity, inclination } = orbitParams;
          const r = semiMajorAxis * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(t));
          pos.set(r * Math.cos(t), r * Math.sin(t) * Math.sin(inclination), r * Math.sin(t));
        }
      } else {
        const t = elapsed * orbitParams.speed;
        const { semiMajorAxis, eccentricity, inclination } = orbitParams;
        const r = semiMajorAxis * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(t));
        pos.set(r * Math.cos(t), r * Math.sin(t) * Math.sin(inclination), r * Math.sin(t));
      }
      
      asteroidGroupRef.current.position.set(pos.x, pos.y, pos.z);
      
      if (asteroidRef.current) {
        asteroidRef.current.rotation.x += 0.008;
        asteroidRef.current.rotation.y += 0.012;
        asteroidRef.current.rotation.z += 0.005;
      }
    } else if (animationPhase === 'falling') {
      if (timingRef.current.fallStart === 0) {
        timingRef.current.fallStart = state.clock.elapsedTime;
        initialCameraState.current.pos = camera.position.clone();
        initialCameraState.current.rot = camera.rotation.clone();
      }
      
      const elapsed = state.clock.elapsedTime - timingRef.current.fallStart;
      const duration = 5.0; // 5 seconds for slow motion cinematic fall
      let progress = Math.min(elapsed / duration, 1.0);
      
      // Gravity easing (accelerate downwards, but smoother for slow-mo)
      const easedProgress = Math.pow(progress, 1.5);
      
      if (startPosition) {
        // Convert positions to spherical coordinates for orbital interpolation
        const startSpherical = new THREE.Spherical().setFromVector3(startPosition);
        const targetSpherical = new THREE.Spherical().setFromVector3(targetPosition);
        
        // Ensure shortest path for phi (latitude-ish)
        let deltaTheta = targetSpherical.theta - startSpherical.theta;
        // Normalize deltaTheta to -PI to PI
        deltaTheta = Math.atan2(Math.sin(deltaTheta), Math.cos(deltaTheta));
        
        // Add extra wraps around the earth for the "circling" effect
        const wraps = 1.0; // 1 extra full revolution
        const finalTheta = startSpherical.theta + deltaTheta + (Math.PI * 2 * wraps * Math.sign(deltaTheta || 1));
        
        // Interpolate radius (drops faster at the end to simulate decaying orbit)
        const currentRadius = THREE.MathUtils.lerp(startSpherical.radius, targetSpherical.radius, Math.pow(progress, 3));
        
        // Linearly interpolate angles
        const currentPhi = THREE.MathUtils.lerp(startSpherical.phi, targetSpherical.phi, easedProgress);
        const currentTheta = THREE.MathUtils.lerp(startSpherical.theta, finalTheta, easedProgress);
        
        const currentPos = new THREE.Vector3().setFromSphericalCoords(currentRadius, currentPhi, currentTheta);
        asteroidGroupRef.current.position.copy(currentPos);
        
        // Calculate next position for velocity tangent (to point fire trail)
        const nextProgress = Math.min(progress + 0.01, 1.0);
        const nextEased = Math.pow(nextProgress, 1.5);
        const nextRadius = THREE.MathUtils.lerp(startSpherical.radius, targetSpherical.radius, Math.pow(nextProgress, 3));
        const nextPhi = THREE.MathUtils.lerp(startSpherical.phi, targetSpherical.phi, nextEased);
        const nextTheta = THREE.MathUtils.lerp(startSpherical.theta, finalTheta, nextEased);
        
        const nextPos = new THREE.Vector3().setFromSphericalCoords(nextRadius, nextPhi, nextTheta);
        
        const velocityDir = new THREE.Vector3().subVectors(nextPos, currentPos).normalize();
        
        if (fireTrailRef.current && velocityDir.lengthSq() > 0) {
           const up = new THREE.Vector3(0, 1, 0);
           const oppDirection = velocityDir.clone().negate();
           const quaternion = new THREE.Quaternion().setFromUnitVectors(up, oppDirection);
           fireTrailRef.current.quaternion.copy(quaternion);
           fireTrailRef.current.position.copy(oppDirection.clone().multiplyScalar(asteroidSize * 1.5));
        }

        // Cinematic Camera: Pan to get a clear view of the target location
        // Position camera to look at Earth, but angled to see the impact
        if (progress < 0.99) {
          const finalCamPos = targetPosition.clone().normalize().multiplyScalar(4.0);
          camera.position.lerp(finalCamPos, 0.02);
          camera.lookAt(0, 0, 0); // Keep focus on Earth as asteroid circles
        }
      }
      
      if (asteroidRef.current) {
        asteroidRef.current.rotation.x += 0.05; // Spin
        asteroidRef.current.rotation.y += 0.05;
      }
      
      if (progress >= 1.0) {
        setAnimationPhase('exploding');
        timingRef.current.explosionStart = state.clock.elapsedTime;
        asteroidGroupRef.current.visible = false;
      }
    } else if (animationPhase === 'exploding') {
      const elapsed = state.clock.elapsedTime - timingRef.current.explosionStart;
      const duration = 2.0; // Explosion duration
      
      if (explosionRef.current) {
        explosionRef.current.visible = true;
        const scale = 1 + (elapsed * 15); // Expand steadily
        explosionRef.current.scale.set(scale, scale, scale);
        explosionRef.current.material.opacity = Math.max(0, 1.0 - (elapsed / duration));
      }

      // Stronger screen shake on impact
      if (elapsed < 1.0) {
         const shakeIntensity = (1.0 - elapsed) * 0.15; // Fades out
         camera.position.x += (Math.random() - 0.5) * shakeIntensity;
         camera.position.y += (Math.random() - 0.5) * shakeIntensity;
         camera.position.z += (Math.random() - 0.5) * shakeIntensity;
      }
      
      if (elapsed >= duration) {
        setAnimationPhase('done');
        if (explosionRef.current) explosionRef.current.visible = false;
        
        // Restore default camera position for results view
        camera.position.set(0, 0, 3);
        camera.lookAt(0, 0, 0);
        
        if (onAnimationComplete) onAnimationComplete();
      }
    }
  });

  return (
    <group ref={orbitRef} position={[0, 0, 0]}>
      {/* Orbit path visualization - bright and visible */}
      {animationPhase === 'orbiting' && (
        <line geometry={orbitPath}>
          <lineBasicMaterial 
            color="#00ff88" 
            opacity={0.9} 
            transparent 
            linewidth={2}
          />
        </line>
      )}
      
      {/* Group to move the asteroid and its trail */}
      <group ref={asteroidGroupRef}>
        {/* Asteroid mesh */}
        <mesh ref={asteroidRef} castShadow receiveShadow>
          <sphereGeometry args={[asteroidSize, 32, 32]} />
          <primitive object={asteroidMaterial} attach="material" />
        </mesh>

        {/* Name tag */}
        {animationPhase === 'orbiting' && (
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
        )}
        
        {/* Subtle glow / Fire trail */}
        <mesh ref={fireTrailRef} visible={animationPhase === 'falling'}>
          <coneGeometry args={[asteroidSize * 1.2, asteroidSize * 5, 16]} />
          <meshBasicMaterial 
            color="#ff4400" 
            transparent 
            opacity={0.8} 
            blending={THREE.AdditiveBlending} 
          />
        </mesh>

        {/* Subtle glow when orbiting, intense glow when falling */}
        {animationPhase === 'orbiting' && (
          <mesh scale={1.2}>
            <sphereGeometry args={[asteroidSize, 16, 16]} />
            <meshBasicMaterial 
              color="#5c4a3d"
              transparent
              opacity={0.15}
              side={THREE.BackSide}
            />
          </mesh>
        )}

        <pointLight 
          intensity={animationPhase === 'falling' ? 3.0 : 0.5} 
          distance={animationPhase === 'falling' ? 3.0 : 1.0} 
          color={animationPhase === 'falling' ? "#ff3300" : "#8b7355"}
          decay={2.0}
        />
      </group>
      
      {/* Explosion effect */}
      <mesh ref={explosionRef} visible={false} position={targetPosition}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshBasicMaterial 
          color="#ffaa00" 
          transparent 
          opacity={0.9} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>
    </group>
  );
}

export default Asteroid3D;
