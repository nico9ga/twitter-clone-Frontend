import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import MainPage from "./MainPage";

const Auth = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuthSuccess = (token) => {
    setToken(token);
    setIsAuthenticated(true);
    localStorage.setItem("token", token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setIsAuthenticated(false);
  };

  const toggleAuth = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-container">
      {isAuthenticated ? (
        <MainPage token={token} onLogout={handleLogout} />
      ) : (
        <div className="auth-card">
          {isLogin ? (
            <Login onAuthSuccess={handleAuthSuccess} />
          ) : (
            <Register onAuthSuccess={handleAuthSuccess} />
          )}
          <p className="toggle-text">
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
            <button className="toggle-button" onClick={toggleAuth}>
              {isLogin ? "Registrarse" : "Iniciar Sesión"}
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

const Login = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const fakeUser = {
      email: "test@correo.com",
      password: "123456",
      token: "fake-token-123"
    };

    if (email === fakeUser.email && password === fakeUser.password) {
      onAuthSuccess(fakeUser.token);
      navigate("/feed");
    } else {
      setError("Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  return (
    <>
      <h2>Iniciar Sesión</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-button">Ingresar</button>
      </form>
    </>
  );
};

const Register = ({ onAuthSuccess }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setError("");
    const fakeUser = { token: "fake-register-token-456" };
    onAuthSuccess(fakeUser.token);
    navigate("/feed");
  };

  return (
    <>
      <h2>Registrarse</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Nombre Completo</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Fecha de Nacimiento</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Confirmar Contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-button">Registrarse</button>
      </form>
    </>
  );
};

export default Auth;