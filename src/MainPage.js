import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tweet from "./Tweet";
import "./MainPage.css";

const MainPage = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState("");
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:3001/api/auth/check-status", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }
  
        const data = await response.json();
        setUser(data);
        fetchTweets(limit); // Usa limit aquí
      } catch (error) {
        console.error("Error al obtener usuario:", error);
        navigate("/");
      }
    };
  
    fetchUser();
  }, [navigate, limit]);

  const fetchTweets = async (newLimit) => {
    try {
      const response = await fetch(`http://localhost:3001/api/twitts?limit=${newLimit}&offset=0`);
      if (!response.ok) throw new Error("Error al obtener tweets");
      const data = await response.json();
      setTweets(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTweetSubmit = async (e) => {
    e.preventDefault();
    if (!newTweet.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/twitts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newTweet }),
      });

      if (!response.ok) throw new Error("Error al crear tweet");
      const createdTweet = await response.json();

      setTweets([createdTweet, ...tweets]);
      setNewTweet("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/twitts/${tweetId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar tweet");
      setTweets(tweets.filter((tweet) => tweet.twitt_id !== tweetId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoadMore = () => {
    const newLimit = limit + 10;
    setLimit(newLimit);
    fetchTweets(newLimit);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="main-container">
      <button className="menu-button" onClick={toggleSidebar}>☰</button>

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Perfil</h2>
        </div>

        {user ? (
          <button 
            className="profile-button"
            onClick={() => navigate(`/profile/${user.fullName}`)}
          >
            {user.fullName}
          </button>
        ) : (
          <p>Cargando...</p>
        )}

        <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
      </div>

      <div className="feed">
        <h2>Inicio</h2>

        <form className="new-tweet-form" onSubmit={handleTweetSubmit}>
          <input className="textTwittear"
            type="text"
            value={newTweet}
            onChange={(e) => setNewTweet(e.target.value)}
            placeholder="¿Qué está pasando?"
            required
          />
          <button className="twittear" type="submit">Twittear</button>
        </form>

        <div className="feed-tweets">
          {tweets.map((tweet) => (
            <Tweet 
              key={tweet.twitt_id} 
              tweet={tweet} 
              currentUser={tweet.user.fullName} 
              onDelete={handleDeleteTweet} 
            />
          ))}
        </div>

        <button className="load-more-button" onClick={handleLoadMore}>Cargar más tweets</button>
      </div>
    </div>
  );
};

export default MainPage;
