import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import MainPage from "./MainPage";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const toggleAuth = () => {
    setIsLogin(!isLogin);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="auth-container">
      {isAuthenticated ? (
        <MainPage onLogout={handleLogout} />
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
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login con:", { email, password });
    onAuthSuccess();
    navigate("/feed");
  };

  return (
    <>
      <h2>Iniciar Sesión</h2>
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

        <button type="submit" className="auth-button">
          Ingresar
        </button>
      </form>
    </>
  );
};

const Register = ({ onAuthSuccess }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registro con:", { username, email, password });
    onAuthSuccess();
    navigate("/feed");
  };

  return (
    <>
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Nombre de Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-button">
          Registrarse
        </button>
      </form>
    </>
  );
};

export default Auth;
