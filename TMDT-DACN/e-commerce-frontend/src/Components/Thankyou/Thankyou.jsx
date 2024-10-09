import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Thankyou.css'; // Thêm CSS nếu cần

const Thankyou = () => {
  const navigate = useNavigate();

  return (
    <div className="thankyou-container">
      <h1>Cảm ơn bạn đã mua hàng!</h1>
      <p>Chúng tôi sẽ xử lý đơn hàng của bạn ngay lập tức.</p>
      <button onClick={() => navigate('/')} className="btn">Tiếp tục mua sắm</button>
    </div>
  );
};

export default Thankyou;
