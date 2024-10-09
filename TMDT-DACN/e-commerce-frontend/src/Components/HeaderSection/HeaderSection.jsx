import React, { useState } from 'react';
import { MDBCarousel, MDBCarouselItem, MDBCarouselCaption } from 'mdb-react-ui-kit';
import './HeaderSection.css';
import { useNavigate } from "react-router-dom";

const HeaderSection = () => {
  const categories = [
    { name: 'Điện tử', imgSrc: 'https://mdbootstrap.com/img/Photos/Slides/img%20(21).jpg' },
    { name: 'Mỹ phẩm', imgSrc: 'https://mdbootstrap.com/img/Photos/Slides/img%20(22).jpg' },
    { name: 'Gia dụng', imgSrc: 'https://mdbootstrap.com/img/Photos/Slides/img%20(23).jpg' }
  ];
  
  const navigate = useNavigate();

  const handleSourceNowClick = (category) => {
    navigate("/filterSection", { state: { filters: { category } } });
  };

  return (
    <header className="header-section">
      <MDBCarousel showControls showIndicators>
        {categories.map((category, index) => (
          <MDBCarouselItem key={index} itemId={index + 1}>
            <img src={category.imgSrc} className='d-block w-100' alt={category.name} />
            <MDBCarouselCaption>
              <h5>{category.name}</h5>
              <button className="learn-more-btn" onClick={() => handleSourceNowClick(category.name)}>Xem Thêm<main></main></button>
            </MDBCarouselCaption>
          </MDBCarouselItem>
        ))}
      </MDBCarousel>
    </header>
  );
};

export default HeaderSection;
