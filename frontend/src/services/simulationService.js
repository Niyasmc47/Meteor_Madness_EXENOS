import axios from 'axios';
const API_URL = 'http://127.0.0.1:8000';

export const runImpactSimulation = async (location) => {
  console.log('\n🚀 ===== IMPACT SIMULATION STARTED ===== 🚀');
  console.log('📍 Target Location:', {
    latitude: location.lat,
    longitude: location.lng
  });
  
  try {
    console.log('⏳ Sending request to backend API...');
    const startTime = performance.now();
    
    const response = await axios.post(`${API_URL}/simulate/`, {
      latitude: location.lat,
      longitude: location.lng,
    });
    
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    
    console.log(`✅ API Response received in ${duration}ms`);
    console.log('📊 Response Data:', response.data);
    
    if (response.data.asteroid_details) {
      console.log('\n🌠 ASTEROID DATA (from NASA API):');
      console.log('  Name:', response.data.asteroid_details.name);
      console.log('  Diameter:', response.data.asteroid_details.diameter_m, 'm');
      console.log('  Velocity:', response.data.asteroid_details.velocity_kps, 'km/s');
      
      if (response.data.asteroid_details.orbital_elements) {
        console.log('\n🛰️ ORBITAL ELEMENTS (Keplerian):');
        console.log('  Semi-major axis:', response.data.asteroid_details.orbital_elements.a_au, 'AU');
        console.log('  Eccentricity:', response.data.asteroid_details.orbital_elements.e);
        console.log('  Inclination:', response.data.asteroid_details.orbital_elements.i_deg, 'deg');
        console.log('  RAAN:', response.data.asteroid_details.orbital_elements.raan_deg, 'deg');
        console.log('  Arg of Periapsis:', response.data.asteroid_details.orbital_elements.argp_deg, 'deg');
        console.log('  Mean Anomaly:', response.data.asteroid_details.orbital_elements.M_deg, 'deg');
        console.log('  Epoch:', response.data.asteroid_details.orbital_elements.epoch_unix_ms ? new Date(response.data.asteroid_details.orbital_elements.epoch_unix_ms).toISOString() : 'N/A');
      } else {
        console.warn('⚠️ No orbital_elements found in response!');
      }
    }
    
    if (response.data.impact_location) {
      console.log('\n🌍 IMPACT LOCATION (from Elevation API):');
      console.log('  Latitude:', response.data.impact_location.latitude);
      console.log('  Longitude:', response.data.impact_location.longitude);
      console.log('  Elevation:', response.data.impact_location.elevation_m, 'm');
      console.log('  Type:', response.data.impact_location.elevation_m > 0 ? '🏔️ LAND' : '🌊 WATER');
    }
    
    if (response.data.simulation_results) {
      console.log('\n💥 SIMULATION RESULTS:');
      console.log('  Impact Type:', response.data.simulation_results.impact_type.toUpperCase());
      console.log('  Total Energy:', response.data.simulation_results.page_1_overview.impact_energy_gt, 'Gigatons TNT');
      
      if (response.data.simulation_results.impact_type === 'land') {
        console.log('  Crater Diameter:', response.data.simulation_results.page_2_crater.diameter_km, 'km');
        console.log('  Seismic Magnitude:', response.data.simulation_results.page_5_seismic.magnitude, 'Richter');
      } else {
        console.log('  Tsunami Wave Height:', response.data.simulation_results.page_2_tsunami.initial_wave_height_m, 'm');
      }
    }
    
    console.log('\n✅ ===== SIMULATION COMPLETE ===== ✅\n');
    return response.data;
  } catch (error) {
    console.error('\n❌ ===== SIMULATION ERROR ===== ❌');
    console.error('Error Type:', error.name);
    console.error('Error Message:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
    console.error('Full Error:', error);
    console.error('\n❌ ===== END ERROR ===== ❌\n');
    throw error;
  }
};