import '../styles/Profile.css';
import React, { useEffect, useState } from 'react';
import { List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Typography, 
  IconButton, 
  Button, 
  TextField, 
} from '@mui/material';
import axios from 'axios';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { envs } from '../config/envs';
import swal from 'sweetalert';

function Profile() {
  // Definir los estados dentro del componente
  const [formData, setFormData] = useState({
    username: '',
    profileIMG: '',
    email: '',
    password: '',
    descripcion: '',
  });

  const [profile, setProfile] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [currentSection, setCurrentSection] = useState('tracks');
  const [currentNextStep, setCurrentNextStep] = useState('stepOne');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
  
    if (token) {
      // Obtener perfil del usuario
      const storedProfile = localStorage.getItem('spotify_user_profile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
  
      // Obtener el Top 5 de canciones
      axios
        .get('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTopTracks(response.data.items || []);
        })
        .catch((error) => {
          console.error('Error al obtener las canciones top:', error);
        });
  
      // Obtener Top 5 Artistas
      axios
        .get('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTopArtists(response.data.items || []);
        })
        .catch((error) => {
          console.error('Error al obtener los artistas top:', error);
        });
    }
  }, []);

  // Maneja el cambio de los campos de texto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

// Función para enviar los datos al backend
const setUserInfo = async () => {
  try {
    // Obtener el token desde localStorage
    const token = localStorage.getItem("spotify_access_token");

    // Verificar y obtener datos del usuario desde Spotify
    if (token) {
      try {
        const response = await axios.get('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        // Obtener los datos relevantes del perfil de Spotify
        const username = response.data.display_name || formData.username || "Usuario";
        const profileImage = response.data.images[0]?.url || formData.profileIMG || "";

        // Actualizar el estado de formData con los datos obtenidos
        setFormData((prevData) => ({
          ...prevData,
          username,
          profileIMG: profileImage,
        }));

        const updatedFormData = {
          ...formData,
          username,
          profileIMG: profileImage,
        };

        const { API_SERVICE } = envs;

        //console.log("Datos enviados al backend: ", updatedFormData);

        const saveResponse = await axios.post(`${API_SERVICE}/api/profile`, 
          updatedFormData);
        console.log("Perfil guardado exitosamente", saveResponse.data);
        //swal("Perfil Creado");


        swal({
          title: "Perfil creado con exito",
          icon: "success",
          button: "Ok",
        });

      } catch (error) {
        console.error("Error al obtener los datos del usuario desde Spotify", error);
      }
    } else {
      console.warn("Token de acceso no encontrado");
    }
  } catch (error) {
    console.error("Error al guardar el perfil", error);
  }
};


  

  if (!profile) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div className="profile-container">
      <Typography
        variant="h4"
        gutterBottom
        className="profile-title"
        style={{
          fontSize: '5rem',
          fontFamily: 'Montserrat',
          fontWeight: '700',
        }}
      >
        Creando Perfil
      </Typography>

      {currentNextStep === 'stepOne' && (
        <>
          <Typography
            style={{
              marginBottom: '1rem',
            }}
          >
            Paso 1: Estadísticas
          </Typography>
          <Avatar
            src={profile.images[0]?.url}
            alt={profile.display_name}
            className="profile-avatar"
            style={{
              width: '150px',
              height: '150px',
            }}
          />
          <Typography variant="h5" gutterBottom className="profile-name">
            {profile.display_name}
          </Typography>
          <div className="section-name">
            <Typography variant="h6" gutterBottom className="section-title">
              {currentSection === 'tracks' ? 'Top 5 Canciones' : 'Top 5 Artistas'}
            </Typography>
          </div>

          {currentSection === 'tracks' ? (
            <List className="top-tracks-list" style={{ margin: '0 auto' }}>
              {topTracks.map((track) => (
                <ListItem
                  key={track.id}
                  button
                  component="a"
                  href={track.external_urls.spotify}
                  target="_blank"
                  className="track-item"
                  alignItems="flex-start"
                >
                  <ListItemAvatar>
                    <Avatar src={track.album.images[0]?.url} alt={track.name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="body1">{track.name}</Typography>}
                    secondary={track.artists.map((artist) => artist.name).join(', ')}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <List className="top-tracks-list" style={{ margin: '0 auto' }}>
              {topArtists.map((artist) => (
                <ListItem
                  key={artist.id}
                  button
                  component="a"
                  href={artist.external_urls.spotify}
                  target="_blank"
                  className="track-item"
                  alignItems="flex-start"
                >
                  <ListItemText
                    primary={<Typography variant="body1" style={{ padding: '10px' }}>{artist.name}</Typography>}
                  />
                </ListItem>
              ))}
            </List>
          )}

          <div className="section-controls">
            <IconButton
              onClick={() => setCurrentSection('tracks')}
              style={{ backgroundColor: 'white', marginRight: '1rem' }}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton onClick={() => setCurrentSection('artists')} style={{ backgroundColor: 'white' }}>
              <ArrowForwardIcon />
            </IconButton>
          </div>

          <Button
            onClick={() => {
              navigate('/');
          }}
            style={{
              backgroundColor: 'green',
              color: 'white',
              marginTop: '1rem',
              padding: '8px',
              marginLeft: '1rem'
            }}
          >
            Volver al inicio
          </Button>
          <Button
            onClick={() => setCurrentNextStep('stepTwo')}
            style={{
              backgroundColor: 'green',
              color: 'white',
              marginTop: '1rem',
              padding: '8px',
            }}
          >
            Siguiente paso
          </Button>
        </>
      )}

      {currentNextStep === 'stepTwo' && (
        <>
          
          <div>
          <Typography
            style={{
              marginBottom: '1rem',
            }}
          >
            Paso 2: Información Adicional
          </Typography>
          <div>
            <TextField
            id="standard-multiline-static"
            label="Email"
            defaultValue=""
            value={formData.email}
            variant="standard"  className='socialMedia'
            name="email"
            onChange={handleInputChange} 
            sx={{
              '& .MuiInputLabel-root': { color: '#FFF'},
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFF' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFF' },
              '& .MuiInputBase-input': {color: '#FFF'},
            }}
            />
          </div>
          <div>
            <TextField
            id="standard-multiline-static"
            label="Contraseña"
            type='password'
            value={formData.password}
            htmlFor="standard-adornment-password"
            defaultValue=""
            variant="standard"  className='socialMedia'
            name="password"
            onChange={handleInputChange}
            sx={{
              '& .MuiInputLabel-root': { color: '#FFF'},
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFF' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFF' },
              '& .MuiInputBase-input': {color: '#FFF'},

            }}/>
          </div>
          <Typography
            style={{
              marginBottom: '0.5rem',
            }}
          >
            Las redes sociales no son obligatorias, solo coloca las que
            consideres necesarias.
            En las redes colocar el URL de la red social.
          </Typography>
          <div>
          <Typography style={{
            marginBottom: "1rem",
            fontSize:"1.5rem"
          }}>Agrega una descripcion para tu perfil</Typography>
          <TextField           
          id="standard-multiline-static"
          label="Descripcion"
          value={formData.descripcion}
          multiline
          rows={4}
          variant="standard" 
          name="descripcion"
          onChange={handleInputChange}
          sx={{
            '& .MuiInputLabel-root': { color: '#FFF'},
            '& .MuiInputLabel-root.Mui-focused': { color: '#FFF' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#FFF' },
            '& .MuiInputBase-input': {color: '#FFF'},
            width: "30rem",
            height: "4rem",
            display: "row",
            marginBottom: "5rem",
          }}/>
          <div>
            <TextField
            id="standard-multiline-static"
            label="X/Twitter"
            value={formData.twitter}
            defaultValue=""
            variant="standard"  className='socialMedia'
            name="twitter"
            onChange={handleInputChange}
            sx={{
              '& .MuiInputLabel-root': { color: '#FFF'},
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFF' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFF' },
              '& .MuiInputBase-input': {color: '#FFF'},

            }}/>
          </div>
          <div>
            <TextField
            id="standard-multiline-static"
            label="Facebook"
            value={formData.facebook}
            defaultValue=""
            variant="standard" className='socialMedia'
            name="facebook"
            onChange={handleInputChange}
            sx={{
              '& .MuiInputLabel-root': { color: '#FFF'},
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFF' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFF' },
              '& .MuiInputBase-input': {color: '#FFF'},
            }}/>
          </div>
          <div>
            <TextField
            id="standard-multiline-static"
            label="Instagram"
            value={formData.instagram}
            defaultValue=""
            variant="standard" className='socialMedia'
            name="instagram"
            onChange={handleInputChange}
            sx={{
              '& .MuiInputLabel-root': { color: '#FFF'},
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFF' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFF' },
              '& .MuiInputBase-input': {color: '#FFF'},
            }}/>
          </div>


          </div>
          <Button
            onClick={() => setCurrentNextStep('stepOne')}
            style={{
              backgroundColor: 'green',
              color: 'white',
              marginTop: '1rem',
              padding: '8px',
            }}
          >
            Volver al Paso 1
          </Button>
         {/*  <a href='/showprofile'>*/}
          <Button
            style={{
              backgroundColor: 'green',
              color: 'white',
              marginTop: '1rem',
              padding: '8px',
              marginLeft: '1rem'
            }}
            onClick={() => {
              setUserInfo();
            }}
          >
            Guardar Perfil
          </Button>
         {/** </a> */}
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;
