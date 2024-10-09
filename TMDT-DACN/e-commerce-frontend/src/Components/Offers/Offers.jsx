import React, { useState, useEffect, useCallback } from "react";
import "./Offers.css";
import { Link } from "react-router-dom"; // Import Link

const Offers = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [endTime, setEndTime] = useState(new Date("2024-12-08T03:00:00"));
  const [products, setProducts] = useState([]);

  const calculateTimeLeft = useCallback(() => {
    const difference = endTime - new Date();
    if (difference > 0) {
      return {
        days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(
          2,
          "0"
        ),
        hours: String(
          Math.floor((difference / (1000 * 60 * 60)) % 24)
        ).padStart(2, "0"),
        minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(
          2,
          "0"
        ),
        seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, "0"),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }, [endTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("http://localhost:3000/products/getLimit");
      const data = await response.json();
      if (response.ok && data.products) {
        const productsWithDiscount = data.products
          .map((product) => ({
            ...product,
            discount:
              Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 50) + 10,
          }))
          .filter((product) => product.discount > 0)
          .sort((a, b) => b.discount - a.discount)
          .slice(0, 5);

        setProducts(productsWithDiscount);
      } else {
        console.error("Failed to fetch products");
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="deals-container">
      <div className="deals-header"
       style={{ backgroundImage: `url(https://img.freepik.com/free-vector/new-arrival-banner-template-with-blue-shapes_1361-2297.jpg?t=st=1726907864~exp=1726911464~hmac=468881ae5b87b88ff3b0639c9e3399c26ae4242b0724a014c028c1c3c30bdf91&w=1060)` }}
      >
        <h3>Sản phẩm mới</h3>
      </div>
      <div className="deals-product-grid">
        {products.map((product) => (
          <Link to={`/product/${product._id}`} key={product._id}>
            <div className="deals-product-card">
              <img src={product.images[0]} alt={product.name_product} />
              <p className="product-name" title={product.name_product}>{product.name_product}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Offers;
