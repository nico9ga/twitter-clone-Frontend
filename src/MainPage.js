import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Tweet from "./Tweet"

const MainPage = ({ onLogout }) => {
    const username = "prueba";
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate(); // Hook para redirigir
    const tweets = [
      { id: 1, content: "¡Hola mundo!", username: "juan perez", date: "hoy" },
      { id: 2, content: "texto de prueba", username: "juan perez", date: "hoy" },
      {id: 3, content: "Desarrollando mi clon de Twitter", username: "juan perez", date: "hoy",},
    ];
  
  
    const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
    };

    const handleLogout = () => {
        //onLogout(); // Llama la función de logout
        navigate("/"); // Redirige a Auth
      };
  
    return (
      <div className="main-container">
        {/* Botón para abrir la sidebar en móviles */}
        <button className="menu-button" onClick={toggleSidebar}>
          ☰
        </button>
  
        {/* Sidebar con animación */}
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <h2>Perfil</h2>
          <p
            onClick={() => navigate(`/profile/${username?.toString()}`)}
            style={{ cursor: "pointer", color: "blue" }}
          >
            @{username}
          </p>
          <button className="logout-button" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
  
        {/* Contenido principal */}
        <div className="feed">
          <h2>Inicio</h2>
          <div className="feed-tweets">
            {tweets.map((tweet) => (
              <Tweet key={tweet.id} tweet={tweet} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default MainPage;