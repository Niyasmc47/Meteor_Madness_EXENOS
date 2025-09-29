// frontend/src/components/Map.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapClickHandler = ({ onMapClick, appState }) => {
  useMapEvents({
    click(e) {
      // Only allow clicking if we are in the 'idle' state
      if (appState === 'idle') {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
};

const Map = ({ appState, onMapClick, targetLocation, impactData }) => {
  
  const renderVisualizations = () => {
    if (!impactData) return null;

    const { impact_location, simulation_results } = impactData;
    const center = [impact_location.latitude, impact_location.longitude];

    if (simulation_results.impact_type === 'land') {
      return (
        <>
          <Circle center={center} radius={simulation_results.page_2_crater.diameter_km * 1000} pathOptions={{ color: '#8B0000', fillColor: '#8B0000', fillOpacity: 0.4 }} />
          <Circle center={center} radius={simulation_results.page_3_thermal.fireball_radius_km * 1000} pathOptions={{ color: '#FF4500', fillColor: '#FF4500', fillOpacity: 0.5 }} />
        </>
      );
    }

    if (simulation_results.impact_type === 'water') {
      const dangerRadiusM = simulation_results.page_2_tsunami.near_source_danger_zone_radius_km * 1000;
      if (dangerRadiusM > 0) {
        return <Circle center={center} radius={dangerRadiusM} pathOptions={{ color: '#0077be', fillColor: '#0077be', fillOpacity: 0.4 }} />;
      }
    }
    return null;
  };
  
  return (
    <div className="w-full md:w-2/3 h-screen">
      <MapContainer center={[20, 0]} zoom={3} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
        <MapClickHandler onMapClick={onMapClick} appState={appState} />
        
        {/* Show a marker for the target location before and after launch */}
        {targetLocation && (
          <Marker position={[targetLocation.lat, targetLocation.lng]}>
            <Popup>{appState === 'results' ? 'Impact Site' : 'Target Location'}</Popup>
          </Marker>
        )}

        {/* Render the circles only AFTER the simulation is complete */}
        {appState === 'results' && renderVisualizations()}
      </MapContainer>
    </div>
  );
};

export default Map;