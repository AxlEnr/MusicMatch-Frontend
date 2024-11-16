import React, { useEffect } from 'react';
import axios from 'axios';

const RedirectHandler = () => {
  useEffect(() => {
    // Extraer el código de autorización de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Enviar el código al backend para intercambiarlo por un token
      axios
        .post('http://localhost:5000/api/spotify/token', { code })
        .then((response) => {
          console.log('Token recibido:', response.data);
          // Guardar el token en el almacenamiento local o en el estado
          localStorage.setItem('spotifyAccessToken', response.data.access_token);
        })
        .catch((error) => {
          console.error('Error al obtener el token:', error);
        });
    }
  }, []);

  return <div>Procesando inicio de sesión...</div>;
};

export default RedirectHandler;
