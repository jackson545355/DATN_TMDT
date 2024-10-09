import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SegmentedControl } from '@mantine/core';
import Completed from './Completed/Completed'
import Pending from './Pending/Pending'
import Cancelled from './Cancelled/Cancelled'
import Shipping from './Shipping/Shipping'
import './MyOrder.css';

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const accessToken = localStorage.getItem('auth-token');
  const [selected, setSelected] = useState('Pending');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3003/orders/getOrderbyUserID/', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const data = response.data;
        if (data.success) {
          const ordersWithProducts = await Promise.all(data.orders.map(async (order) => {
            const productsWithDetails = await Promise.all(order.products.map(async (product) => {
              const productResponse = await axios.get(`http://localhost:3002/products/get-one-by-id/${product.product}`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`
                }
              });
              const productData = productResponse.data.product;
              return {
                ...product,
                details: productData
              };
            }));
            return {
              ...order,
              products: productsWithDetails
            };
          }));
          setOrders(ordersWithProducts);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [accessToken]);

  const handleChange = (value) => {
    let translatedValue;
  
  switch (value) {
    case 'Chờ xử lý':
      translatedValue = 'Pending';
      break;
    case 'Đang vận chuyển':
      translatedValue = 'Shipping';
      break;
    case 'Hoàn thành':
      translatedValue = 'Completed';
      break;
    case 'Đã hủy':
      translatedValue = 'Cancelled';
      break;
    default:
      translatedValue = 'Pending';
  }
    setSelected(translatedValue);
    console.log('Người dùng đã chọn: ', value);
  };

  const changeOrderStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:3003/orders/updateOrderStatus`,{ 
          status: newStatus,
          id
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      const data = response.data;
      if (data.success) {
        setOrders(prevOrders => {
          const updatedOrders = prevOrders.map(order =>
            order._id === id ? { ...order, status: newStatus } : order
          );
          return updatedOrders;
        });

        if (newStatus === 'cancelled') {
          await updateProductStocks(id);
        }
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const updateProductStocks = async (orderId) => {
    try {
      const response = await axios.post(`http://localhost:3003/orders/updateProductStocks`,
        { orderId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
  
      if (!response.data.success) {
        console.error('Error updating product stocks:', response.data.error);
      }
    } catch (error) {
      console.error('Error updating product stocks:', error);
    }
  };

  const filteredOrders = orders.filter(order => order.status.toLowerCase() === selected.toLowerCase());
  return (
    <div className="my-order-container">
      <div className="order-nav">
        <SegmentedControl
          data={['Chờ xử lý', 'Đang vận chuyển', 'Hoàn thành', 'Đã hủy']}
          transitionDuration={500}
          transitionTimingFunction="linear"
          onChange={handleChange}
        />
      </div>
      <div className="status">
          {selected === 'Pending' ? <Pending orders={filteredOrders} changeOrderStatus={changeOrderStatus} /> :
            selected === 'Shipping' ? <Shipping orders={filteredOrders} /> :
              selected === 'Completed' ? <Completed orders={filteredOrders} /> :
                selected === 'Cancelled' ? <Cancelled orders={filteredOrders} /> : null}
      </div>
      {/* {orders.map(order => (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <div className="order-seller">
              <span>Your order to {order.address}</span>
            </div>
          </div>
          <div className="order-body">
            <div>
              {order.products.map(product => (
                <div key={product._id} className="product-info">
                  <img src={product.details.images[0]} alt="" className="order-image" />
                  <div className="order-details">
                    <div className="order-title">{product.details.name_product}</div>
                    <div className="order-quantity">x{product.stock}</div>
                    <div className="order-color">Màu: {product.colors}</div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="order-status">
                <div className={`status-text ${order.status.toLowerCase()}`}>{order.status}</div>
                <div className="status-icon">📦</div>
              </div>
              <div className="order-price">{order.total.toLocaleString()}₫</div>
            </div>
          </div>
          <div className="order-footer">
            <div className="ship-date">
              {order.shipDate && <>Products will be shipped out by <span>{order.shipDate}</span></>}
            </div>
            <div className="order-total">
              <span>Order Total: </span>
              <span className="total-price">{order.total.toLocaleString()}₫</span>
            </div>
            <div className="order-buttons">
              {order.status === 'completing' && (
                <button
                  className="btn btn-completed"
                  onClick={() => changeOrderStatus(order._id, 'completed')}
                >
                  Mark as Completed
                </button>
              )}
              {order.status === 'pending' && (
                <button
                  className="btn btn-cancelled"
                  onClick={() => changeOrderStatus(order._id, 'cancelled')}
                >
                  Cancel Order
                </button>
              )}
              {order.status === 'completed' && (
                <button className="btn btn-contact-seller">Contact Seller</button>
              )}
              {order.status === 'cancelled' && (
                <button className="btn btn-contact-seller">Contact Seller</button>
              )}
            </div>
          </div>
        </div>
      ))} */}
    </div>
  );
};

export default MyOrder;
