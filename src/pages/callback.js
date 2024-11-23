import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSpotifyToken, getSpotifyProfile } from '../utils/api';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTokensAndProfile = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        try {
          const { access_token, refresh_token, expires_in } = await getSpotifyToken(code);

          // Guarda tokens en localStorage
          localStorage.setItem('spotify_access_token', access_token);
          localStorage.setItem('spotify_refresh_token', refresh_token);
          localStorage.setItem('spotify_token_expires_at', Date.now() + expires_in * 1000);

          // Obtén y guarda el perfil de usuario
          const userProfile = await getSpotifyProfile(access_token);
          localStorage.setItem('spotify_user_profile', JSON.stringify(userProfile));

          // Redirige al perfil del usuario
          navigate('/profile');
        } catch (error) {
          console.error('Error durante el flujo de autenticación:', error);
        }
      }
    };

    fetchTokensAndProfile();
  }, [navigate]);
}

export default Callback;
