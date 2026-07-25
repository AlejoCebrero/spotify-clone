import api from './api';

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const getMyPlaylists = (token) => {
  return api.get('/playlists', authHeader(token));
};

export const getPlaylistById = (id, token) => {
  return api.get(`/playlists/${id}`, authHeader(token));
};

export const createPlaylist = (name, token) => {
  return api.post('/playlists', { name }, authHeader(token));
};

export const addSongToPlaylist = (playlistId, songId, token) => {
  return api.put(`/playlists/${playlistId}/add`, { songId }, authHeader(token));
};

export const removeSongFromPlaylist = (playlistId, songId, token) => {
  return api.put(`/playlists/${playlistId}/remove`, { songId }, authHeader(token));
};

export const deletePlaylist = (id, token) => {
  return api.delete(`/playlists/${id}`, authHeader(token));
};