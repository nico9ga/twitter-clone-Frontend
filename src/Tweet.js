import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Tweet.css";

const Tweet = ({ tweet, currentUser, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const isOwner = currentUser.id && tweet.user.id === currentUser.id;

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(tweet.content);
  const [showComments, setShowComments] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchLikes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/likes/${tweet.twitt_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error obteniendo likes");

      const data = await response.json();
      setLikes(data.likes ?? 0);
      setLiked(data.likedByCurrentUser ?? false);
    } catch (error) {
      console.error("Error obteniendo likes:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/commentaries?limit=1000&offset=0");
      if (!response.ok) throw new Error("Error obteniendo comentarios");

      const data = await response.json();
      const filteredComments = data.filter(comment => comment.twitt.twitt_id === tweet.twitt_id);
      setComments(filteredComments);
    } catch (error) {
      console.error("Error obteniendo comentarios:", error);
    }
  };

  useEffect(() => {
    fetchLikes();
    fetchComments();
  }, [tweet.twitt_id]);

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/twitts/${tweet.twitt_id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });

      if (!response.ok) throw new Error("Error al editar tweet");

      onEdit(tweet.twitt_id, editedContent);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/likes/${tweet.twitt_id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error al dar like");

      fetchLikes();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/commentaries/${tweet.twitt_id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment, idTwitt: tweet.twitt_id }),
      });

      if (!response.ok) throw new Error("Error al agregar comentario");

      const newCommentData = await response.json();
      setComments([...comments, newCommentData]);
      setNewComment("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="tweet">
      <div className="tweet-header">
        <span className="tweet-username" onClick={() => navigate(`/profile/${tweet.user.fullName}`)}>
          @{tweet.user.fullName}
        </span>
        <span className="tweet-date">{new Date(tweet.createdAt).toLocaleDateString()}</span>
      </div>

      {isEditing ? (
        <div className="tweet-edit">
          <input type="text" value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
          <button onClick={handleEdit}>Guardar</button>
          <button onClick={() => setIsEditing(false)}>Cancelar</button>
        </div>
      ) : (
        <p className="tweet-content">{tweet.content}</p>
      )}

      <div className="tweet-actions">
        <button onClick={handleLike}>{liked ? "💖" : "❤️"} {likes}</button>
        <button onClick={() => setShowComments(!showComments)}>💬 ({comments.length})</button>
        {isOwner && <button onClick={() => setIsEditing(true)}>✏️</button>}
        {isOwner && <button onClick={() => onDelete(tweet.twitt_id)}>🗑️</button>}
      </div>

      {showComments && (
        <div className="tweet-comments">
          <h4>Comentarios</h4>
          {comments.map((comment) => (
            <div key={comment.comment_id} className="comment">
              <strong>{comment.user.fullName}</strong>
              <p className="comment-text">{comment.content}</p>
            </div>
          ))}

          <div className="add-comment">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Añadir un comentario..."
            />
            <button onClick={handleAddComment}>Comentar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tweet;
