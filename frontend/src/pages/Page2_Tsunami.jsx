// frontend/src/pages/Page2_Tsunami.jsx
import React from 'react';
export const Page2_Tsunami = ({ data }) => (
  <div>
    <h3 className="text-xl font-bold text-cyan-400">Tsunami</h3>
    <p>The impact will create a <span className="font-bold text-2xl text-white">{data.initial_wave_height_m} m</span> tall tsunami.</p>
    <p className="mt-4">A temporary crater <span className="font-bold text-white">{data.crater_depth_on_seafloor_m} m</span> deep forms on the sea floor.</p>
  </div>
);