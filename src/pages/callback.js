import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SPOTIFY_CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      axios
        .post(
          'https://accounts.spotify.com/api/token',
          new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI,
          }),
          {
            headers: {
              Authorization: 'Basic ' + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`),
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )
        .then((response) => {
          const { access_token, refresh_token, expires_in } = response.data;

          // Guarda tokens y tiempos en localStorage
          localStorage.setItem('spotify_access_token', access_token);
          localStorage.setItem('spotify_refresh_token', refresh_token);
          localStorage.setItem('spotify_token_expires_at', Date.now() + expires_in * 1000);

          // Obtén y guarda el perfil del usuario
          axios
            .get('https://api.spotify.com/v1/me', {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            })
            .then((profileResponse) => {
              const userProfile = profileResponse.data;
              localStorage.setItem('spotify_user_profile', JSON.stringify(userProfile));
              navigate('/profile');
            })
            .catch((error) => {
              console.error('Error al obtener los datos del perfil:', error);
            });
        })
        .catch((error) => {
          console.error('Error al obtener el token de acceso:', error);
        });
    }
  }, [navigate]);

  return <div>Cargando...</div>;
}

export default Callback;
