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
      axios
        .get('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setProfile(response.data))
        .catch((error) => console.error('Error al obtener perfil:', error));

      axios
        .get('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setTopTracks(response.data.items || []))
        .catch((error) => console.error('Error al obtener canciones favoritas:', error));

      axios
        .get('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setTopArtists(response.data.items || []))
        .catch((error) => console.error('Error al obtener artistas favoritos:', error));

      axios
        .get('https://api.spotify.com/v1/me/albums?limit=5', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setRecentAlbums(response.data.items || []))
        .catch((error) => console.error('Error al obtener álbumes:', error));

      axios
        .get('https://api.spotify.com/v1/me/playlists?limit=5', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setPlaylists(response.data.items || []))
        .catch((error) => console.error('Error al obtener playlists:', error));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="principal-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {profile && (
  <div className="profile-header">
    {/* Foto de perfil */}
    <div className="profile-avatar-section">
      <Avatar
        src={profile.images?.[0]?.url}
        alt={profile.display_name}
        className="profile-avatar"
        sx={{ width: 150, height: 150 }}
      />
    </div>
    {/* Nombre, usuario y redes sociales */}
    <div className="profile-details">
      <Typography variant="h4" className="profile-name">
        {profile.display_name}
      </Typography>
      <Typography variant="subtitle1" className="profile-username">
        
      </Typography>
      <div className="social-links">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
            alt="Instagram"
          />
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
            alt="Facebook"
          />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/300px-X_logo_2023.svg.png"
            alt="Twitter"
          />
        </a>
      </div>
    </div>
    {/* Icono de notificaciones */}
    <div className="notification-section">
      <IconButton className="notification-icon">
        <Badge badgeContent={3} color="error">
          <NotificationsIcon sx={{ fontSize: 32 }} />
        </Badge>
      </IconButton>
    </div>
  </div>
)}
  
</div>

      {[
        { title: 'Tus Canciones Favoritas', items: topTracks, type: 'track' },
        { title: 'Tus Artistas Favoritos', items: topArtists, type: 'artist' },
        { title: 'Álbumes Recientes', items: recentAlbums.map(({ album }) => album), type: 'album' },
        { title: 'Tus Playlists Públicas', items: playlists, type: 'playlist' },
      ].map((section) => (
        <React.Fragment key={section.title}>
          <Divider sx={{ margin: '20px 0' }} />
          <Typography variant="h5">{section.title}</Typography>
          <List className="list-container">
            {section.items.map((item) => (
              <ListItem
                key={item.id}
                button
                component="a"
                href={item.external_urls.spotify}
                target="_blank"
                className="item-box"
              >
                <ListItemAvatar>
                <img
                  src={
                    section.type === 'track'
                      ? item.album?.images?.[0]?.url // Obtiene la imagen del álbum de la canción
                      : item.images?.[0]?.url // Para artistas, álbumes o playlists
                  }
                  alt={item.name || item.title}
                  className="item-avatar"
                />

                </ListItemAvatar>
                <ListItemText
                  primary={<span className="item-text">{item.name || item.title}</span>}
                  secondary={section.type === 'track' || section.type === 'album' ? (
                    <span className="item-subtext">
                      {item.artists?.map((artist) => artist.name).join(', ')}
                    </span>
                  ) : null}
                />
              </ListItem>
            ))}
          </List>
        </React.Fragment>
      ))}
    </div>
  );
}

export default Principal;
