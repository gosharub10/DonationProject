import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminNavbar = () => {
  const { logout } = useAuth();

  return (
    <div className="navbar">
      <div className="container nav-content">
        <h2>Панель администратора</h2>

        <div className="nav-links">
          <Link to="/">Главная</Link>
          <Link to="/projects">Проекты</Link>
          <Link to="/admin">График</Link>
          <Link to="/admin/users">Пользователи</Link>

          <button className="btn" onClick={logout}>
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;