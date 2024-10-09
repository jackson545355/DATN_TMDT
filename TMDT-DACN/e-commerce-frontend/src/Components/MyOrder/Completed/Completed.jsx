import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Completed.css';
import defaultprofile from '../../Assets/profile.png';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

const Completed = ({ orders }) => {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(0);
  const [user, setUser] = useState(null);
  const [reviewedProducts, setReviewedProducts] = useState(new Set());
  const handleOpen = (productId) => {
    setSelectedProduct(productId);
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setCommentText('');
    setRating(0);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('auth-token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:3000/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setUser(response.data.user);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUser();
  }, []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('auth-token');
    if (!token) {
      alert("Bạn cần đăng nhập");
      return;
    }

    try {
      await axios.post(`http://localhost:3002/products/${selectedProduct}/comments`, {
        comment: commentText,
        rating,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // setReviewedProducts(prev => new Set(prev).add(selectedProduct));
      setReviewedProducts(prev => new Set([...prev, selectedProduct]));
      setCommentText('');
      setRating(0);
      alert("Đánh giá của bạn đã được gửi!");
      handleClose();
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="order-list">
      {orders.map(order => (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <div className="order-seller">
              <span>Your order to {order.address}</span>
            </div>
          </div>
          <div className="completed-order-body">
            {order.products.map(product => (
              <div key={product._id} className="product-info">
                <img src={product.details.images[0]} alt="" className="order-image" />
                <div className="order-details">
                  <a className="order-title" href={`/product/${product.details._id}`}>{product.details.name_product}</a>
                  <div className="order-quantity">x{product.stock}</div>
                  <div className="order-color">Màu: {product.colors}</div>
                  {!reviewedProducts.has(product.product) && (
                    <button className="btn btn-review" onClick={() => handleOpen(product.product)}>Review</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="order-status">
            <div className={`status-text ${order.status.toLowerCase()}`}>{order.status}</div>
          </div>
          <div className="order-footer">
            <div className="ship-date">
              {order.shipDate && <>Products will be shipped out by <span>{order.shipDate}</span></>}
            </div>
            <div className="order-total">
              <span>Order Total: </span>
              <span className="total-price">{order.total.toLocaleString()}₫</span>
            </div>
          </div>
        </div>
      ))}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box className="modal-box">
        <div className="comment-section">
            <h3>Write a Review</h3>
            {user && (
              <form onSubmit={handleCommentSubmit} className="comment-form">
                <div className="comment-user-info-form">
                  <img src={user.profileImage || defaultprofile} alt="avatar" className="avatar" />
                  <span className="comment-user">{user.username}</span>
                </div>
                <Stack className="rating-input" spacing={1}>
                  <Rating 
                    name="rating" 
                    value={rating} 
                    precision={1} 
                    onChange={(event, newValue) => setRating(newValue)}
                  />
                </Stack>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write your review here..."
                  required
                  className="comment-textarea"
                />
                <button type="submit" className="comment-button">Submit</button>
              </form>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Completed;
