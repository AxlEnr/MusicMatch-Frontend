import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchExample = async () => {
    try {
        const response = await axios.get(`${API_URL}/ejemplo`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener datos del backend:', error);
        throw error;
    }
};
