import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "./ProductDisplay.css";
import { ShopContext } from "../../Context/ShopContext";
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

const ProductDisplay = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { addToCart } = useContext(ShopContext);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedStock, setSelectedStock] = useState(0);
  // const [averageRating, setAverageRating] = useState(0);
  const navigate = useNavigate();

  const handleColorChange = (event) => {
    const selected = event.target.value;
    setSelectedColor(selected);
    const colorStock = product.colors.find(color => color.color === selected)?.stock || 0;
    setSelectedStock(colorStock);
  };

  useEffect(() => {
    fetch(`http://localhost:3002/products/get-one-by-id/${productId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setProduct(data.product);
          setMainImage(data.product.images[0]);
          if (data.product.colors.length > 0) {
            setSelectedColor(data.product.colors[0].color);
            setSelectedStock(data.product.colors[0].stock);
          }
        } else {
          console.error("Failed to fetch product details");
        }
      })
      .catch((error) =>
        console.error("Error fetching product details:", error)
      );
  }, [productId]);

  const handleHover = (imageSrc) => {
    setMainImage(imageSrc);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleAddToCart = () => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      alert("Bạn cần đăng nhập");
      navigate('/login');
      return;
    }

    if (selectedStock <= 0) {
      return;
    }

    // Gọi hàm addToCart từ ShopContext
    addToCart(product._id, 1, selectedColor); // 1 là số lượng sản phẩm thêm vào giỏ hàng
    setSelectedStock(prev => prev - 1); // Giảm số lượng stock
  };

  const averageRating = product && product.comments.length > 0 ? product.comments.reduce((acc, curr) => acc + curr.rating, 0) / product.comments.length : 0;

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ContentMain">
      <div className="ContentMainLeft">
        <div className="ImageMain">
          <img src={mainImage} alt={product.name_product} />
        </div>
        <div className="Image">
          {product.images.slice(0, 5).map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`img-${index}`}
              onMouseOver={() => handleHover(img)}
            />
          ))}
          <button className="view-3d-button" onClick={openModal}>
            Xem 3D
          </button>
        </div>
      </div>
      <div className="ContentMainMid">
        <div className="product-status"> &#10003; Còn hàng</div>
        <div className="product-title">{product.name_product}</div>
        <div className="product-rating">
          <Stack className="star" spacing={1}>
            <Rating name="half-rating-read" value={averageRating} precision={0.5} readOnly />              
          </Stack>
          <span className="rating-score">{averageRating.toFixed(1)}</span>
          <span className="reviews">&#128221; {product.comments.length} Đánh giá</span>
          <span className="sold">&#128176; {product.numberSold} Đã bán</span>
        </div>
        <div className="product-details">
          <div className="product-details-top">
            <div className="product-details-top-left">Giá: </div>
            <div className="product-details-top-right">
              {product.price_product}₫
            </div>
          </div>
          <div className="info-divider"></div>
          <div className="product-details-top">
            <div className="product-details-top-left">Màu: </div>
            <select
              value={selectedColor}
              onChange={handleColorChange}
              className="SelectColor"
            >
              {product.colors
                .filter(color => color.stock >= 0)
                .map((color, index) => (
                  <option key={index} value={color.color}>
                    {color.color}
                  </option>
                ))}
            </select>
          </div>
          <button
            className={`add-to-cart-btn ${selectedStock <= 0 ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={selectedStock <= 0}
          >
            THÊM VÀO GIỎ HÀNG
          </button>
          <span className="stock"> {selectedStock} cái có sẵn</span>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="3D Model Viewer"
        className="Modal"
        overlayClassName="Overlay"
      >
        <button onClick={closeModal}>Đóng</button>
        <iframe
          src={product.model3D}
          width="100%"
          height="600"
          frameBorder="0"
          allowFullScreen
          title="3D Model Viewer"
        ></iframe>
      </Modal>
    </div>
  );
};

export default ProductDisplay;