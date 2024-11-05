import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../api/services/UserService";
import "../css/AuthTile.css";

const Register: React.FC = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Перевірка на співпадіння паролів
    if (password !== confirmPassword) {
      setError("Паролі не співпадають");
      return;
    }

    // Створення нового користувача
    try {
      await UserService.create({ login, password });
      navigate("/login"); // Перенаправлення на сторінку логіну після успішної реєстрації
    } catch (err: unknown) {
      // Перевіряємо тип помилки
      if (err instanceof Error) {
        // Якщо це AxiosError, перевіряємо статус відповіді
        const axiosError = err as any; // Використовуємо 'any', оскільки AxiosError не імпортується
        if (axiosError.response && axiosError.response.status === 409) {
          setError("Користувач вже існує.");
        } else {
          setError("Не вдалося зареєструватися. Спробуйте ще раз.");
        }
      } else {
        setError("Невідома помилка.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="form">
        <form className="register-form" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Create</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <p className="message">
            Already registered? <a href="/login">Sign In</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
