import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getSpotifyToken = async (code) => {
  try {
    const response = await axios.post(`${API_URL}/auth/spotify/token`, { code });
    console.log('Respuesta del token:', response.data); // Log para depuración
    return response.data;
  } catch (error) {
    console.error('Error obteniendo el token desde el backend:', error.response?.data || error.message);
    throw error;
  }
};

export const getSpotifyProfile = async (accessToken) => {
  try {
    console.log('Enviando accessToken:', accessToken); // Log para depuración
    const response = await axios.post(`${API_URL}/auth/spotify/profile`, { accessToken });
    console.log('Respuesta del perfil:', response.data); // Log para depuración
    return response.data;
  } catch (error) {
    console.error('Error obteniendo el perfil desde el backend:', error.response?.data || error.message);
    throw error;
  }
};

