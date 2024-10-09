import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';

const CartItems = () => {
  const [cart, setCart] = useState(null);
  const [couponCode, setCouponCode] = useState(''); // Thêm state cho mã coupon
  const [discount, setDiscount] = useState(0); // Thêm state cho giá trị giảm giá
  const token = localStorage.getItem('auth-token');
  const { fetchCart, getTotalCartItems, clearCart  } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartData = async () => {
      if (!token) {
        console.error('No auth token found');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/carts/get-one-by-user-id', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCart(response.data);
      } catch (error) {
        console.error('Error fetching the cart data', error);
      }
    };

    fetchCartData();
  }, [token]);

  const handleQuantityChange = async (productId, color, change) => {
    try {
      const product = cart.products.find(p => p.id_product === productId && p.color === color);
      const currentQuantity = product.quantity;
      const stockResponse = await axios.get(`http://localhost:3000/products/get-one-by-id/${productId}`);
      const productData = stockResponse.data.product;
      const colorStock = productData.colors.find(colorItem => colorItem.color === color)?.stock || 0;

      if (currentQuantity + change > colorStock) {
        window.alert(`Cannot add more than ${colorStock} items for color ${color}`);
        return;
      }

      const response = await axios.patch('http://localhost:3000/carts/update-products', {
        id_product: productId,
        color: color,
        quantity: change
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCart(response.data);
    } catch (error) {
      console.error('Error updating product quantity:', error);
      window.alert('An error occurred while updating the product quantity.');
    }
  };

  const handleRemoveProduct = async (productId, color) => {
    try {
      const response = await axios.delete('http://localhost:3000/carts/remove-products', {
        data: { id_product: productId, color: color },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCart(response.data);
      await fetchCart();
      getTotalCartItems();
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  const handleRemoveAllProducts = async () => {
    try {
      // const productKeys = cart.products.map(product => `${product.id_product}-${product.color}`);
      const productKeys = cart.products.map(product => ({ id_product: product.id_product, color: product.color }));
      for (const product of productKeys) {
        await axios.delete('http://localhost:3000/carts/remove-products', {
          // data: { id_products: productKeys.map(key => key.split('-')[0]), colors: productKeys.map(key => key.split('-')[1]) },
          // data: { id_products: productKeys.map(p => p.id_product), colors: productKeys.map(p => p.color) },
          data: { id_product: product.id_product, color: product.color },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      // setCart(response.data);
      setCart({ ...cart, products: [] });
      // await clearCart();
      await fetchCart();
      getTotalCartItems();
    } catch (error) {
      console.error('Error removing all products:', error);
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'test20') {
      setDiscount(0.2); // Đặt giá trị giảm giá là 20%
      alert('Coupon applied! You get 20% off.');
    } else {
      setDiscount(0); // Không có giảm giá nếu mã coupon không đúng
      alert('Invalid coupon code.');
    }
  };

  const subtotal = cart?.products?.reduce((total, product) => total + product.price_product * product.quantity, 0) || 0;
  const total = subtotal * (1 - discount); // Tính tổng giá trị sau khi áp dụng giảm giá
  
  if (!cart) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="MyCart">
        <div className="MyCartCount"><h2>Giỏ hàng</h2></div>
        <div className="MyCartContent">
          <div className="MyCartContentLeft">
            {cart.products.map((product) => (
              <div key={`${product.id_product}-${product.color}`}>
                <div className="cart-item">
                  <img
                    src={product.images && product.images.length > 0 ? product.images[0] : 'default-image-url'}
                    alt={product.name_product}
                    className="product-image"
                  />
                  <div className="product-details">
                    <a href={`/product/${product.id_product}`}>{product.name_product}</a>
                    <h3> Màu: {product.color}</h3>
                    <button className="remove-button" onClick={() => handleRemoveProduct(product.id_product, product.color)}>Xóa</button>
                  </div>
                  <div className="product-price">
                    <p>{product.price_product}₫</p>
                    <div className="quantity-control">
                      <button
                        className="quantity-button"
                        onClick={() => handleQuantityChange(product.id_product, product.color, -1)}
                        disabled={product.quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="quantity-input"
                        value={product.quantity}
                        readOnly
                      />
                      <button
                        className="quantity-button"
                        onClick={() => handleQuantityChange(product.id_product, product.color, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="info-divider"></div>
              </div>
            ))}
            <div className="cart-actions">
              <a className="button-back" href='/'>Quay về shop</a>
              <button className="button-remove-all" onClick={handleRemoveAllProducts}>Xóa tất cả</button>
            </div>
          </div>
          <div className="MyCartContentRight">
            <div className="coupon-block">
              <p className="coupon-text">Nhập mã giảm</p>
              <div className="coupon-input-container">
                <input
                  type="text"
                  className="coupon-input"
                  placeholder="Thêm mã"
                  value={couponCode} // Liên kết mã coupon với state
                  onChange={(e) => setCouponCode(e.target.value)} // Cập nhật state khi thay đổi
                />
                <button
                  className="coupon-apply-button"
                  onClick={handleApplyCoupon} // Gọi hàm áp dụng mã coupon
                >
                  Áp dụng
                </button>
              </div>
            </div>
            <div className="checkout-summary">
              <div className="summary-item">
                <span>Giá ban đầu:</span>
                {/* <span>${cart.products.reduce((total, product) => total + product.price_product * product.quantity, 0)}</span> */}
                <span>{subtotal.toFixed(2)}₫</span>
              </div>
              <div className="summary-item">
                <span>Giảm:</span>
                <span className="discount">{(subtotal * discount).toFixed(2)}₫</span>
              </div>
              <div className="summary-total">
                <span>Tổng cộng:</span>
                <span className="total-price">{total.toFixed(2)}₫</span>
              </div>
              <div className="info-divider-check"></div>
              <button className="checkout-button" onClick={() => navigate('/checkout', { state: { total,discount } })}>Thanh toán</button>
              <div className="payment-options"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
