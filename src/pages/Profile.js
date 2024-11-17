import '../styles/Profile.css'
import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material';
import axios from 'axios';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [topTracks, setTopTracks] = useState([]);

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
    }
  }, []);

  if (!profile) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div className="profile-container">
  <Typography variant="h4" gutterBottom className="profile-title">
    Perfil de Usuario
  </Typography>
  <Avatar
    src={profile.images[0]?.url}
    alt={profile.display_name}
    className="profile-avatar" // Clase para el avatar
  />
  <Typography variant="h5" gutterBottom className="profile-name">
    {profile.display_name}
  </Typography>
  <Typography variant="h6" gutterBottom className="top-tracks-title">
    Top 5 Canciones
  </Typography>
  <List className="top-tracks-list">
    {topTracks.map((track) => (
      <ListItem 
        key={track.id} 
        button 
        component="a" 
        href={track.external_urls.spotify} 
        target="_blank" 
        className="track-item" // Clase para cada canción
        alignItems="flex-start"
      >
        <ListItemAvatar>
          <Avatar src={track.album.images[0]?.url} alt={track.name} />
        </ListItemAvatar>
        <ListItemText
          primary={<Typography variant="body1" className="track-name">{track.name}</Typography>}
          secondary={track.artists.map((artist) => artist.name).join(', ')}
        />
      </ListItem>
    ))}
  </List>
</div>

  );
}

export default Profile;
