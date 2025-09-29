// frontend/src/pages/Page5_Seismic.jsx
import React from 'react';
export const Page5_Seismic = ({ data }) => (
  <div>
    <h3 className="text-xl font-bold text-cyan-400">Seismic Effects</h3>
    <p>A <span className="font-bold text-2xl text-white">{data.magnitude}</span> magnitude earthquake would be generated.</p>
    <p className="mt-4">The earthquake would be felt <span className="font-bold text-white">{data.felt_radius_km} km</span> away.</p>
  </div>
);