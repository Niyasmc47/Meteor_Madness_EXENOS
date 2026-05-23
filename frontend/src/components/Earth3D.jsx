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

  // Handle click on Earth
  const handleClick = (event) => {
    event.stopPropagation();
    
    // BEST METHOD: Use UV coordinates from the texture mapping
    // This perfectly matches the 2D map since both use the same texture/coordinate system
    if (event.uv) {
      // UV coordinates: u (0 to 1) = longitude, v (0 to 1) = latitude
      // u: 0 = -180°, 0.5 = 0°, 1 = 180°
      // v: 0 = 90° (north pole), 0.5 = 0°, 1 = -90° (south pole)
      
      const u = event.uv.x;
      const v = event.uv.y;
      
      // Convert UV to geographic coordinates
      // Longitude: map u from [0,1] to [-180,180] with slight adjustment
      let lng = (u * 360) - 180;
      
      // Fine-tune adjustment: shift slightly to the right (east) by 10 degrees
      lng = lng + 2.2;
      
      // Latitude: map v from [0,1] to [-90,90] (inverted)
      // v=0 should be south pole (-90°), v=1 should be north pole (90°)
      let lat = (v * 180) - 90;
      
      // Account for Earth's rotation
      const earthRotationDegrees = earthRef.current ? (earthRef.current.rotation.y * (180 / Math.PI)) : 0;
      lng = lng - earthRotationDegrees;
      
      // Normalize longitude to -180 to 180 range
      lng = ((lng + 180) % 360) - 180;
      if (lng < -180) lng += 360;
      if (lng > 180) lng -= 360;
      
      console.log('Earth clicked (UV method):', { 
        uv: { u: u.toFixed(3), v: v.toFixed(3) },
        rotation: earthRotationDegrees.toFixed(2) + '°',
        lat: lat.toFixed(4), 
        lng: lng.toFixed(4) 
      });
      
      if (onEarthClick) {
        onEarthClick({ lat: parseFloat(lat.toFixed(4)), lng: parseFloat(lng.toFixed(4)) });
      }
      
      // Stop rotation when user interacts
      setIsRotating(false);
      return;
    }
    
    // Fallback: Old method if UV not available (shouldn't happen)
    const intersectionPoint = event.point;
    const radius = Math.sqrt(
      intersectionPoint.x ** 2 + 
      intersectionPoint.y ** 2 + 
      intersectionPoint.z ** 2
    );
    
    const nx = intersectionPoint.x / radius;
    const ny = intersectionPoint.y / radius;
    const nz = intersectionPoint.z / radius;
    
    const lat = Math.asin(ny) * (180 / Math.PI);
    const earthRotationDegrees = earthRef.current ? (earthRef.current.rotation.y * (180 / Math.PI)) : 0;
    let lng = Math.atan2(nz, -nx) * (180 / Math.PI) - 90 - earthRotationDegrees;
    lng = ((lng + 180) % 360) - 180;
    
    console.log('Earth clicked (fallback):', { lat: lat.toFixed(4), lng: lng.toFixed(4) });
    
    if (onEarthClick) {
      onEarthClick({ lat: parseFloat(lat.toFixed(4)), lng: parseFloat(lng.toFixed(4)) });
    }
    
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
        <TargetMarker lat={targetLocation.lat} lng={targetLocation.lng} />
      )}
    </group>
  );
}

// Target marker component - Static red dot like 2D map
function TargetMarker({ lat, lng }) {
  // Convert lat/lng to 3D coordinates
  const position = useMemo(() => {
    const radius = 1.02; // Slightly above Earth surface
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    
    return [x, y, z];
  }, [lat, lng]);

  return (
    <mesh position={position}>
      {/* Main red dot */}
      <sphereGeometry args={[0.015, 16, 16]} />
      <meshBasicMaterial color="#ff0000" />
    </mesh>
  );
}

export default Earth3D;
