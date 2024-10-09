import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./RecommendedItems.css"; // Make sure to create this CSS file

const RecommendedItems = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("http://localhost:3000/products/getLimit");
      const data = await response.json();
      if (response.ok && data.products) {
        // const productsWithDiscount = data.products
        //   .map((product) => ({
        //     ...product,
        //     discount:
        //       Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 50) + 10,
        //   }))
        //   .filter((product) => product.discount > 0)
        //   .sort((a, b) => b.discount - a.discount)
        //   .slice(0, 5);

        setProducts(
          data.products.sort((a, b) => b.numberSold - a.numberSold).slice(0, 10)
        );
      } else {
        console.error("Failed to fetch products");
      }
    };
    fetchProducts();
  }, []);
  // Assuming you have a list of items that you're mapping over

  return (
    <div className="recommended-items">
      <h2>Sản phẩm gợi ý</h2>
      <div className="recommended-items-grid">
        {products.map((product) => (
          <Link to={`/product/${product._id}`}  key={product._id}>
            <div className="recommended-item-card">
              <img src={product.images[0]} alt={product.name_product} />
              <p className="recommended-description" title={product.name_product}>{product.name_product}</p>
              <p className="recommended-price">{product.price_product}₫</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedItems;
