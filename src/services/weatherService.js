import axios from 'axios';

// Free weather service using browser geolocation or default to Delhi
export const getWeather = async (lat, lon) => {
  try {
    // Using Open-Meteo (Free, no key required for basic use)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat || 28.61}&longitude=${lon || 77.23}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`;
    
    const response = await axios.get(url);
    return response.data.current_weather;
  } catch (error) {
    console.error('Weather Fetch Error:', error);
    return null;
  }
};
