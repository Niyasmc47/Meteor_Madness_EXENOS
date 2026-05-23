// frontend/src/pages/Page2_Crater.jsx
import React from 'react';
export const Page2_Crater = ({ data }) => (
  <div>
    <h3 className="text-xl font-bold text-cyan-400">Crater</h3>
    <p>The impact creates a <span className="font-bold text-2xl text-white">{data.diameter_km} km</span> wide crater.</p>
    <p className="mt-4">The ground at the impact site is <span className="font-bold text-white">{data.ground_type}</span>.</p>
    <p className="mt-4">The crater is <span className="font-bold text-white">{data.depth_km} km</span> deep.</p>
  </div>
);