import React from 'react';
import './Cancelled.css';

const Cancelled = ({ orders }) => {
  return (
    <div className="order-list">
      {orders.map(order => (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <div className="order-seller">
              <span>Your order to {order.address}</span>
            </div>
          </div>
          <div className="cancelled-order-body">
            <div>
              {order.products.map(product => (
                <div key={product._id} className="product-info">
                  <img src={product.details.images[0]} alt="" className="order-image" />
                  <div className="order-details">
                    <a className="order-title" href={`/product/${product.details._id}`}>{product.details.name_product}</a>
                    <div className="order-quantity">x{product.stock}</div>
                    <div className="order-color">Màu: {product.colors}</div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="order-status">
                <div className={`status-text ${order.status.toLowerCase()}`}>{order.status}</div>
              </div>
            </div>
          </div>
          <div className="order-footer">
            <div className="order-total">
              <span>Order Total: </span>
              <span className="total-price">{order.total.toLocaleString()}₫</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cancelled;
