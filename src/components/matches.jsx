import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { envs } from '../config/envs';

function Matches() {
  const [userId, setUserId] = useState(null);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const { API_SERVICE } = envs;
        const email = localStorage.getItem('spotify_user_email');
        if (!email) {
          console.warn('No se encontró el correo electrónico en el localStorage.');
          return;
        }

        // Llamada a la API para obtener el ID del usuario a partir del correo
        const response = await axios.get(`${API_SERVICE}/api/profile/getProfileByEmail/${email}`);
        const userProfile = response.data.data;

        if (!userProfile || !userProfile.idUsers) {
          throw new Error('No se encontró el perfil del usuario.');
        }

        setUserId(userProfile.idUsers);
      } catch (error) {
        console.error('Error al obtener el ID del usuario:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        if (!userId) return;

        const { API_SERVICE } = envs;
        console.log(`ID del usuario obtenido: ${userId}`);

        // Llamada a la API para obtener los matches del usuario
        const response = await axios.get(`${API_SERVICE}/api/matches/${userId}`);
        setMatches(response.data.matches || []);
        console.log(response);
      } catch (error) {
        console.error('Error al obtener matches:', error);
      }
    };

    fetchMatches();
  }, [userId]);

  return (
    <div>
      <h1>Matches</h1>
      {matches.length > 0 ? (
        <ul>
          {matches.map((match) => (
            <li key={match.id}>{match.name}</li>
          ))}
        </ul>
      ) : (
        <p>No hay matches disponibles.</p>
      )}
    </div>
  );
}

export default Matches;
