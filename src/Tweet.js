import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Tweet.css";

const Tweet = ({ tweet, currentUser, onDelete, onEdit, setTweets }) => {
  const navigate = useNavigate();
  const isOwner = currentUser?.id === tweet?.user?.id;

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(tweet.content);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    setLikes(10); // Simulación de API
    setLiked(true);
    setComments([
      { comment_id: 1, user: { fullName: "Juan Pérez" }, content: "Buen tweet!" },
      { comment_id: 2, user: { fullName: "María López" }, content: "Totalmente de acuerdo" },
    ]);
  }, [tweet.twitt_id]);

  const handleEdit = () => {
    onEdit(tweet.twitt_id, editedContent);
    setIsEditing(false);
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([...comments, { comment_id: Date.now(), user: { fullName: "Usuario Actual" }, content: newComment }]);
    setNewComment("");
  };

  const handleRetweet = () => {
    console.log("boton retweet persionado")
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
        <input
          type="text"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="tweet-input"
          placeholder="Escribe tu tweet..."
        />
        <div className="edit-buttons">
          <button onClick={handleEdit} className="save-button">
            Guardar
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="cancel-button"
          >
            Cancelar
          </button>
        </div>
      </div>
      ) : (
        <div className="tweet-content">
          {tweet.originalTwitt && (
            <div className="retweet-info">
              <p>🔄 Retweet de {tweet.originalTwitt.user.fullName}</p>
              <p>{tweet.originalTwitt.content}</p>
            </div>
          )}
          <p>{tweet.content}</p>
        </div>
      )}

      <div className="tweet-actions">
        <button onClick={handleLike}>{liked ? "💖" : "❤️"} {likes}</button>
        <button onClick={() => setShowComments(!showComments)}>💬 ({comments.length})</button>
        { <button onClick={handleRetweet}>🔄</button>}
        {isOwner && <button onClick={() => setIsEditing(true)}>✏️</button>}
        {isOwner && <button onClick={() => onDelete(tweet.twitt_id)}>🗑️</button>}
      </div>

      {showComments && (
        <div className="tweet-comments">
          {comments.map((comment) => (
            <div key={comment.comment_id} className="comment">
              <span className="comment-username" onClick={() => navigate(`/profile/${comment.user.fullName}`)}>
                @{comment.user.fullName}
              </span>
              <p>{comment.content}</p>
            </div>
          ))}
          <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Añadir un comentario..." />
          <button onClick={handleAddComment}>Comentar</button>
        </div>
      )}
    </div>
  );
};

export default Tweet;
