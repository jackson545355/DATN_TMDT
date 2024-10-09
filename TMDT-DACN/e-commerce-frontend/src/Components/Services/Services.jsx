import React from 'react';
import './Services.css'; // Ensure this is the correct path to your CSS file
import monitorImg from '../Assets/monitor_service.png'
import sourceImg from '../Assets/source_service.png'
import customizeImg from '../Assets/customize_service.png'
import shippingImg from '../Assets/shipping_service.png'
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const services = [
  {
    id: 1,
    title: 'Source from Industry Hubs',
    imageUrl: sourceImg,
    icon: faSearch, // This should be the class name for the icon
  },
  {
    id: 2,
    title: 'Customize Your Products',
    imageUrl: customizeImg,
    icon: faSearch,
  },
  {
    id: 2,
    title: 'Fast, reliable shipping by ocean or air',
    imageUrl: shippingImg,
    icon: faSearch,
  },
  {
    id: 2,
    title: 'Product monitoring and inspection',
    imageUrl: monitorImg,
    icon: faSearch,
  },

  // ... other services
];

const Services = () => {
  return (
    <div className="services-section">
      <h2>Our extra services</h2>
      <div className="services-list">
        {services.map(service => (
          <div key={service.id} className="service-card">
            <img src={service.imageUrl} alt={service.title} />
            <div className="service-info">
              <p>{service.title}</p>
              <FontAwesomeIcon className='service-icon' icon={service.icon}></FontAwesomeIcon>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
