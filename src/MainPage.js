import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tweet from "./Tweet";
import "./MainPage.css";

const MainPage = () => {
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState("");
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/"); // Redirigir a login si no hay token
      return;
    }

    const fetchUserAndTweets = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/auth/check-status",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener usuario");
        }

        const userData = await response.json();
        console.log("Datos del usuario:", userData);
        setUser(userData);

        const tweetResponse = await fetch(
          `http://localhost:3001/api/twitts?limit=${limit}&offset=0`
        );
        if (!tweetResponse.ok) throw new Error("Error al obtener tweets");
        const tweetsData = await tweetResponse.json();
        setTweets(tweetsData);
      } catch (error) {
        console.error("Error en fetchUserAndTweets:", error);
      }
    };

    fetchUserAndTweets();
  }, [navigate]); //

  const fetchTweets = async (newLimit) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/twitts?limit=${newLimit}&offset=0`
      );
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
          Authorization: `Bearer ${token}`,
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
    }
  };

  const handleLoadMore = () => {
    const newLimit = limit + 10;
    setLimit(newLimit);
    fetchTweets(newLimit);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="main-container">
      <div className="left-sidebar">
        {user && (
          <>
            <div className="user-container">
              <div className="reload-circle" onClick={() => navigate("/")} />
              <div className="profile-picture-placeholder"></div>{" "}
              {/* Círculo gris */}
              <div className="user-details">
                <h3>{user.fullName}</h3>
                <p>@{user.username}</p>
              </div>
              <button
                className="profile-button"
                onClick={() => navigate(`/profile/${user.fullName}`)}
              >
                Perfil
              </button>
              <button className="logout-button" onClick={handleLogout}>
                Cerrar sesión
              </button>
              <button className="load-more-button" onClick={handleLoadMore}>
                Cargar más tweets
              </button>
            </div>
          </>
        )}
      </div>

      {/* Feed principal */}
      <div className="feed">
        <h2>Inicio</h2>

        {/* Formulario para twittear */}
        <form className="new-tweet-form" onSubmit={handleTweetSubmit}>
          <input
            className="textTwittear"
            type="text"
            value={newTweet}
            onChange={(e) => setNewTweet(e.target.value)}
            placeholder="¿Qué está pasando?"
            required
          />
          <button className="twittear small" type="submit">
            Twittear
          </button>
        </form>

        <div className="feed-tweets">
          {tweets.map((tweet) => (
            <Tweet
              key={tweet.twitt_id}
              tweet={tweet}
              currentUser={user?.fullName}
              onDelete={handleDeleteTweet}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
