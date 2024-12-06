import axios from 'axios';
import { envs } from '../config/envs'

const { API_SERVICE } = envs; // Cambia por la URL de tu backend

export const getMatchesForUser = async (userId) => {
  try {
    const response = await axios.get(`${API_SERVICE}/matches/${userId}`);
    return response.data.matches;
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
};
