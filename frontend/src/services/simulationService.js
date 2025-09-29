import axios from 'axios';
const API_URL = 'http://127.0.0.1:8000/api';

export const runImpactSimulation = async (location) => {
  try {
    const response = await axios.post(`${API_URL}/simulate/`, {
      latitude: location.lat,
      longitude: location.lng,
    });
    return response.data;
  } catch (error) {
    console.error("Error running simulation:", error);
    throw error;
  }
};