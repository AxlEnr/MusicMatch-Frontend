import '../styles/Profile.css';
import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, IconButton, Button } from '@mui/material';
import axios from 'axios';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [currentSection, setCurrentSection] = useState('tracks'); // Estado para controlar la sección visible

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
        .get('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5', {
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
        .get('https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=5', {
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

      <div>
        <Typography style={{
          marginBottom:"1rem"
        }}>Paso 1: Estadisticas</Typography>
      </div>

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
        <List className="top-tracks-list" style={{
          margin: "0 auto"
        }}>
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
        <List className="top-tracks-list" style={{
          margin:"0 auto"
        }}>
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
                primary={<Typography variant="body1" style={{
                  padding:"10px",
                }}>{artist.name}</Typography>}
              />
            </ListItem>
          ))}
        </List>
      )}

        <div className="section-controls">
          {/* Botones para alternar entre Top Canciones y Top Artistas */}
          <IconButton onClick={() => setCurrentSection('tracks')} style={{
            backgroundColor:"white",
            marginRight:"1rem"
          }}>
            <ArrowBackIcon />
          </IconButton>
          <IconButton onClick={() => setCurrentSection('artists')} style={{
            backgroundColor:"white"
          }}>
            <ArrowForwardIcon />
          </IconButton>
          {/*BOTON PARA GUARDAR EN LA BASE DE DATOS LA INFORMACION Y EMPEZAR A CREAR PERFIL */}
          <div>
            <Button style={{
              backgroundColor:"green",
              color:"white",
              marginTop:"1rem",
              padding:"8px"
            }}>
              Siguiente paso
            </Button>
          </div>
          
        </div>

    </div>
  );
}

export default Profile;
