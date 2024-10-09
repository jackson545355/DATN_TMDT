import React, { useState, useEffect } from 'react';
import axios from 'axios';
import defaultprofile from '../../../Assets/profile.png';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import './ContentReviewer.css';

const Comment = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(0);
  const [avatar, setAvatar] = useState(defaultprofile);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/products/${productId}/comments`);
        const commentsData = response.data.comments;
        
        // Lấy danh sách các userId duy nhất từ các comment
        const userNames = [...new Set(commentsData.map(comment => comment.user?.username))].filter(Boolean);
        console.log(userNames);
        if (userNames.length > 0) {
          // Chuyển userNames thành một chuỗi query để gửi với GET request
          const userNamesQuery = userNames.map(name => `userNames[]=${name}`).join('&');
        
          // Gọi API để lấy thông tin avatar cho tất cả các user
          const userAvatars = await axios.get(`http://localhost:3000/auth/users/avatars?${userNamesQuery}`);
          
          // Tạo một map để ánh xạ username với avatar
          const avatarMap = userAvatars.data.reduce((acc, user) => {
            acc[user.username] = user.profileImage || defaultprofile;
            return acc;
          }, {});
        
          // Ánh xạ avatar vào các comment
          const commentsWithAvatars = commentsData.map(comment => ({
            ...comment,
            user: {
              ...comment.user,
              profileImage: avatarMap[comment.user?.username] || defaultprofile,
            },
          }));

          setComments(commentsWithAvatars);
        } else {
          // Nếu không có userId nào thì sử dụng dữ liệu comments ban đầu
          setComments(commentsData);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchComments();
  }, [productId]);
  
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {  
      axios.get('http://localhost:3000/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          if (response.data.success) {
            setUser(response.data.user);
            setAvatar(response.data.user.profileImage || defaultprofile);
          } else {
            console.error('Failed to fetch user profile.');
          }
        })
        .catch(error => console.error('Error:', error));
    }
  }, []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('auth-token');
    if (!token) {
      alert("Bạn cần đăng nhập");
      return;
    }

    
    try {
        const response = await axios.post(`http://localhost:3002/products/${productId}/comments`, {
            comment: commentText,
            rating,
        },{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      setComments([...comments, response.data.comment]);
      setCommentText('');
      setRating(0);
      // setHoverRating(0);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="comment-section">
      <h3>Các đánh giá</h3>
      <div className="comment-box">
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <div className="comment-header">
              <img src={comment.user?.profileImage} alt="avatar" className="avatar" />
              {console.log(comment.user?.profileImage)}
              <div className="comment-user-info">
                <span className="comment-user">{comment.user?.username}</span>
                <span className="comment-date">{new Date(comment.date).toLocaleString()}</span>
              </div>
              <Stack className="comment-rating" spacing={1}>
                <Rating name="half-rating-read" value={comment.rating} precision={0.5} readOnly />
              </Stack>
            </div>
            <div className="comment-body">
              <p>{comment.comment}</p>
            </div>
          </div>
        ))}
      </div>
    
    </div>
  );
};

export default Comment;
