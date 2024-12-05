import axios from 'axios';

const getSpotifyData = (token) => {
  return axios.get('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getTopTracks = (token, limit = 10) => {
  return axios.get(`https://api.spotify.com/v1/me/top/tracks?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getTopArtists = (token, limit = 10) => {
  return axios.get(`https://api.spotify.com/v1/me/top/artists?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getRecentAlbums = (token, limit = 5) => {
  return axios.get(`https://api.spotify.com/v1/me/albums?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getPlaylists = (token, limit = 5) => {
  return axios.get(`https://api.spotify.com/v1/me/playlists?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export { getSpotifyData, getTopTracks, getTopArtists, getRecentAlbums, getPlaylists };
