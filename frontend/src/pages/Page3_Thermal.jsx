// frontend/src/pages/Page3_Thermal.jsx
import React from 'react';
export const Page3_Thermal = ({ data }) => (
  <div>
    <h3 className="text-xl font-bold text-cyan-400">Fireball & Thermal Effects</h3>
    <p>A <span className="font-bold text-2xl text-white">{data.fireball_radius_km} km</span> wide fireball engulfs the impact site.</p>
    <p className="mt-4">Clothes would catch on fire within <span className="font-bold text-white">{data.clothes_fire_radius_km} km</span> of the impact.</p>
    <p className="mt-4">Trees would catch on fire within <span className="font-bold text-white">{data.trees_fire_radius_km} km</span> of the impact.</p>
  </div>
);