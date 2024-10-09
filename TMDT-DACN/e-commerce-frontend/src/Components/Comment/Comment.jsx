// src/Components/Comment/Comment.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import defaultprofile from '../Assets/profile.png';
import './Comment.css';

const Comment = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/products/${productId}/comments`);
        setComments(response.data.comments);
        console.log("commentss", response.data.comments)
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    const fetchUser = async () => {
      const token = localStorage.getItem('auth-token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:3000/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log("user", response.data.user)
          setUser(response.data.user);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchComments();
    fetchUser();
  }, [productId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('auth-token');
    if (!token) {
      alert("Bạn cần đăng nhập");
      return;
    }

    
    try {
        const response = await axios.post(`http://localhost:3002/products/${productId}/comments`, {
            // username: user.username,
            // image: user.profileImage,
            comment: commentText,
            rating,
        },{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setComments([...comments, response.data.comment]);
      setCommentText('');
      setRating(response.data.rating);
      setHoverRating(0);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      <div className="comment-box">
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <div className="comment-header">
              <img src={comment.user.profileImage || defaultprofile} alt="avatar" className="avatar" />
              <div className="comment-user-info">
                <span className="comment-user">{comment.user.username}</span>
                <span className="comment-date">{new Date(comment.date).toLocaleString()}</span>
              </div>
              <div className="comment-rating">
                {'⭐'.repeat(comment.rating)}
              </div>
            </div>
            <div className="comment-body">
              <p>{comment.comment}</p>
              {console.log("comment", comment)}
            </div>
            {comment.image && comment.image.length > 0 && (
              <div className="comment-images">
                {comment.image.map((image, imgIndex) => (
                  <img key={imgIndex} src={image} alt={`comment-img-${imgIndex}`} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {user && (
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <div className="comment-user-info-form">
            <img src={user.profileImage || defaultprofile} alt="avatar" className="avatar" />
            <span className="comment-user">{user.username}</span>
          </div>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((value) => (
              <span
                key={value}
                className={`star ${hoverRating >= value ? 'hover' : ''} ${rating >= value ? 'selected' : ''}`}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(value)}
              >
                ⭐
              </span>
            ))}
          </div>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment here..."
            required
            className="comment-textarea"
          />
          <button type="submit" className="comment-button">Submit</button>
        </form>
       )}
    </div>
  );
};

export default Comment;
