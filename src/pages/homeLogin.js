import React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import { envs } from "../config/envs"; // Configuración de entorno
import "../styles/homeLogin.css";

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
          backgroundImage: 'url(/assets/vinilo.jpg)',
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
        style={{
          backgroundColor:"black",
        }}
      >

        <Box
          sx={{
            mx: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          style={{
            marginTop:"8rem"
          }}
        >
          <img src='/assets/logo.png' style={{
            width:"100px",
           
          }}></img>
          <Typography component="h1" variant="h5" style={{
            color:"white"
          }}>
            Bienvenido a Spoti-Friends
          </Typography>
          <div>
          <TextField id="outlined-basic" label="Correo / Usuario" variant="outlined" sx={{
              '& .MuiInputLabel-root': { color: '#FFF'},
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFF' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFF' },
              '& .MuiInputBase-input': {color: '#FFF'},
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#FFF', 
                },
                '&:hover fieldset': {
                  borderColor: '#FFF', 
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFF',
                },
              },
              width:'350px',
              maxWidth: '100%',
              marginTop:'3rem'
            }}/>
          </div>
          <div>
          <TextField id="outlined-basic" label="Contraseña" variant="outlined" sx={{
              '& .MuiInputLabel-root': { color: '#FFF'},
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFF' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFF' },
              '& .MuiInputBase-input': {color: '#FFF'},
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#FFF', 
                },
                '&:hover fieldset': {
                  borderColor: '#FFF', 
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FFF',
                },
              },
              width:'350px',
              maxWidth: '100%',
              marginTop:'3rem'
            }}/>
          </div>
          <Box sx={{ mt: 3, width: '350px', maxWidth:'100%' }}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 3 }}
              onClick={handleSpotifyLogin}
            >
              Iniciar sesión
            </Button>
          </Box>
          {/* Botón de inicio de sesión con Spotify */}
          <Box sx={{ width: '350px', maxWidth:'100%' }}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSpotifyLogin}
            >
              Crear cuenta con Spotify
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
