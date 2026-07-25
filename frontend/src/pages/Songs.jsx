import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSongs, createSong, updateSong, deleteSong } from '../services/songService';

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', artist: '', album: '', duration: '', genre: '' });
  const [editingId, setEditingId] = useState(null);
  const { token } = useAuth();

  const fetchSongs = async () => {
    try {
      const response = await getSongs();
      setSongs(response.data);
    } catch (error) {
      console.error('Error al traer canciones', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const songData = { ...formData, duration: Number(formData.duration) };

    try {
      if (editingId) {
        await updateSong(editingId, songData, token);
      } else {
        await createSong(songData, token);
      }
      setFormData({ title: '', artist: '', album: '', duration: '', genre: '' });
      setEditingId(null);
      fetchSongs();
    } catch (error) {
      console.error('Error al guardar la cancion', error);
    }
  };

  const handleEdit = (song) => {
    setFormData({
      title: song.title,
      artist: song.artist,
      album: song.album || '',
      duration: song.duration,
      genre: song.genre || ''
    });
    setEditingId(song._id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteSong(id, token);
      fetchSongs();
    } catch (error) {
      console.error('Error al borrar la cancion', error);
    }
  };

  if (loading) return <p>Cargando canciones...</p>;

  return (
    <div>
      <h2>Canciones</h2>

      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Título" value={formData.title} onChange={handleChange} />
        <input name="artist" placeholder="Artista" value={formData.artist} onChange={handleChange} />
        <input name="album" placeholder="Álbum" value={formData.album} onChange={handleChange} />
        <input name="duration" type="number" placeholder="Duración (segundos)" value={formData.duration} onChange={handleChange} />
        <input name="genre" placeholder="Género" value={formData.genre} onChange={handleChange} />
        <button type="submit">{editingId ? 'Guardar cambios' : 'Crear canción'}</button>
      </form>

      <ul>
        {songs.map((song) => (
          <li key={song._id}>
            {song.title} — {song.artist} ({song.album})
            <button onClick={() => handleEdit(song)}>Editar</button>
            <button onClick={() => handleDelete(song._id)}>Borrar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Songs;