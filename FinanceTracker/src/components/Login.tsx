import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../api/services/AuthService";
import "../css/AuthTile.css";

interface LoginProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await AuthService.login(login, password);
      if (success) {
        setIsAuthenticated(AuthService.isAuthenticated());
        navigate("/transaction");
      } else {
        setError("Не вдалося увійти. Перевірте логін або пароль.");
      }
    } catch (err) {
      setError("Помилка під час входу.");
    }
  };

  return (
    <div className="login-page">
      <div className="form">
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Логін"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Увійти</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <p className="message">
            Ще не зареєстровані? <a href="/register">Створити акаунт</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
