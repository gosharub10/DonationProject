import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { jwtDecode } from "jwt-decode";

import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await loginUser(form);

      const decoded: any = jwtDecode(response.token);

      const user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };

      login(response.token, user);

      if (user.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <h1 className="title">Вход</h1>

        <p className="subtitle">
          Войдите в аккаунт
        </p>

        <form onSubmit={handleSubmit}>
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
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;