import React from 'react';
import './Breadcrums.css';
import arrow_icon from '../Assets/breadcrum_arrow.png';

const categoryMapping = {
  0: 'Điện tử',
  1: 'Gia dụng',
  2: 'Mỹ phẩm'
};

const Breadcrums = (props) => {
  const { product } = props;
  const categoryName = categoryMapping[product?.id_category];

  return (
    <div className='breadcrums'>
      Home <img src={arrow_icon} alt="" /> Shop <img src={arrow_icon} alt="" /> {categoryName} <img src={arrow_icon} alt="" /> {product?.name_product} 
    </div>
  );
}

export default Breadcrums;
