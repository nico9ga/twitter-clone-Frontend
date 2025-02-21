import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import Tweet from "./Tweet.js";

const ProfilePage = () => {
    const [isFollowing, setIsFollowing] = useState(false);
    const navigate = useNavigate();
  
  // Simulación de datos del usuario
  const { username } = useParams();
  const user = {
    name: "Juan Pérez",
    username: username,
    tweets: [
      { id: 1, content: "¡Hola mundo!", username: "juan perez", date: "hoy"  },
      { id: 2, content: "texto de prueba", username: "juan perez", date: "hoy"},
      { id: 3, content: "Desarrollando mi clon de Twitter", username: "juan perez", date: "hoy"},
    ],
    followers: 1200,
    following: 300,
  };
  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };
  return (
    <div className="profile-container">
        <button className="back-button" onClick={() => navigate("/feed")}>
        Volver al Feed
      </button>
      <div className="profile-card">
        <h2 className="profile-username">@{user.username}</h2>
        <h1 className="profile-name">{user.name}</h1>
        <p className="profile-followers">
          <strong>{user.followers}</strong> seguidores |{" "}
          <strong>{user.following}</strong> siguiendo
        </p>
        <button
          className= "follow-button" onClick={toggleFollow}
        >
          {isFollowing ? "Dejar de seguir" : "Seguir"}
        </button>      
        <h3 className="profile-tweets-title">Tweets</h3>
        <div className="profile-tweets">
          {user.tweets.map((tweet) => (
            <Tweet key={tweet.id} tweet={tweet} />
          ))}
        </div>
      </div>
    </div>
  );
};


export default ProfilePage;
