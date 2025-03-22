import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Tweet from "./Tweet";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();
  const { username } = useParams();

  const fetchUserTweets = useCallback(async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/twitts?limit=1000&offset=0`);
      if (!response.ok) throw new Error("Error al obtener tweets");

      const data = await response.json();
      const userTweets = data.filter((tweet) => tweet.user.id === userId);
      setTweets(userTweets);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchUserProfile = useCallback(async (fullName) => {
    try {
      const response = await fetch(`http://localhost:3001/api/auth/user/${fullName}`);
      if (!response.ok) throw new Error("Error al obtener el usuario");

      const userData = await response.json();
      setUser(userData);
      fetchUserTweets(userData.id);
    } catch (error) {
      console.error(error);
      navigate("/");
    }
  }, [fetchUserTweets, navigate]);

  useEffect(() => {
    const fetchAuthUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch("http://localhost:3001/api/auth/check-status", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        const authData = await response.json();
        setAuthUser(authData);

        if (!username || username === authData.fullName) {
          setUser(authData);
          fetchUserTweets(authData.id);
        } else {
          fetchUserProfile(username);
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
        navigate("/");
      }
    };

    fetchAuthUser();
  }, [navigate, username, fetchUserProfile, fetchUserTweets]);

  const handleDeleteTweet = async (tweetId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/twitts/${tweetId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar tweet");
      setTweets(tweets.filter((tweet) => tweet.twitt_id !== tweetId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  if (!user) {
    return <p>Cargando perfil...</p>;
  }

  return (
    <div className="main-container">
      {/* Barra Lateral */}
      {authUser && (
        <aside className="left-sidebar">
          <div className="user-container">
            <div className="reload-circle" onClick={() => navigate("/")} />
            <div className="profile-picture-placeholder"></div> {/* Círculo gris */}
            <div className="user-details">
              <h3>{authUser.fullName}</h3>
              <p>@{authUser.username}</p>
            </div>
          </div>
  
          {/* Botones de navegación */}
          <nav className="buttons-container">
            <button className="profile-button" onClick={() => navigate(`/profile/${authUser.fullName}`)}>
              Perfil
            </button>
            <button className="logout-button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </nav>
        </aside>
      )}
  
      {/* Contenido del Perfil */}
      <div className="profile-container">
        <h2 className="profile-username">@{user.fullName}</h2>
        <h1 className="profile-name">{user.fullName}</h1>
        <p className="profile-followers">
          <strong>{user.followers}</strong> seguidores | <strong>{user.following}</strong> siguiendo
        </p>
  
        {authUser?.id !== user.id && (
          <button className="follow-button" onClick={toggleFollow}>
            {isFollowing ? "Dejar de seguir" : "Seguir"}
          </button>
        )}
  
        {/* Tweets del usuario */}
        <section className="profile-tweets-section">
          <h3 className="profile-tweets-title">Tweets</h3>
          <div className="profile-tweets">
            {tweets.map((tweet) => (
              <Tweet key={tweet.twitt_id} tweet={tweet} currentUser={authUser} onDelete={handleDeleteTweet} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;