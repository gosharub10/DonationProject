import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserNavbar = () => {
  const { logout } = useAuth();

  return (
    <div className="navbar">
      <div className="container nav-content">
        <h2>Сохрани</h2>

        <div className="nav-links">
          <Link to="/">Главная</Link>
          <Link to="/projects">Проекты</Link>
          <button className="btn" onClick={logout}>
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserNavbar;