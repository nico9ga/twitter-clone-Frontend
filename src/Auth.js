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
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    const userData = { email, password };

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al iniciar sesión");
      }

      const data = await response.json();
      console.log("Login exitoso", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      onAuthSuccess();
      navigate("/feed");

    } catch (error) {
      setError(error.message);
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

        <button type="submit" className="auth-button">
          Ingresar
        </button>
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
    
    const userData = { email, password, fullName, birthday };
    console.log("Enviando datos al backend:", userData);
    
    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
    
      const responseData = await response.json(); 
      
      if (!response.ok) {
        console.error("Error en la respuesta del servidor:", responseData);
        throw new Error(responseData.message || "Error en el registro");
      }
    
      console.log("Registro exitoso:", responseData);
      onAuthSuccess();
      navigate("/feed");
    } catch (error) {
      console.error("Error al enviar datos:", error.message);
      setError(error.message);
    }    
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

        <button type="submit" className="auth-button">
          Registrarse
        </button>
      </form>
    </>
  );
};

export default Auth;
