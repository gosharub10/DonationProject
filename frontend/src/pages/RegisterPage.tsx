import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../services/authService";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await registerUser(form);

    navigate("/login");
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <h1 className="title">Регистрация</h1>

        <p className="subtitle">
          Создайте новый аккаунт
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="input"
              type="text"
              placeholder="Полное имя"
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <input
              className="input"
              type="email"
              placeholder="Электронная почта"
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <input
              className="input"
              type="password"
              placeholder="Пароль"
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />
          </div>

          <button className="btn">
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;