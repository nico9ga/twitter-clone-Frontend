import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tweet from "./Tweet";
import "./MainPage.css";

const MainPage = () => {
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState("");
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/"); // Redirigir a login si no hay token
      return;
    }

    const fetchUserAndTweets = async () => {
      try {
        const response = await fetch("http://localhost:3100/checkstatus", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener usuario");
        }

        const userData = await response.json();
        console.log("Datos del usuario:", userData);
        setUser(userData);

        // Obtener los primeros tweets
        fetchMoreTweets(0, true);
      } catch (error) {
        console.error("Error en fetchUserAndTweets:", error);
      }
    };

    fetchUserAndTweets();
  }, [navigate]);

  const fetchMoreTweets = async (currentOffset, reset = false) => {
    try {
      const response = await fetch(`http://localhost:3100/?limit=10&offset=${currentOffset}`);
      if (!response.ok) throw new Error("Error al obtener tweets");
      const tweetsData = await response.json();

      setTweets((prevTweets) => reset ? tweetsData : [...prevTweets, ...tweetsData]);
      setOffset(currentOffset + 10);
    } catch (error) {
      console.error("Error al cargar más tweets:", error);
    }
  };

  const handleTweetSubmit = async (e) => {
    e.preventDefault();
    if (!newTweet.trim()) return;
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3100/createtweet", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newTweet }),
      });
  
      if (!response.ok) throw new Error("Error al crear tweet");
  
      const createdTweet = await response.json();
      console.log("Tweet creado:", createdTweet);
  
      // Normaliza el nuevo tweet con la estructura esperada en el estado
      const newTweetData = {
        tweet: {
          twitt_id: createdTweet.twitt_id,
          content: createdTweet.content,
          createdAt: createdTweet.createdAt,
          isEdited: createdTweet.isEdited,
        },
        user: {
          fullName: user.fullName, 
        },
      };
  
      setTweets((prevTweets) => [newTweetData, ...prevTweets]);
      setNewTweet(""); // Limpia el campo de texto
    } catch (error) {
      console.error("Error al enviar el tweet:", error);
    }
  };
  
  

  const handleDeleteTweet = async (tweetId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3100/deletetweet/${tweetId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar tweet");
      setTweets((prevTweets) => prevTweets.filter((tweet) => tweet.twitt_id !== tweetId));
    } catch (error) {
      console.error(error);
    }
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
              <div className="profile-picture-placeholder"></div> {/* Círculo gris */}
              <div className="user-details">
                <h3>{user.fullName}</h3>
                <p>@{user.username}</p>
              </div>
              <button className="profile-button" onClick={() => navigate(`/profile/${user.fullName}`)}>
                Perfil
              </button>
              <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
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
          <button className="twittear small" type="submit">Twittear</button>
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

        <button className="load-more-button" onClick={() => fetchMoreTweets(offset)}>
          Cargar 10 tweets más
        </button>
      </div>
    </div>
  );
};

export default MainPage;
