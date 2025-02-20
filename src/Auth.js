import React, { useState } from "react";
import "./Auth.css";

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
          {isLogin ? <Login onAuthSuccess={handleAuthSuccess} /> : <Register onAuthSuccess={handleAuthSuccess} />}
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login con:", { email, password });
    onAuthSuccess();
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

        <button type="submit" className="auth-button">Ingresar</button>
      </form>
    </>
  );
};

const Register = ({ onAuthSuccess }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registro con:", { username, email, password });
    onAuthSuccess();
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

        <button type="submit" className="auth-button">Registrarse</button>
      </form>
    </>
  );
};

const MainPage = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="main-container">
      {/* Botón para abrir la sidebar en móviles */}
      <button className="menu-button" onClick={toggleSidebar}>☰</button>

      {/* Sidebar con animación */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2>Perfil</h2>
        <p>@usuario</p>
        <button className="logout-button" onClick={onLogout}>Cerrar Sesión</button>
      </div>

      {/* Contenido principal */}
      <div className="feed">
        <h2>Inicio</h2>
        <div className="tweet">
          <p>Este es un tweet de prueba</p>
          <div className="tweet-actions">
            <button>❤️</button>
            <button>🔁</button>
            <button>💬</button>
          </div>
        </div>
        <div className="tweet">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, eros non commodo viverra, neque nisi vehicula ligula, at suscipit magna nulla a risus. Integer vestibulum, nunc id maximus auctor, purus enim dapibus metus, sit amet sodales erat mi nec nisi. Duis id orci vitae ligula auctor tincidunt. Sed malesuada felis in mi aliquet, et tincidunt justo tempor. Nulla facilisi. Aliquam erat volutpat. Vestibulum et tellus sed eros vulputate tristique. Nulla at risus at lacus euismod dignissim.</p>
          <div className="tweet-actions">
            <button>❤️</button>
            <button>🔁</button>
            <button>💬</button>
          </div>
        </div>
        <div className="tweet">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, eros non commodo viverra, neque nisi vehicula ligula, at suscipit magna nulla a risus. Integer vestibulum, nunc id maximus auctor, purus enim dapibus metus, sit amet sodales erat mi nec nisi. Duis id orci vitae ligula auctor tincidunt. Sed malesuada felis in mi aliquet, et tincidunt justo tempor. Nulla facilisi. Aliquam erat volutpat. Vestibulum et tellus sed eros vulputate tristique. Nulla at risus at lacus euismod dignissim.

Donec dapibus ligula et feugiat ultrices. Nam luctus erat sit amet libero fringilla, eget facilisis erat pellentesque. In hac habitasse platea dictumst. Phasellus fermentum, justo at tristique vestibulum, erat metus sodales enim, nec malesuada urna felis sed libero. Etiam elementum, libero et eleifend malesuada, eros arcu bibendum mi, et elementum tortor libero a lacus. Integer et lacus mi. Vivamus suscipit diam vel leo sagittis, sed tempus purus fermentum. Aenean euismod malesuada augue in tristique.

</p>
          <div className="tweet-actions">
            <button>❤️</button>
            <button>🔁</button>
            <button>💬</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
