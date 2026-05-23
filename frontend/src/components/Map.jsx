// frontend/src/components/Map.jsx
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import the main Leaflet library

const MapClickHandler = ({ onMapClick, appState }) => {
  useMapEvents({
    click(e) { 
      // Allow clicks in idle, targeting (to change target), and results (to reset)
      if (appState === 'idle' || appState === 'targeting' || appState === 'results') {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
};

// Legend Component
const Legend = ({ impactType }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!impactType) return;
    
    const legend = L.control({ position: 'bottomright' });
    
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      div.style.background = 'rgba(0, 0, 0, 0.8)';
      div.style.padding = '10px';
      div.style.borderRadius = '8px';
      div.style.border = '2px solid #06b6d4';
      div.style.color = 'white';
      div.style.fontSize = '12px';
      
      if (impactType === 'land') {
        div.innerHTML = `
          <div style="margin-bottom: 5px; font-weight: bold; color: #06b6d4;">Impact Zones</div>
          <div style="margin: 3px 0;"><span style="color: #8B0000;">●</span> Crater</div>
          <div style="margin: 3px 0;"><span style="color: #FF4500;">●</span> Fireball</div>
          <div style="margin: 3px 0;"><span style="color: #FFD700;">●</span> Thermal Effects</div>
          <div style="margin: 3px 0;"><span style="color: #9370DB;">●</span> Shockwave Zone</div>
        `;
      } else if (impactType === 'water') {
        div.innerHTML = `
          <div style="margin-bottom: 5px; font-weight: bold; color: #06b6d4;">Tsunami Zones</div>
          <div style="margin: 3px 0;"><span style="color: #00CED1;">●</span> Initial Wave</div>
          <div style="margin: 3px 0;"><span style="color: #1E90FF;">●</span> Danger Zone</div>
        `;
      }
      
      return div;
    };
    
    legend.addTo(map);
    
    return () => {
      legend.remove();
    };
  }, [map, impactType]);
  
  return null;
};

const VisualizationLayer = ({ results }) => {
  if (!results) return null;
  const { impact_location, simulation_results } = results;
  const center = [impact_location.latitude, impact_location.longitude];

  if (simulation_results.impact_type === 'land') {
    const craterRadius = simulation_results.page_2_crater.radius_km * 1000;
    const fireballRadius = simulation_results.page_3_thermal.fireball_radius_km * 1000;
    const thermalRadius = simulation_results.page_3_thermal.trees_fire_radius_km * 1000;
    const shockwaveRadius = simulation_results.page_4_shockwave.building_collapse_radius_km * 1000;
    
    return (
      <>
        {/* Crater - Dark Red */}
        <Circle 
          center={center} 
          radius={craterRadius} 
          pathOptions={{ 
            color: '#8B0000', 
            fillColor: '#8B0000', 
            fillOpacity: 0.7,
            weight: 2 
          }} 
        />
        {/* Fireball - Bright Orange */}
        <Circle 
          center={center} 
          radius={fireballRadius} 
          pathOptions={{ 
            color: '#FF4500', 
            fillColor: '#FF6347', 
            fillOpacity: 0.5,
            weight: 2 
          }} 
        />
        {/* Thermal Effects - Yellow */}
        <Circle 
          center={center} 
          radius={thermalRadius} 
          pathOptions={{ 
            color: '#FFD700', 
            fillColor: '#FFA500', 
            fillOpacity: 0.3,
            weight: 2,
            dashArray: '5, 5'
          }} 
        />
        {/* Shockwave - Purple */}
        <Circle 
          center={center} 
          radius={shockwaveRadius} 
          pathOptions={{ 
            color: '#9370DB', 
            fillColor: '#9370DB', 
            fillOpacity: 0.15,
            weight: 2,
            dashArray: '10, 10'
          }} 
        />
      </>
    );
  }
  
  if (simulation_results.impact_type === 'water') {
    const dangerRadius = simulation_results.page_2_tsunami.near_source_danger_zone_radius_km * 1000;
    const waveRadius = simulation_results.page_2_tsunami.initial_wave_height_m * 100; // Scale for visibility
    
    return (
      <>
        {/* Initial wave splash */}
        <Circle 
          center={center} 
          radius={waveRadius} 
          pathOptions={{ 
            color: '#00CED1', 
            fillColor: '#00CED1', 
            fillOpacity: 0.6,
            weight: 2 
          }} 
        />
        {/* Danger zone */}
        {dangerRadius > 0 && (
          <Circle 
            center={center} 
            radius={dangerRadius} 
            pathOptions={{ 
              color: '#0077be', 
              fillColor: '#1E90FF', 
              fillOpacity: 0.3,
              weight: 3,
              dashArray: '10, 10'
            }} 
          />
        )}
      </>
    );
  }
  return null;
};

const corner1 = L.latLng(-90, -180);
const corner2 = L.latLng(90, 180);
const bounds = L.latLngBounds(corner1, corner2);

const Map = ({ appState, onMapClick, targetLocation, impactData }) => {
  const impactType = impactData?.simulation_results?.impact_type || null;
  
  return (
    <div className="flex-1 h-screen relative">
      <MapContainer 
        center={[20, 0]} 
        zoom={2} // Start slightly more zoomed out
        style={{ height: '100%', width: '100%' }}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        // --- THE FIX IS HERE ---
        minZoom={2} // Changed from 3 to 2 to allow a full world view
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          noWrap={true}
        />
        <MapClickHandler onMapClick={onMapClick} appState={appState} />
        {targetLocation && (
          <Marker position={[targetLocation.lat, targetLocation.lng]}>
            <Popup>
              <div className="text-center">
                <strong>{appState === 'results' ? 'Impact Site' : 'Target Location'}</strong>
                <p className="text-xs text-gray-600 mt-1">
                  {targetLocation.lat.toFixed(4)}°, {targetLocation.lng.toFixed(4)}°
                </p>
              </div>
            </Popup>
          </Marker>
        )}
        {appState === 'results' && <VisualizationLayer results={impactData} />}
        {appState === 'results' && impactType && <Legend impactType={impactType} />}
      </MapContainer>
      
      {/* Instruction overlay when idle */}
      {appState === 'idle' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-md text-white px-5 py-3 rounded-lg border border-white/20 shadow-lg z-[1000]">
          <p className="text-sm font-medium">Click anywhere on the map to select impact location</p>
        </div>
      )}
    </div>
  );
};

export default Map;