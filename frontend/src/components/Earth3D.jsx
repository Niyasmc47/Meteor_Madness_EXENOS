// frontend/src/components/Earth3D.jsx
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

function Earth3D({ onEarthClick, targetLocation }) {
  const earthRef = useRef();
  const [isRotating, setIsRotating] = useState(true);
  
  // Load Earth textures (we'll use online textures for now)
  const earthTexture = useMemo(() => {
    const loader = new TextureLoader();
    // Using NASA's Blue Marble texture
    return loader.load('https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg');
  }, []);

  const bumpTexture = useMemo(() => {
    const loader = new TextureLoader();
    return loader.load('https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png');
  }, []);

  // Auto-rotation when idle
  useFrame(() => {
    if (earthRef.current && isRotating) {
      earthRef.current.rotation.y += 0.001; // Slow rotation
    }
  });

  const handleClick = (event) => {
    event.stopPropagation();
    
    if (!earthRef.current) return;

    // Convert the click point to local coordinates of the Earth sphere
    const localPoint = earthRef.current.worldToLocal(event.point.clone());
    
    // Calculate lat/lng from local point on the unit sphere
    const lat = Math.asin(localPoint.y) * (180 / Math.PI);
    const lng = Math.atan2(localPoint.x, localPoint.z) * (180 / Math.PI);
    
    const earthRotationDegrees = earthRef.current.rotation.y * (180 / Math.PI);
    
    console.log('Earth clicked:', { 
      lat: lat.toFixed(4), 
      lng: lng.toFixed(4),
      rotation: earthRotationDegrees.toFixed(2) + '°'
    });
    
    if (onEarthClick) {
      onEarthClick({ 
        lat: parseFloat(lat.toFixed(4)), 
        lng: parseFloat(lng.toFixed(4)),
        earthRotation: earthRef.current.rotation.y 
      });
    }
    
    // Stop rotation when user interacts
    setIsRotating(false);
  };

  // Create atmosphere glow
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        c: { value: 0.3 },
        p: { value: 6.0 },
        glowColor: { value: new THREE.Color(0x00aaff) },
        viewVector: { value: new THREE.Vector3(0, 0, 5) }
      },
      vertexShader: `
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          vec3 vNormel = normalize(normalMatrix * viewVector);
          intensity = pow(c - dot(vNormal, vNormel), p);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4(glow, 1.0);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
  }, []);

  return (
    <group>
      {/* Main Earth sphere */}
      <mesh ref={earthRef} onClick={handleClick}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={0.05}
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      {/* Atmosphere glow */}
      <mesh scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[1, 64, 64]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>
      
      {/* Target marker if location selected */}
      {targetLocation && (
        <TargetMarker 
          lat={targetLocation.lat} 
          lng={targetLocation.lng} 
          earthRotation={targetLocation.earthRotation || (earthRef.current ? earthRef.current.rotation.y : 0)} 
        />
      )}
    </group>
  );
}

// Target marker component - Static red dot like 2D map
function TargetMarker({ lat, lng, earthRotation = 0 }) {
  // Convert lat/lng to 3D coordinates in world space (accounting for earth rotation)
  const position = useMemo(() => {
    const radius = 1.02; // Slightly above Earth surface
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = lng * (Math.PI / 180);
    
    // Base position on unrotated sphere
    const xBase = radius * Math.sin(phi) * Math.sin(theta);
    const yBase = radius * Math.cos(phi);
    const zBase = radius * Math.sin(phi) * Math.cos(theta);
    
    // Apply Earth's rotation (around Y axis)
    const x = xBase * Math.cos(earthRotation) + zBase * Math.sin(earthRotation);
    const y = yBase;
    const z = -xBase * Math.sin(earthRotation) + zBase * Math.cos(earthRotation);
    
    return [x, y, z];
  }, [lat, lng, earthRotation]);

  return (
    <mesh position={position}>
      {/* Main red dot */}
      <sphereGeometry args={[0.015, 16, 16]} />
      <meshBasicMaterial color="#ff0000" />
    </mesh>
  );
}

export default Earth3D;
