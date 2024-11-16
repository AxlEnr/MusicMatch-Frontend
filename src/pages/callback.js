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
      // Intercambiar el código por un token de acceso
      axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI
      }), {
        headers: {
          'Authorization': 'Basic ' + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)
        }
      })
      .then(response => {
        const { access_token } = response.data;
        console.log('Access Token:', access_token);
        
        // Guardar el token (idealmente en contexto o estado global como Redux)
        localStorage.setItem('spotify_access_token', access_token);
        
        // Redirigir a la página principal después de la autenticación
        navigate('/home'); // O la URL a la que quieras redirigir
      })
      .catch(error => {
        console.error('Error al obtener el token de acceso:', error);
      });
    }
  }, [navigate]);

  return <div>Cargando...</div>;
}

export default Callback;
