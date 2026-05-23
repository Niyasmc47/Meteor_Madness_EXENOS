// frontend/src/pages/Page1_Overview.jsx
import React from 'react';
export const Page1_Overview = ({ data }) => (
  <div>
    <h3 className="text-xl font-bold text-cyan-400">Impact Overview</h3>
    <p>The impact is equivalent to <span className="font-bold text-2xl text-white">{data.impact_energy_gt} Gigatons</span> of TNT.</p>
    <p className="mt-4">More energy was released than a hurricane releases in <span className="font-bold text-white">{data.hurricane_comparison} days</span>.</p>
    <p className="mt-4">An impact this size happens on average every <span className="font-bold text-white">{data.frequency_years_str} years</span>.</p>
  </div>
);