import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Tweet from "./Tweet";
import "./ProfilePage.css";
import EditProfilePage from "./EditProfilePage";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();
  const { username } = useParams();
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  //datos de prueba
  const userData = {
    id: 2,
    fullName: "Usuario Ejemplo",
    username: "ejemplo",
  };
  const userTweets = [
    {
      twitt_id: 101,
      content: "Este es mi primer tweet de prueba",
      created_at: "2025-03-26T12:00:00Z",
      user: { id: 2, fullName: "Usuario Ejemplo", username: "ejemplo" },
    },
    {
      twitt_id: 102,
      content: "Otro tweet de prueba para el perfil",
      created_at: "2025-03-26T12:30:00Z",
      user: { id: 2, fullName: "Usuario Ejemplo", username: "ejemplo" },
    },
  ];
  const followData = { followers: 120, following: 75 };

  const handleProfileUpdate = (updatedUser) => {
    console.log("Perfil actualizado:", updatedUser);
  };

  const fetchUserTweets = useCallback(async (userId) => {

    /*try {
      const response = await fetch(
        `http://localhost:3001/api/twitts?limit=1000&offset=0`
      );
      if (!response.ok) throw new Error("Error al obtener tweets");

      const data = await response.json();
      const userTweets = data.filter((tweet) => tweet.user.id === userId);*/
      setTweets(userTweets);
    /*} catch (error) {
      console.error(error);
    }*/
  }, []);

  const fetchUserProfile = useCallback(
    async (fullName) => {
      /*try {
        const response = await fetch(
          `http://localhost:3001/api/auth/user/${fullName}`
        );
        if (!response.ok) throw new Error("Error al obtener el usuario");

        const userData = await response.json();*/
        setUser(userData);
        fetchUserTweets(userData.id);
      /*} catch (error) {
        console.error(error);
        navigate("/");
      }*/
    },
    [fetchUserTweets, navigate]
  );

  const fetchFollowData = useCallback(async (userId) => {
    /*try {
      const response = await fetch(
        `http://localhost:3001/api/users/${userId}/followers`
      );
      if (!response.ok) throw new Error("Error al obtener seguidores");

      const data = await response.json();*/
      setFollowers(followData.followers);
      setFollowing(followData.following);
    /*} catch (error) {
      console.error("Error obteniendo seguidores:", error);
      setFollowers(0);
      setFollowing(0);
    }*/
  }, []);

  useEffect(() => {
    const fetchAuthUser = async () => {
      setAuthUser(userData); // Usa datos de prueba para autenticación
      console.log("Auth User:", userData);
  
      if (!username || username === userData.username) {
        setUser(userData);
        setTweets(userTweets);
        setFollowers(followData.followers);
        setFollowing(followData.following);
      } else {
        fetchUserProfile(username);
      }
    };
  
    fetchAuthUser();
  }, [navigate, username, fetchUserProfile]);
  

  const handleDeleteTweet = async (tweetId) => {
    /*try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/api/twitts/${tweetId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al eliminar tweet");
      setTweets(tweets.filter((tweet) => tweet.twitt_id !== tweetId));
    } catch (error) {
      console.error(error);
    }*/
   console.log("boton eliminar tweets presionado")
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
            <div className="profile-picture-placeholder"></div>
            <div className="user-details">
              <h3>{authUser.fullName}</h3>
              <p>@{authUser.username}</p>
            </div>
          </div>

          {/* Botones de navegación */}
          <nav className="buttons-container">
            <button
              className="profile-button"
              onClick={() => navigate(`/profile/${authUser.fullName}`)}
            >
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
        <div className="profile-picture-placeholder"></div>
        <h2 className="profile-username">@{user.fullName}</h2>
        <h1 className="profile-name">{user.fullName}</h1>
        <div className="follow-info">
          <span>
            <strong>{followers}</strong> Seguidores
          </span>
          <span> | </span>
          <span>
            <strong>{following}</strong> Siguiendo
          </span>
        </div>

        {authUser?.id !== user.id && (
          <button className="follow-button" onClick={toggleFollow}>
            {isFollowing ? "Dejar de seguir" : "Seguir"}
          </button>
        )}

        {authUser?.id == user.id && (
          <button
            className="edit-button"
            onClick={() => {
              localStorage.setItem("editUser", JSON.stringify(authUser));
              navigate(`/profile/${authUser.username}/edit`);
            }}            

          >
            Editar perfil
          </button>
        )}

        {/* Tweets del usuario */}
        <section className="profile-tweets-section">
          <h3 className="profile-tweets-title">Tweets</h3>
          <div className="profile-tweets">
            {tweets.map((tweet) => (
              <Tweet
                key={tweet.twitt_id}
                tweet={tweet}
                currentUser={authUser}
                onDelete={handleDeleteTweet}
                onEdit={(tweetId, newContent) => {
                  setTweets((prevTweets) =>
                    prevTweets.map((t) =>
                      t.twitt_id === tweetId ? { ...t, content: newContent } : t
                    )
                  );
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
