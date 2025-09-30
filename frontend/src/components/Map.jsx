// frontend/src/components/Map.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapClickHandler = ({ onMapClick, appState }) => {
  useMapEvents({
    click(e) { if (appState === 'idle') { onMapClick(e.latlng); } },
  });
  return null;
};

const VisualizationLayer = ({ results, hoveredLabel }) => {
  if (!results) return null;
  
  const { impact_location } = results;
  const center = [impact_location.latitude, impact_location.longitude];

  const effects = results.impact_type === 'land' 
    ? [results.crater, results.fireball, results.shockwave]
    : [results.tsunami];

  const colors = { Crater: '#8B0000', Fireball: '#FF4500', Shockwave: '#FFA500', Tsunami: '#0077be' };

  // Determine which circle to show
  const activeEffect = effects.find(e => e.label === hoveredLabel);

  return (
    <>
      {/* Always show the crater for land impacts, or the tsunami zone for water */}
      <Circle 
        center={center} 
        radius={effects[0].visualization_radius_km * 1000} 
        pathOptions={{ color: colors[effects[0].label], fillColor: colors[effects[0].label], fillOpacity: 0.3 }}
      />
      {/* Show the hovered circle on top */}
      {activeEffect && activeEffect.label !== effects[0].label && (
        <Circle 
          center={center} 
          radius={activeEffect.visualization_radius_km * 1000} 
          pathOptions={{ color: colors[activeEffect.label], fillColor: colors[activeEffect.label], fillOpacity: 0.7 }}
        />
      )}
    </>
  );
};

const Map = ({ appState, onMapClick, targetLocation, impactData, hoveredLabel }) => {
  return (
    <div className="w-full md:w-2/3 h-screen">
      <MapContainer center={[20, 0]} zoom={3} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
        <MapClickHandler onMapClick={onMapClick} appState={appState} />
        
        {targetLocation && (
          <Marker position={[targetLocation.lat, targetLocation.lng]}>
            <Popup>{appState === 'results' ? 'Impact Site' : 'Target Location'}</Popup>
          </Marker>
        )}

        {appState === 'results' && <VisualizationLayer results={impactData} hoveredLabel={hoveredLabel} />}
      </MapContainer>
    </div>
  );
};

export default Map;