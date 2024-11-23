import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { envs } from "../config/envs"; // Configuración de entorno

const { API_SERVICE } = envs; // Solo necesitamos la URL del backend

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
  const handleSpotifyLogin = () => {
    // Redirige al usuario al backend para iniciar el flujo de autenticación
    window.location.href = `${API_SERVICE}/auth/spotify/login`;
  };

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
            my: 8,
            mx: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Bienvenido a Spoti-Friends
          </Typography>
          {/* Botón de inicio de sesión con Spotify */}
          <Box sx={{ mt: 3, width: '100%' }}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSpotifyLogin}
            >
              Iniciar sesión con Spotify
            </Button>
          </Box>
          <Box mt={5}>
            <Copyright />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
