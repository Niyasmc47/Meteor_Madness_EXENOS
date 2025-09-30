// frontend/src/components/Dashboard/ResultRow.jsx
import React from 'react';

export const ResultRow = ({ label, value, unit, onHover }) => (
  <div 
    className="p-3 my-1 rounded-md transition-colors duration-200 hover:bg-cyan-800/50 cursor-pointer"
    onMouseEnter={() => onHover(label)}
    onMouseLeave={() => onHover(null)}
  >
    <div className="flex justify-between items-baseline">
      <span className="text-sm font-medium text-gray-300">{label}</span>
      <span className="text-lg font-bold text-white">{value} <span className="text-sm font-normal text-gray-400">{unit}</span></span>
    </div>
  </div>
);