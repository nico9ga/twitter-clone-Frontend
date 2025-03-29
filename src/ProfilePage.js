import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Tweet from "./Tweet";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [originalTweets, setOriginalTweets] = useState([]);
  const [retweets, setRetweets] = useState([]);
  const [combinedTweets, setCombinedTweets] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [activeTab, setActiveTab] = useState("tweets");
  const navigate = useNavigate();
  const { username } = useParams();

  // Obtener contadores de followers/following
  const fetchFollowCounts = useCallback(async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const [followersResponse, followedResponse] = await Promise.all([
        fetch(`http://localhost:3100/countfollowers/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:3100/countfollowed/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      if (!followersResponse.ok || !followedResponse.ok) {
        throw new Error("Error al obtener conteos de seguimiento");
      }

      const followersData = await followersResponse.json();
      const followedData = await followedResponse.json();

      setFollowersCount(followersData);
      setFollowingCount(followedData);
      
      setUser(prev => ({
        ...prev,
        followers: followersData,
        following: followedData
      }));

    } catch (err) {
      console.error("Error fetching follow counts:", err);
      setFollowersCount(0);
      setFollowingCount(0);
      if (err.message.includes("401")) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  }, [navigate]);

  // Manejar follow/unfollow
  const handleFollow = async () => {
    try {
      if (!user?.id) return;
      
      const token = localStorage.getItem("token");
      const endpoint = isFollowing ? 'removefollow' : 'createfollow';
      
      const response = await fetch(`http://localhost:3100/${endpoint}/${user.id}`, {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Si recibimos 400, significa que ya seguimos/no seguimos al usuario
      if (response.status === 400) {
        setIsFollowing(!isFollowing);
        return;
      }

      if (!response.ok) throw new Error("Error al actualizar seguimiento");
      
      // Actualizar estado y recargar contadores
      setIsFollowing(!isFollowing);
      await fetchFollowCounts(user.id);
      
    } catch (err) {
      console.error("Error al seguir/dejar de seguir:", err);
      alert("Ocurrió un error al actualizar el seguimiento");
    }
  };

const fetchAllTweetsAndFilter = useCallback(async () => {
  try {
    setLoading(true);
    
    // 1. Obtener todos los tweets normales
    const response = await fetch(`http://localhost:3100/`);
    if (!response.ok) throw new Error("Error al obtener tweets");
    const allTweets = await response.json();

    // 2. Buscar usuario por username para obtener su ID
    const userTweet = allTweets.find(tweet => 
      tweet.user?.fullName === username
    ) || allTweets.find(tweet => 
      tweet.tweet?.user?.fullName === username
    );

    if (!userTweet) throw new Error("Usuario no encontrado");

    const userId = userTweet.user?.id || userTweet.tweet?.user?.id;
    const userData = userTweet.user || userTweet.tweet?.user;
    setUser(userData);

    // 3. Cargar datos de follows
    await fetchFollowCounts(userId);

    // 4. Filtrar tweets originales del usuario (no retweets)
    const userOriginalTweets = allTweets.filter(tweet => 
      tweet.user?.id === userId && !tweet.isRetweet
    );
    setOriginalTweets(userOriginalTweets);

    // 5. Obtener retweets específicos del usuario
    const retweetsResponse = await fetch(`http://localhost:3100/alluserretweets/${userId}`);
    if (!retweetsResponse.ok) throw new Error("Error al obtener retweets");
    let userRetweetsData = await retweetsResponse.json();

    // 6. Filtrar retweets válidos (CORRECCIÓN IMPORTANTE)
    const filteredRetweets = userRetweetsData.filter(retweetData => {
      // Excluir elementos sin tweet
      if (!retweetData.tweet) return false;
      
      // Incluir solo retweets donde el usuario que retuitea (user.id) es diferente al autor original (tweet.id)
      return retweetData.user.id !== retweetData.tweet.id;
    });

    // 7. Procesar retweets válidos
    const processedRetweets = filteredRetweets.map(retweetData => ({
      id: retweetData.tweet.twitt_id,
      isRetweet: true,
      createdAt: retweetData.tweet.createdAt,
      user: retweetData.user, // Usuario que retweeteó (el perfil actual)
      originalTweet: {
        ...retweetData.tweet,
        user: retweetData.user // Usuario original del tweet
      }
    }));

    console.log("Retweets procesados:", processedRetweets);
    setRetweets(processedRetweets);

    // 8. Combinar para timeline general
    const combined = [...userOriginalTweets, ...processedRetweets]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setCombinedTweets(combined);

  } catch (err) {
    console.error("Error fetching tweets:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, [username, fetchFollowCounts]);

  // Obtener usuario autenticado desde checkstatus
  const fetchAuthUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:3100/checkstatus", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const authData = await response.json();
      setAuthUser(authData);

      // Si es el perfil propio, usar datos de checkstatus
      if (authData.fullName === username) {
        setUser(authData);
      }

      fetchAllTweetsAndFilter();
    } catch (err) {
      console.error("Error al obtener usuario:", err);
      navigate("/login");
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3100/deletetweet/${tweetId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar tweet");
      
      setOriginalTweets(prev => prev.filter(t => t.id !== tweetId));
      setRetweets(prev => prev.filter(t => t.id !== tweetId && t.tweetId !== tweetId));
      setCombinedTweets(prev => prev.filter(t => 
        (t.id !== tweetId) && (t.tweetId !== tweetId)
      ));
    } catch (err) {
      console.error("Error deleting tweet:", err);
      alert("No se pudo eliminar el tweet");
    }
  };

  const handleEditTweet = async (tweetId, newContent) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3100/updatetweet/${tweetId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newContent }),
      });

      if (!response.ok) throw new Error("Error al editar tweet");

      const updateTweetInArray = (arr) => arr.map(t => {
        if (t.id === tweetId) {
          return { ...t, content: newContent };
        }
        if (t.tweetId === tweetId && t.originalTweet) {
          return { 
            ...t, 
            originalTweet: { ...t.originalTweet, content: newContent } 
          };
        }
        return t;
      });

      setOriginalTweets(updateTweetInArray);
      setRetweets(updateTweetInArray);
      setCombinedTweets(updateTweetInArray);
    } catch (err) {
      console.error("Error al editar tweet:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    fetchAuthUser();
  }, [username]);

  if (!user || loading) {
    return <div className="loading-container"><p>Cargando perfil...</p></div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  // Determinar qué tweets mostrar según la pestaña activa
  const tweetsToShow = activeTab === "tweets" 
    ? combinedTweets 
    : activeTab === "retweets" 
      ? retweets 
      : originalTweets;

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
              <p>@{authUser.fullName}</p>
            </div>
          </div>

          <nav className="buttons-container">
            <button className="profile-button" onClick={() => navigate("/feed")}>
              Feed
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
        <p className="profile-bio">{user.bio || "Este usuario no tiene biografía"}</p>
        <p className="profile-followers">
          <strong>{followersCount}</strong> seguidores | <strong>{followingCount}</strong> siguiendo
        </p>

        {authUser?.id !== user.id ? (
          <button 
            className={`follow-button ${isFollowing ? "unfollow" : ""}`}
            onClick={handleFollow}
          >
            {isFollowing ? "Dejar de seguir" : "Seguir"}
          </button>
        ) : (
          <button 
            className="edit-button" 
            onClick={() => navigate(`/profile/${user.fullName}/edit`)}
          >
            Editar perfil
          </button>
        )}

        {/* Pestañas de navegación */}
        <div className="tabs-container">
          <button 
            className={`tab-button ${activeTab === "tweets" ? "active" : ""}`}
            onClick={() => setActiveTab("tweets")}
          >
            Tweets
          </button>
          <button 
            className={`tab-button ${activeTab === "retweets" ? "active" : ""}`}
            onClick={() => setActiveTab("retweets")}
          >
            Retweets
          </button>
          <button 
            className={`tab-button ${activeTab === "media" ? "active" : ""}`}
            onClick={() => setActiveTab("media")}
          >
            Media
          </button>
        </div>

        {/* Contenido de tweets/retweets */}
        <section className="profile-tweets-section">
          {tweetsToShow.length > 0 ? (
            tweetsToShow.map((tweet) => (
              <Tweet 
                key={tweet.id || tweet.tweetId}
                tweet={tweet.originalTweet || tweet} 
                currentUser={authUser} 
                onDelete={handleDeleteTweet}
                onEdit={handleEditTweet}
                isRetweet={!!tweet.originalTweet}
                retweetedBy={tweet.retweetedBy}
              />
            ))
          ) : (
            <p className="no-tweets-message">
              {activeTab === "tweets" 
                ? "No hay tweets para mostrar" 
                : activeTab === "retweets" 
                  ? "No hay retweets para mostrar" 
                  : "No hay media para mostrar"}
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;