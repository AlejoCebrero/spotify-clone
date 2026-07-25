import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getMyPlaylists,
  getPlaylistById,
  createPlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist
} from '../services/playlistService';
import { getSongs } from '../services/songService';

const PlaylistsPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [allSongs, setAllSongs] = useState([]);
  const { token } = useAuth();

  const fetchPlaylists = async () => {
    const response = await getMyPlaylists(token);
    setPlaylists(response.data);
  };

  const fetchAllSongs = async () => {
    const response = await getSongs();
    setAllSongs(response.data);
  };

  useEffect(() => {
    fetchPlaylists();
    fetchAllSongs();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createPlaylist(newPlaylistName, token);
    setNewPlaylistName('');
    fetchPlaylists();
  };

  const handleSelect = async (id) => {
    const response = await getPlaylistById(id, token);
    setSelectedPlaylist(response.data);
  };

  const handleAddSong = async (songId) => {
    await addSongToPlaylist(selectedPlaylist._id, songId, token);
    handleSelect(selectedPlaylist._id);
  };

  const handleRemoveSong = async (songId) => {
    await removeSongFromPlaylist(selectedPlaylist._id, songId, token);
    handleSelect(selectedPlaylist._id);
  };

  const handleDelete = async (id) => {
    await deletePlaylist(id, token);
    setSelectedPlaylist(null);
    fetchPlaylists();
  };

  return (
    <div>
      <h2>Mis Playlists</h2>

      <form onSubmit={handleCreate}>
        <input
          placeholder="Nombre de la playlist"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
        />
        <button type="submit">Crear playlist</button>
      </form>

      <ul>
        {playlists.map((playlist) => (
          <li key={playlist._id}>
            <span onClick={() => handleSelect(playlist._id)} style={{ cursor: 'pointer' }}>
              {playlist.name}
            </span>
            <button onClick={() => handleDelete(playlist._id)}>Borrar</button>
          </li>
        ))}
      </ul>

      {selectedPlaylist && (
        <div>
          <h3>{selectedPlaylist.name}</h3>

          <h4>Canciones en la playlist</h4>
          <ul>
            {selectedPlaylist.songs.map((song) => (
              <li key={song._id}>
                {song.title} — {song.artist}
                <button onClick={() => handleRemoveSong(song._id)}>Quitar</button>
              </li>
            ))}
          </ul>

          <h4>Agregar canción</h4>
          <ul>
            {allSongs.map((song) => (
              <li key={song._id}>
                {song.title} — {song.artist}
                <button onClick={() => handleAddSong(song._id)}>Agregar</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlaylistsPage;