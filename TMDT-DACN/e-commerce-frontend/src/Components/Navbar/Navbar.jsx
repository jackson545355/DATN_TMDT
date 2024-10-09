import React, { useState } from 'react'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'

  

const Navbar = () => {

  const [languageCurrency, setLanguageCurrency] = useState('English, USD');

  const handleSelectionLanguageChange = (event) => {
    setLanguageCurrency(event.target.value);
  };

  const [shipCurrency, setShipCurrency] = useState('London');

  const handleSelectionShipChange = (event) => {
    setShipCurrency(event.target.value);
  };

  const [category, setCategory] = useState('all');
  
  const navigate = useNavigate();

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    // Điều hướng người dùng đến trang tương ứng
    if(e.target.value !== 'shop') {
      navigate(`/${e.target.value}`);
    }
    else {
      navigate('/');
    }
  }

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <select className="category-dropdown" value={category} onChange={handleCategoryChange}>
            <option value="shop">☰ All category</option>
            <option value="mens">Men</option>
            <option value="womens">Women</option>
            <option value="kids">Kids</option>
        </select>
        <Link to="/projects" className="navbar-link">Projects</Link>
        <Link to="/productlist" className="navbar-link">Product List</Link>
        <div className="dropdown">
          <select value={languageCurrency} onChange={handleSelectionLanguageChange}>
            <option value="English, USD">English, USD</option>
            <option value="Vietnam, VND">Vietnam, VND</option>
            <option value="Thailand, Bath">Thailand, Bath</option>
            <option value="Japan, Yen">Japan, Yen</option>
          </select>
        </div>
        <div className="dropdown">
          <span>Ship to</span>
          <select value={shipCurrency} onChange={handleSelectionShipChange}>
            <option value="London">London</option>
            <option value="Vietnam">Vietnam</option>
            <option value="Thailand">Thailand</option>
            <option value="Japan">Japan</option>
          </select>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
