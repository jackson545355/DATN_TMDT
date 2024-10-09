import React, { useState, useEffect } from "react";
import "./DescriptionBox.css";
import { SegmentedControl } from '@mantine/core';
import ContentDescription from './component/ContentDescription/ContentDescription';
import ContentReviewer from './component/ContentReviewer/ContentReviewer';
import { useParams } from 'react-router-dom';

const DescriptionBox = () => {
  const { productId } = useParams();
  const [selected, setSelected] = useState('Thông tin chi tiết'); // Set default là 'Thông tin chi tiết'
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3002/products/get-one-by-id/${productId}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setProduct(data.product);
        } else {
          console.error('Failed to fetch product details');
        }
      })
      .catch(error => console.error('Error fetching product details:', error));
  }, [productId]);

  const handleChange = (value) => {
    setSelected(value); // Thay đổi giữa 'Thông tin chi tiết' và 'Đánh giá'
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Description">
      <div className="DescriptionLeft">
        <SegmentedControl
          data={['Thông tin chi tiết', 'Đánh giá']}
          transitionDuration={500}
          transitionTimingFunction="linear"
          value={selected} // Hiển thị trạng thái hiện tại
          onChange={handleChange} // Thay đổi khi người dùng click
        />
        <div className="content">
          {selected === 'Thông tin chi tiết' ? (
            <ContentDescription product={product} />
          ) : (
            <ContentReviewer productId={productId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DescriptionBox;
