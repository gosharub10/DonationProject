import { Link } from "react-router-dom";

const GuestNavbar = () => {
  return (
    <div className="navbar">
      <div className="container nav-content">
          <h2>Сохрани</h2>
          
        <div className="nav-links">
          <Link to="/">Главная</Link>
            <Link to="/projects">Проекты</Link>
          <Link to="/login">Войти</Link>
          <Link to="/register">Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
};

export default GuestNavbar;