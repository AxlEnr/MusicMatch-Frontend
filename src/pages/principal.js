import React, { useEffect, useState } from 'react';
import { Typography, Avatar, List, ListItem, ListItemText, ListItemAvatar, Divider, Badge, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/principal.css'; // Importa los estilos personalizados

function Principal() {
  const [profile, setProfile] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [recentAlbums, setRecentAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');

    if (token) {
      // Obtener perfil del usuario
      axios
        .get('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setProfile(response.data))
        .catch((error) => console.error('Error al obtener perfil:', error));

      // Obtener canciones favoritas
      axios
        .get('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setTopTracks(response.data.items || []))
        .catch((error) => console.error('Error al obtener canciones favoritas:', error));

      // Obtener artistas favoritos
      axios
        .get('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setTopArtists(response.data.items || []))
        .catch((error) => console.error('Error al obtener artistas favoritos:', error));

      // Obtener álbumes reproducidos recientemente
      axios
        .get('https://api.spotify.com/v1/me/albums?limit=5', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setRecentAlbums(response.data.items || []))
        .catch((error) => console.error('Error al obtener álbumes:', error));

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
  }, [navigate]);

  return (
    <div className="principal-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {profile && (
          <>
            <div>
              <Typography variant="h4" className="principal-title">
                {profile.display_name}
              </Typography>
              <Avatar
            src={profile.images?.[0]?.url}
            alt={profile.display_name}
            className="profile-avatar"
            sx={{ width: 150, height: 150 }} // Tamaño personalizado
            />
            </div>
          </>
        )}
        <IconButton className="notification-icon">
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </div>

      <Divider sx={{ margin: '20px 0' }} />
      <Typography variant="h5">Tus Canciones Favoritas</Typography>
      <List className="list-container">
        {topTracks.map((track) => (
          <ListItem key={track.id} button component="a" href={track.external_urls.spotify} target="_blank">
            <ListItemAvatar>
              <Avatar src={track.album.images[0]?.url} alt={track.name} />
            </ListItemAvatar>
            <ListItemText primary={track.name} secondary={track.artists.map((artist) => artist.name).join(', ')} />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ margin: '20px 0' }} />
      <Typography variant="h5">Tus Artistas Favoritos</Typography>
      <List className="list-container">
        {topArtists.map((artist) => (
          <ListItem key={artist.id} button component="a" href={artist.external_urls.spotify} target="_blank">
            <ListItemAvatar>
              <Avatar src={artist.images[0]?.url} alt={artist.name} />
            </ListItemAvatar>
            <ListItemText primary={artist.name} />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ margin: '20px 0' }} />
      <Typography variant="h5">Álbumes Recientes</Typography>
      <List className="list-container">
        {recentAlbums.map(({ album }) => (
          <ListItem key={album.id} button component="a" href={album.external_urls.spotify} target="_blank">
            <ListItemAvatar>
              <Avatar src={album.images[0]?.url} alt={album.name} />
            </ListItemAvatar>
            <ListItemText primary={album.name} secondary={`Por ${album.artists.map((a) => a.name).join(', ')}`} />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ margin: '20px 0' }} />
      <Typography variant="h5">Tus Playlists</Typography>
      <List className="list-container">
        {playlists.map((playlist) => (
          <ListItem key={playlist.id} button component="a" href={playlist.external_urls.spotify} target="_blank">
            <ListItemAvatar>
              <Avatar src={playlist.images[0]?.url} alt={playlist.name} />
            </ListItemAvatar>
            <ListItemText primary={playlist.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default Principal;
