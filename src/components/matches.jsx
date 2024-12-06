import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { envs } from '../config/envs';

function Matches() {
  const [userId, setUserId] = useState(null);
  const [matches, setMatches] = useState([]);
  const [processedMatches, setProcessedMatches] = useState([]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const { API_SERVICE } = envs;
        const email = localStorage.getItem('spotify_user_email');
        if (!email) {
          console.warn('No se encontró el correo electrónico en el localStorage.');
          return;
        }

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

        const response = await axios.get(`${API_SERVICE}/api/matches/${userId}`);
        setMatches(response.data.matches || []);
      } catch (error) {
        console.error('Error al obtener matches:', error);
      }
    };

    fetchMatches();
  }, [userId]);

  useEffect(() => {
    if (matches.length > 0) {
      // Procesar los matches para agrupar por `matchedUser`
      const groupedMatches = matches.reduce((acc, match) => {
        const { matchedUser, artist, song } = match;

        if (!acc[matchedUser]) {
          acc[matchedUser] = { artists: new Set(), songs: new Set() };
        }

        acc[matchedUser].artists.add(artist);
        acc[matchedUser].songs.add(song);

        return acc;
      }, {});

      // Convertir los datos agrupados a un formato adecuado para renderizado
      const formattedMatches = Object.entries(groupedMatches).map(
        ([matchedUser, data]) => ({
          matchedUser,
          artistCount: data.artists.size,
          songCount: data.songs.size,
        })
      );

      setProcessedMatches(formattedMatches);
    }
  }, [matches]);

  return (
    <div>
      <h1>Matches</h1>
      {processedMatches.length > 0 ? (
        <ul>
          {processedMatches.map((match, index) => (
            <li key={index}>
              <strong>{match.matchedUser}</strong>: {match.artistCount} artistas y {match.songCount} canciones.
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay matches disponibles.</p>
      )}
    </div>
  );
}

export default Matches;
