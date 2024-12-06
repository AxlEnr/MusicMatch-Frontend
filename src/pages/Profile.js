import '../styles/Profile.css';
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Avatar,
  Button,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { envs } from '../config/envs';
import swal from 'sweetalert';

function Profile() {
  const [formData, setFormData] = useState({
    username: '',
    profileImg: '',
    email: '',
    userPass: '',
    userDesc: '',
    twitter: '',
    facebook: '',
    instagram: '',
    other: '',
  });

  const [profile, setProfile] = useState(null);
  const [currentNextStep, setCurrentNextStep] = useState('stepOne');
  const [recentAlbums, setRecentAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    if (token) {
      const storedProfile = localStorage.getItem('spotify_user_profile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }

      // Obtener listas de reproducción del usuario
      axios
        .get('https://api.spotify.com/v1/me/playlists?limit=5', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setPlaylists(response.data.items || []))
        .catch((error) => console.error('Error al obtener playlists:', error));
    } else {
      navigate('/login'); // Redirigir si no hay token
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const setUserInfo = async () => {
    try {
      const token = localStorage.getItem('spotify_access_token');
      if (!token) throw new Error('No se encontró el token de acceso.');

      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const username = response.data.display_name || formData.username || 'Usuario';
      const profileImage = response.data.images[0]?.url || formData.profileImg || '';

      const updatedFormData = {
        username,
        email: formData.email || '',
        profileImg: profileImage,
        userPass: formData.userPass || '',
        userDesc: formData.userDesc || '',
      };



      const { API_SERVICE } = envs;
      const saveResponse = await axios.post(`${API_SERVICE}/api/profile/save`, updatedFormData);
      // Guardar email en localStorage
      localStorage.setItem('spotify_user_email', updatedFormData.email);
      

    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      swal({ title: 'Error al guardar el perfil', icon: 'error', button: 'Ok' });
    }
  };

  const savePreferences = async () => {
    try {
      const token = localStorage.getItem('spotify_access_token');
      if (!token) throw new Error('No se encontró el token de acceso.');
  
      const { API_SERVICE } = envs;
  
      // Obtener los 10 artistas favoritos desde Spotify
      const topArtistsResponse = await axios.get(
        'https://api.spotify.com/v1/me/top/artists?limit=10',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const topArtists = topArtistsResponse.data.items.map((artist) => artist.name);
  
      // Obtener las 10 canciones favoritas desde Spotify
      const topTracksResponse = await axios.get(
        'https://api.spotify.com/v1/me/top/tracks?limit=10',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const topTracks = topTracksResponse.data.items.map((track) => ({
        name: track.name,
        artistName: track.artists[0]?.name || null,
      }));
  
      // Obtener el userID
      const userEmail = formData.email;
      const userResponse = await axios.get(`${API_SERVICE}/api/profile/getProfileByEmail/${userEmail}`);
      const userID = userResponse.data?.data?.idUsers;
  
      if (!userID) {
        throw new Error('Usuario no encontrado.');
      }
  
      // Buscar los artistas y canciones en la base de datos
      const artistPromises = topArtists.map(async (artistName) => {
        try {
          const response = await axios.get(`${API_SERVICE}/api/artists/getArtist/${encodeURIComponent(artistName)}`);
          return response.data?.data ? { idArtist: response.data.data.idArtist, name: artistName } : null;
        } catch (error) {
          console.error(`Error al buscar el artista ${artistName}:`, error.message);
          return null;
        }
      });
  
      const songPromises = topTracks.map(async (track) => {
        try {
          const songResponse = await axios.get(`${API_SERVICE}/api/music/getMusic/${encodeURIComponent(track.name)}`);
          const songData = songResponse.data?.data;
          return songData ? { idMusic: songData.idMusic, name: track.name } : null;
        } catch (error) {
          console.error(`Error al buscar la canción "${track.name}":`, error.message);
          return null;
        }
      });
  
      const foundArtists = (await Promise.all(artistPromises)).filter(Boolean);
      const foundSongs = (await Promise.all(songPromises)).filter(Boolean);
  
      // Crear el payload y guardar las preferencias
      const userMusicPreferencesPayload = foundSongs.map((song) => {
        // Tomar el primer artista encontrado, si existe
        const artist = foundArtists[0]; // Asignar el primer artista encontrado

        // Agregar información de depuración
        console.log(`Asignando artista "${artist?.name || 'N/A'}" a la canción "${song.name}"`);

        return {
          userID,
          musicID: song.idMusic,
          artistID: artist?.idArtist || null, // Asignar null si no hay artista
        };
      });

      // Guardar todas las preferencias, sin filtrar por artistID
      await Promise.all(
        userMusicPreferencesPayload.map(async (preference) => {
          try {
            const response = await axios.post(`${API_SERVICE}/api/preferences/save`, preference);
            console.log(response.data.message);
          } catch (error) {
            console.error('Error al guardar la preferencia de música:', error.message);
          }
        })
      );

console.log('Payload enviado:', userMusicPreferencesPayload);

      console.log('Preferencias de música guardadas con éxito.');
    } catch (error) {
      console.error('Error al guardar las preferencias de música:', error.message);
    }
  };
  
  const createMatches = async () => {
    try {
      const { API_SERVICE } = envs;
  
      // Suponiendo que el backend tiene un endpoint para generar matches
      const response = await axios.post(`${API_SERVICE}/api/matches/createAll`);
      
    } catch (error) {
      console.error('Error al crear los matches:', error.message);
      swal({
        title: 'Error al crear matches',
        text: error.message || 'Ocurrió un error inesperado.',
        icon: 'error',
        button: 'Ok',
      });
    }
  };
  
  

  const saveSocialMedia = async () => {
    try {
      const { API_SERVICE } = envs;
      if (!formData.email) throw new Error('El email no está configurado.');
  
      // Obtener perfil a partir del email
      const response = await axios.get(`${API_SERVICE}/api/profile/getProfileByEmail/${formData.email}`);
      const userProfile = response.data.data;
  
      if (!userProfile || !userProfile.idUsers) {
        throw new Error('No se encontró el perfil del usuario.');
      }
  
      const userID = userProfile.idUsers;
  
      const socialData = {
        twitter: formData.twitter?.toString() || "",
        facebook: formData.facebook?.toString() || "",
        instagram: formData.instagram?.toString() || "",
        other: formData.other?.toString() || "",
      };
  
      await Promise.all(
        Object.entries(socialData).map(([platformName, profileLink]) =>
          profileLink
            ? axios.post(`${API_SERVICE}/api/links/save`, { platformName, profileLink, userID })
            : null
        )
      );
  
      swal({
        title: 'Perfil creado con éxito',
        icon: 'success',
        button: 'Ok',
      }).then(() => {
        navigate('/principal'); // Redirigir a la página deseada
      });
  
    } catch (error) {
      console.error('Error al guardar las redes sociales:', error);
      swal({
        title: 'Error al guardar las redes sociales',
        text: error.message || 'Ocurrió un error inesperado.',
        icon: 'error',
        button: 'Ok',
      });
    }
  };
  
  const saveUserMusicAndArtists = async () => {
    try {
      const token = localStorage.getItem('spotify_access_token');
      if (!token) throw new Error('No se encontró el token de acceso.');
  
      // Obtener artistas favoritos del usuario desde Spotify
      const topArtistsResponse = await axios.get(
        'https://api.spotify.com/v1/me/top/artists?limit=10',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const topArtists = topArtistsResponse.data.items.map((artist) => ({
        artistName: artist.name,
      }));
  
      // Obtener canciones favoritas del usuario desde Spotify
      const topTracksResponse = await axios.get(
        'https://api.spotify.com/v1/me/top/tracks?limit=10',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const topTracks = topTracksResponse.data.items.map((track) => ({
        songName: track.name,
      }));
  
      const { API_SERVICE } = envs;
  
      // Guardar artistas en el backend
      await Promise.all(
        topArtists.map((artist) =>
          axios.post(`${API_SERVICE}/api/artists/save`, artist)
        )
      );
  
      // Guardar canciones en el backend
      await Promise.all(
        topTracks.map((track) =>
          axios.post(`${API_SERVICE}/api/music/save`, track)
        )
      );
  
      
    } catch (error) {
      console.error('Error al guardar música y artistas:', error);
      swal({
        title: 'Error al guardar música y artistas',
        text: error.message || 'Ocurrió un error inesperado.',
        icon: 'error',
        button: 'Ok',
      });
    }
  };
  
  
  const savePlaylists = async () => {
    try {
      const { API_SERVICE } = envs;
  
      // Guardar playlists
      for (const playlist of playlists) {
        const playlistData = {
          name: playlist.name,
          coverUrl: playlist.images[0]?.url,
          ownerID: playlist.owner.id,
        };
  
        await axios.post(`${API_SERVICE}/api/playlist/save`, playlistData);
      }
  
      
    } catch (error) {
      console.error('Error al guardar playlists:', error);
      swal({
        title: 'Error al guardar playlists',
        text: error.message || 'Ocurrió un error inesperado.',
        icon: 'error',
        button: 'Ok',
      });
    }
  };
  
  

  if (!profile) {
    return <div>Cargando perfil...</div>;
  }


  return (
    <div className="profile-container" style={{
      padding: "5rem",
      margin: "2rem",
      borderRadius:"10px",
      border: "2px solid green"
    }  
    }>
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
            
          </Typography>
          <Avatar
            src={profile.images[0]?.url}
            alt={profile.display_name}
            className="profile-avatar"
            style={{
              width: '150px',
              height: '150px',
              margin: '0 auto',
            }}
          />

          <div>
          <Typography style={{
            marginTop: "1rem",
            fontSize:"1.5rem"
          }}>Ingresa un usuario y una contraseña</Typography>
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
              marginTop:"2rem",
            }}
            />
          </div>
          <div>
            <TextField
            id="standard-multiline-static"
            label="Contraseña"
            type='password'
            value={formData.userPass}
            htmlFor="standard-adornment-password"
            defaultValue=""
            variant="standard"  className='socialMedia'
            name="userPass"
            onChange={handleInputChange}
            sx={{
              '& .MuiInputLabel-root': { color: '#FFF'},
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFF' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFF' },
              '& .MuiInputBase-input': {color: '#FFF'},
              marginTop:"2rem",
              marginBottom:"2rem",
            }}/>
          </div>

          <div>
          <Typography style={{
            marginBottom: "1rem",
            fontSize:"1.5rem"
          }}>Agrega una descripción para tu perfil</Typography>
          <TextField           
          id="standard-multiline-static"
          label="Descripcion"
          value={formData.userDesc}
          multiline
          rows={4}
          variant="standard" 
          name="userDesc"
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
              marginLeft: '1rem',
              marginRight: '1rem',
            }}
          >
            Volver al inicio
          </Button>
          <Button
            onClick={async () => {
              await setUserInfo();
              setCurrentNextStep('stepTwo');
            }}
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
            Paso 2: Redes Sociales
          </Typography>
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
          <div>
            <TextField
            id="standard-multiline-static"
            label="X/Twitter"
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

          <div>
            <TextField
            id="standard-multiline-static"
            label="Otro"
            defaultValue=""
            variant="standard" className='socialMedia'
            name="Otro"
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
              marginLeft: '1rem',
            }}
            onClick={async () => {
              const socialData = {
                twitter: formData.twitter?.toString() || "",
                facebook: formData.facebook?.toString() || "",
                instagram: formData.instagram?.toString() || "",
                other: formData.other?.toString() || "",

                
              };
              await saveSocialMedia(socialData);
              await saveUserMusicAndArtists();
              await savePlaylists();
              await savePreferences();
              await createMatches();
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
