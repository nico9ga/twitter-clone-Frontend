import React from "react";
import { useNavigate } from "react-router-dom";
import "./Tweet.css"; // Asegúrate de tener estilos adecuados

const Tweet = ({ tweet }) => {
  const navigate = useNavigate();

  return (
    <div className="tweet">
      <div className="tweet-header">
        {/* Nombre del usuario con redirección */}
        <span className="tweet-username" onClick={() => navigate(`/profile/${tweet.username}`)}>
          @{tweet.username}
        </span>

        {/* Fecha del tweet */}
        <span className="tweet-date">{tweet.date}</span>
      </div>

      {/* Contenido del tweet */}
      <p className="tweet-content">{tweet.content}</p>
      <div className="tweet-actions">
        <button>❤️</button>
        <button>💬</button>
        <button>🔄</button>
      </div>
    </div>
  );
};

export default Tweet;

