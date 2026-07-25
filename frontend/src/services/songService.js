import api from './api';

export const getSongs = (filters = {}) => {
  return api.get('/songs', { params: filters });
};

export const createSong = (songData, token) => {
  return api.post('/songs', songData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateSong = (id, songData, token) => {
  return api.put(`/songs/${id}`, songData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const deleteSong = (id, token) => {
  return api.delete(`/songs/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const searchExternalSongs = (term) => {
  return api.get('/songs/external/search', { params: { term } });
};