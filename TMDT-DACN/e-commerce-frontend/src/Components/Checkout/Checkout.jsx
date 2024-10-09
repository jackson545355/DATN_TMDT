import React, { useState, useEffect, useContext } from 'react';
import './Checkout.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import momo from '../Assets/momo.png';
import cod from '../Assets/cod.png';
import { ShopContext } from '../../Context/ShopContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { fetchCart, getTotalCartItems, clearCart } = useContext(ShopContext);
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const location = useLocation(); // Lấy location từ React Router
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCartData = async () => {
      const token = localStorage.getItem('auth-token'); // Lấy token từ localStorage
      try {
        const response = await axios.get('http://localhost:3005/carts/get-one-by-user-id/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const cartData = response.data;
        setCart(response.data);

        // console.log('Cart data:', response.data);
        // const calculatedSubtotal = cartData.products.reduce((acc, product) => acc + (product.price_product * product.quantity), 0);
        // const calculatedDiscount =  location.state?.discount || 0;; // Ví dụ giảm giá 10% nếu tổng giá trị trên 1,000,000₫
        // const calculatedTotal = calculatedSubtotal - calculatedDiscount;
        // setSubtotal(calculatedSubtotal);
        // setDiscount(calculatedDiscount);
        // setTotal(calculatedTotal);
        // Lấy giá trị discount từ location state, nếu không có thì mặc định là 0

        const calculatedSubtotal = cartData.products.reduce(
          (acc, product) => acc + (product.price_product * product.quantity), 0
        );
        const appliedDiscount = location.state?.discount * calculatedSubtotal  || 0;
        setDiscount(appliedDiscount);

        const calculatedTotal = calculatedSubtotal - appliedDiscount;

        setSubtotal(calculatedSubtotal);
        setTotal(calculatedTotal);

      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    fetchCartData();
  }, []);

  const handleOrderSubmit = async () => {
    const token = localStorage.getItem('auth-token'); // Lấy token từ localStorage
    const orderData = {
      products: cart.products.map(product => ({
        product: product.id_product,
        stock: product.quantity,
        colors: product.color
      })),
      address: address,
      phone: phone,
      subtotal: subtotal,
      discount: discount,
      total: total
    };

    if (!address || !phone) {
      window.alert('Vui lòng nhập địa chỉ và số điện thoại');
      return;
    }

    try {
      const orderResponse = await axios.post('http://localhost:3003/orders/createOrder', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Order response:', orderResponse.data);
      if (orderResponse.data.success) {
        // Xóa các sản phẩm trong giỏ hàng sau khi tạo đơn hàng thành công
        const productKeys = cart.products.map(product => ({ id_product: product.id_product, color: product.color }));
        for (const product of productKeys) {
          await axios.delete('http://localhost:3000/carts/remove-products', {
            data: { id_product: product.id_product, color: product.color },
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        }
        setCart({ ...cart, products: [] });
        await clearCart();
        await fetchCart();
        getTotalCartItems();
        console.log('Order created successfully, orderId:', orderResponse.data.order.id);
        return orderResponse.data.order.id;
      } else {
        window.alert('Failed to create order');
        return null;
      }
    } catch (error) {
      console.error('Error creating order or processing payment:', error);
      window.alert('Error creating order');
      return null;
    }
  };

  const handleCODSubmit = async (event) => {
    event.preventDefault();
    const orderId = await handleOrderSubmit();
    if (orderId) {
      navigate('/'); // Chuyển hướng đến trang chủ hoặc profile sau khi hoàn thành đơn hàng COD
    }
  };

  const handleMOMOSubmit = async (event) => {
    event.preventDefault();
    const orderId = await handleOrderSubmit();
    // console.log('handleMOMOSubmit: orderId:', orderId); 
    if (orderId) {
      // Tính tổng số tiền từ giỏ hàng
      // const totalAmount = cart?.products?.reduce((total, product) => total + (product.price_product * product.quantity), 0);
      // console.log('handleMOMOSubmit: totalAmount:', totalAmount);
      // Gọi API server để lấy URL thanh toán MoMo
      try {
        const token = localStorage.getItem('auth-token'); // Lấy token từ localStorage
        const response = await axios.post('http://localhost:3003/orders/momo', {
          orderId: orderId,
          amount: total,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // console.log ('MoMo payUrl:', response.data.payUrl);

        // Kiểm tra phản hồi và chuyển hướng tới URL thanh toán
        if (response.data && response.data.payUrl) {
          window.location.href = response.data.payUrl; // Chuyển hướng tới trang thanh toán MoMo
        } else {
          console.error('Failed to get MoMo payment URL:', response.data);
          window.alert('Failed to get MoMo payment URL');
        }
      } catch (error) {
        console.error('Error processing MoMo payment:', error);
        window.alert('Error processing MoMo payment');
      }
    }
  };




  return (
    <div className="row1">
      <div className="col-75">
        <div className="container">
          <h4>Giỏ hàng <span className="price" style={{ color: 'black' }}><i className="fa fa-shopping-cart"></i> <b>{cart?.products?.length || 0}</b></span></h4>
          {cart?.products?.map((product, index) => (
            <React.Fragment key={index}>
              <div className="cart-item">
                <img
                  src={product.images && product.images.length > 0 ? product.images[0] : 'default-image-url'}
                  alt={product.name_product}
                  className="product-image"
                />
                <div className="product-details">
                  <a href={`/product/${product.id_product}`}>{product.name_product}</a>
                  <p>Màu: {product.color}</p>
                  <p>Số lượng: {product.quantity}</p>
                </div>
                <div className="product-price">
                  <span>${product.price_product * product.quantity}</span>
                </div>
              </div>
              {index < cart.products.length - 1 && <hr className="cart-item-divider" />}
            </React.Fragment>
          ))}
          <hr />
          <p>Giá ban đầu <span className="price" style={{ color: 'black' }}><b>{subtotal.toFixed(2)}₫</b></span></p>
          <p>Giảm <span className="price" style={{ color: 'black' }}><b>{discount.toFixed(2)}₫</b></span></p>
          <p>Tổng cộng <span className="price" style={{ color: 'black' }}><b>{total.toFixed(2)}₫</b></span></p>
          <div className="button-container">
            <button onClick={handleCODSubmit} className="btn1" title='COD'><img src={cod} alt="COD" className="cod" /></button>
            <button onClick={handleMOMOSubmit} className="btn1" title='MOMO'><img src={momo} alt="MOMO" className="momo" /></button>
          </div>
        </div>
      </div>
      <div className="col-25">
        <div className="container">
          <form onSubmit={handleCODSubmit}>
            <div className="row1">
              <div className="col-50">
                <h3>Thông tin giao hàng</h3>
                <label htmlFor="fname"><i className="fa fa-user"></i> Họ tên</label>
                <input type="text" id="fname" name="firstname" placeholder="Chin Chin" required />
                <label htmlFor="adr"><i className="fa fa-address-card-o"></i> Địa chỉ</label>
                <input type="text" id="adr" name="address" placeholder="209 Le Van Sy" required value={address} onChange={(e) => setAddress(e.target.value)} />
                <label htmlFor="phone"><i className="fa fa-phone"></i> Điện thoại</label>
                <input type="text" id="phone" name="phone" placeholder="0123456789" required value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
