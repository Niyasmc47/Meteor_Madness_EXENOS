// frontend/src/pages/Page4_Shockwave.jsx
import React from 'react';
export const Page4_Shockwave = ({ data }) => (
  <div>
    <h3 className="text-xl font-bold text-cyan-400">Shockwave & Wind</h3>
    <p>The impact creates a <span className="font-bold text-2xl text-white">{data.sound_db} decibel</span> shock wave.</p>
    <p className="mt-4">Buildings within <span className="font-bold text-white">{data.building_collapse_radius_km} km</span> would collapse.</p>
    <p className="mt-4">Peak wind speeds reach <span className="font-bold text-white">{data.peak_wind_kps} km/s</span>, faster than storms on Jupiter.</p>
  </div>
);