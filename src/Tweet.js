import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Tweet.css";

const Tweet = ({ tweet, currentUser, onDelete, onEdit }) => {
  const navigate = useNavigate();

  // Estados del componente
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [retweets, setRetweets] = useState(0);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");

  // Normalización de datos del tweet
  const tweetData = tweet.tweet || tweet;
  const tweetOwner = tweetData.user || tweet.user;
  const tweetId = tweetData.twitt_id;

  // Verificar si el usuario actual es el dueño del tweet
  const isOwner = currentUser?.id && tweetOwner?.id === currentUser?.id;

  // Obtener likes del tweet
  const fetchLikes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3100/count/${tweetId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error obteniendo likes");

      const data = await response.text();
      setLikes(parseInt(data, 10) || 0);
    } catch (error) {
      console.error("Error obteniendo likes:", error);
    }
  };

  // Obtener comentarios del tweet
  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3100/publication/${tweetId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error obteniendo comentarios");

      const data = await response.json();
      const formattedComments = data.map(item => ({
        id: item.comment.comment_id,
        content: item.comment.content,
        createdAt: item.comment.createdAt,
        user: {
          id: item.user.id,
          fullName: item.user.fullName
        }
      }));
      setComments(formattedComments);
    } catch (error) {
      console.error("Error obteniendo comentarios:", error);
    }
  };

  // Obtener retweets del tweet
  const fetchRetweets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3100/countretweet/${tweetId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error obteniendo retweets");

      const data = await response.text();
      setRetweets(parseInt(data, 10) || 0);
    } catch (error) {
      console.error("Error obteniendo retweets:", error);
    }
  };

  // Agregar un nuevo comentario
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3100/createcomment/${tweetId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) throw new Error("Error al agregar comentario");

      setNewComment("");
      await fetchComments(); // Actualizar lista de comentarios
    } catch (error) {
      console.error("Error al agregar comentario:", error);
    }
  };

  // Eliminar un comentario
  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3100/deletecomment/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar comentario");

      await fetchComments(); // Actualizar lista de comentarios
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
    }
  };

  // Iniciar edición de comentario
  const startEditingComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditedCommentContent(comment.content);
  };

  // Cancelar edición de comentario
  const cancelEditingComment = () => {
    setEditingCommentId(null);
    setEditedCommentContent("");
  };

  // Guardar comentario editado
  const handleEditComment = async (commentId) => {
    if (!editedCommentContent.trim()) {
      alert("El comentario no puede estar vacío");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3100/updatecomment/${commentId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedCommentContent }),
      });

      if (!response.ok) throw new Error("Error al editar comentario");

      setEditingCommentId(null);
      setEditedCommentContent("");
      await fetchComments(); // Actualizar lista de comentarios
    } catch (error) {
      console.error("Error al editar comentario:", error);
    }
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    fetchLikes();
    fetchComments();
    fetchRetweets();
  }, [tweetId]);

  // Manejar edición de tweet
  const handleEdit = async () => {
    if (!editedContent.trim()) {
      alert("El tweet no puede estar vacío");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3100/updatetweet/${tweetId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });

      if (!response.ok) throw new Error("Error al editar tweet");

      // Llama a la función onEdit del componente padre para actualizar el estado
      onEdit(tweetId, editedContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Error al editar tweet:", error);
    }
  };

  // Manejar like/unlike
  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      if (isLiked) {
        await fetch(`http://localhost:3100/removelike/${tweetId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setIsLiked(false);
      } else {
        const response = await fetch(`http://localhost:3100/makelike/${tweetId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 400) {
          await fetch(`http://localhost:3100/removelike/${tweetId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          setIsLiked(false);
        } else if (response.ok) {
          setIsLiked(true);
        } else {
          throw new Error("Error al dar like");
        }
      }
      fetchLikes();
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  // Manejar retweet
  const handleRetweet = async () => {
    try {
      const token = localStorage.getItem("token");
      if (isRetweeted) {
        await fetch(`http://localhost:3100/removeretweet/${tweetId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setIsRetweeted(false);
      } else {
        await fetch(`http://localhost:3100/makeretweet/${tweetId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setIsRetweeted(true);
      }
      fetchRetweets();
    } catch (error) {
      console.error("Error al hacer retweet:", error);
    }
  };

  // Navegar al perfil del usuario
  const handleProfileClick = () => {
    if (tweetOwner?.fullName) {
      navigate(`/profile/${encodeURIComponent(tweetOwner.fullName)}`);
    }
  };

  // Iniciar edición (solo para dueños)
  const startEditing = () => {
    setEditedContent(tweetData.content);
    setIsEditing(true);
  };

  // Verificar si el usuario es dueño del comentario
  const isCommentOwner = (comment) => {
    return currentUser?.id && comment.user?.id === currentUser.id;
  };

  return (
    <div className="tweet">
      <div className="tweet-header">
        <span className="tweet-username" onClick={handleProfileClick}>
          @{tweetOwner.fullName}
        </span>
        <span className="tweet-date">
          {new Date(tweetData.createdAt).toLocaleDateString()}
        </span>
      </div>

      {isEditing ? (
        <div className="tweet-edit">
          <input 
            type="text" 
            value={editedContent} 
            onChange={(e) => setEditedContent(e.target.value)} 
            className="tweet-input"
            placeholder="Escribe tu tweet..."
            maxLength="280"
          />
          <div className="edit-buttons">
            <button onClick={handleEdit} className="save-button">Guardar</button>
            <button onClick={() => setIsEditing(false)} className="cancel-button">Cancelar</button>
          </div>
        </div>
      ) : (
        <p className="tweet-content">{tweetData.content}</p>
      )}

      <div className="tweet-actions">
        <button onClick={handleLike} className="tweet-action-button">
          {isLiked ? "💖" : "❤️"} {likes}
        </button>
        <button 
          onClick={() => setShowComments(!showComments)} 
          className="tweet-action-button"
        >
          💬 ({comments.length})
        </button>
        <button onClick={handleRetweet} className="tweet-action-button">
          {isRetweeted ? "🔁" : "↩️"} {retweets}
        </button>
        {isOwner && (
          <>
            <button onClick={startEditing} className="tweet-action-button">
              ✏️
            </button>
            <button 
              onClick={() => onDelete(tweetId)} 
              className="tweet-action-button delete-button"
            >
              🗑️
            </button>
          </>
        )}
      </div>

      {showComments && (
        <div className="tweet-comments">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              {editingCommentId === comment.id ? (
                <div className="comment-edit-container">
                  <input
                    type="text"
                    value={editedCommentContent}
                    onChange={(e) => setEditedCommentContent(e.target.value)}
                    className="comment-edit-input"
                    maxLength="280"
                  />
                  <div className="comment-edit-actions">
                    <button 
                      onClick={() => handleEditComment(comment.id)}
                      className="comment-save"
                    >
                      Guardar
                    </button>
                    <button 
                      onClick={cancelEditingComment}
                      className="comment-cancel"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="comment-content">
                    <strong>@{comment.user.fullName}</strong>: {comment.content}
                  </div>
                  {isCommentOwner(comment) && (
                    <div className="comment-actions">
                      <button 
                        onClick={() => startEditingComment(comment)}
                        className="comment-edit"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="comment-delete"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
           <div className="add-comment">
            <input 
              type="text" 
              value={newComment} 
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..." 
              className="comment-input"
              maxLength="280"
            />
            <button onClick={handleAddComment} className="comment-button">
              Comentar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tweet;