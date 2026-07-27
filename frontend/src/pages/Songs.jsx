import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSongs, createSong, updateSong, deleteSong, searchExternalSongs } from '../services/songService';

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', artist: '', album: '', duration: '', genre: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [externalTerm, setExternalTerm] = useState('');
  const [externalResults, setExternalResults] = useState([]);
  const { token } = useAuth();

  const fetchSongs = async (term = '') => {
    try {
      const response = await getSongs(term ? { title: term } : {});
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

  const handleExternalSearch = async () => {
    try {
      const response = await searchExternalSongs(externalTerm);
      setExternalResults(response.data);
    } catch (error) {
      console.error('Error al buscar en iTunes', error);
    }
  };

  const handleImport = async (song) => {
    try {
      await createSong(song, token);
      fetchSongs();
    } catch (error) {
      console.error('Error al importar la cancion', error);
    }
  };

  if (loading) return <p>Cargando canciones...</p>;

  return (
    <div>
      <h3>Canciones</h3>
      <input
        placeholder="Buscar canciones..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          fetchSongs(e.target.value);
        }}
      />
<hr />
      <h3>Subir canción</h3>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Título" value={formData.title} onChange={handleChange} />
        <input name="artist" placeholder="Artista" value={formData.artist} onChange={handleChange} />
        <input name="album" placeholder="Álbum" value={formData.album} onChange={handleChange} />
        <input name="duration" type="number" placeholder="Duración (segundos)" value={formData.duration} onChange={handleChange} />
        <input name="genre" placeholder="Género" value={formData.genre} onChange={handleChange} />
        <button type="submit">{editingId ? 'Guardar cambios' : 'Subir canción'}</button>
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

      <hr />
      <h3>Buscar en iTunes</h3>
      <input
        placeholder="Buscar artista o canción..."
        value={externalTerm}
        onChange={(e) => setExternalTerm(e.target.value)}
      />
      <button onClick={handleExternalSearch}>Buscar</button>

      <ul>
        {externalResults.map((song, index) => (
          <li key={index}>
            {song.title} — {song.artist} ({song.album})
            <button onClick={() => handleImport(song)}>Importar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Songs;