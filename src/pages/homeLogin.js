import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// Variables de configuración de Spotify desde .env
const SPOTIFY_CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;


console.log(SPOTIFY_CLIENT_ID); 
console.log(REDIRECT_URI);  



// URL de autorización de Spotify
const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user-library-read user-read-private&state=RANDOM_STATE`;

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <a href="https://mui.com/" style={{ color: 'inherit' }}>
        Spoti-Friends
      </a>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignInSide() {
  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      {/* Imagen de fondo */}
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(/assets/bg-login.webp)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[50]
              : theme.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Contenedor del formulario */}
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
      >
        <Box
          sx={{
            my: 20,
            mx: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around'
          }}
        >
          <Avatar src='/assets/logo1.png' sx={{ m: 1, bgcolor: 'secondary.main' }}>
          </Avatar>
          <Typography component="h1" variant="h5">
            Bienvenido a Spoti-Friends
          </Typography>
          {/* Botón de inicio de sesión con Spotify */}
          <Box sx={{ mt: 3, width: '100%' }}>
            <a href={SPOTIFY_AUTH_URL} style={{ textDecoration: 'none' }}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                sx={{ mt: 4, mb: 4 }}
              >
                Iniciar sesión con Spotify
              </Button>
            </a>
          </Box>
          <Box mt={5}>
            <Copyright />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
