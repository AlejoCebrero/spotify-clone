import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>

      {token ? (
        <>
          <span>Hola, {user?.username}</span>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Registro</Link>
        </>
      )}

      {token && <Link to="/songs">Inicio</Link>}
      {token && <Link to="/playlists">Mis Playlists</Link>}
      {token && <button onClick={handleLogout}>Cerrar sesión</button>}

    </nav>
  );
};

export default Navbar;