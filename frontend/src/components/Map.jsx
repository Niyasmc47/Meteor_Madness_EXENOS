// frontend/src/components/Map.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({ click: (e) => onMapClick(e.latlng) });
  return null;
};

const Map = ({ onMapClick, impactData }) => {
  const renderVisualizations = () => {
    if (!impactData) return null;
    const { impact_location, simulation_results } = impactData;
    const center = [impact_location.latitude, impact_location.longitude];

    if (simulation_results.impact_type === 'land') {
      return (
        <>
          <Circle center={center} radius={simulation_results.crater.diameter_km * 1000} pathOptions={{ color: '#8B0000', fillColor: '#8B0000', fillOpacity: 0.4 }} />
          <Circle center={center} radius={simulation_results.thermal_radiation.radius_3rd_degree_burns_km * 1000} pathOptions={{ color: '#FF4500', fillColor: '#FF4500', fillOpacity: 0.5 }} />
        </>
      );
    }

    if (simulation_results.impact_type === 'water') {
      return <Circle center={center} radius={50000} pathOptions={{ color: '#0077be', fillColor: '#0077be', fillOpacity: 0.4 }} />;
    }
    return null;
  };

  return (
    <div className="w-full md:w-2/3 h-screen">
      <MapContainer center={[20, 0]} zoom={3} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
        <MapClickHandler onMapClick={onMapClick} />
        {renderVisualizations()}
        {impactData && (
          <Marker position={[impactData.impact_location.latitude, impactData.impact_location.longitude]}>
            <Popup>Impact Site</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;