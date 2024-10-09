import React from 'react';
import './SuppliersByRegion.css'; // Ensure this is the correct path to your CSS file
import arabic from '../Assets/arabic_emirates_flagIcon.png'
import australia from '../Assets/australia_flagIcon.png'

const suppliers = [
  { id: 1, country: 'Arabic Emirates', domain: 'shopname.ae', flagCode: 'ae', flagIcon:arabic },
  { id: 2, country: 'Australia', domain: 'shopname.au', flagCode: 'au', flagIcon:australia },
  { id: 2, country: 'Australia', domain: 'shopname.au', flagCode: 'au', flagIcon:australia },
  { id: 2, country: 'Australia', domain: 'shopname.au', flagCode: 'au', flagIcon:australia },
  { id: 1, country: 'Arabic Emirates', domain: 'shopname.ae', flagCode: 'ae', flagIcon:arabic },
  { id: 1, country: 'Arabic Emirates', domain: 'shopname.ae', flagCode: 'ae', flagIcon:arabic },
  { id: 1, country: 'Arabic Emirates', domain: 'shopname.ae', flagCode: 'ae', flagIcon:arabic },
  { id: 1, country: 'Arabic Emirates', domain: 'shopname.ae', flagCode: 'ae', flagIcon:arabic },
  { id: 1, country: 'Arabic Emirates', domain: 'shopname.ae', flagCode: 'ae', flagIcon:arabic },
  // ... more suppliers
];

const SupplierItem = ({ country, domain, flagIcon }) => (
  <div className="supplier-item">
    <img className="flag-icon" src={flagIcon} alt="" />
    <span className="country-name">{country}</span>
    <a href={`http://${domain}`} className="domain-name">{domain}</a>
  </div>
);

const SuppliersByRegion = () => {
  return (
    <div className="suppliers-by-region">
      <h2>Suppliers by region</h2>
      <div className="supplier-list">
        {suppliers.map(supplier => (
          <SupplierItem key={supplier.id} {...supplier} />
        ))}
      </div>
    </div>
  );
};

export default SuppliersByRegion;
