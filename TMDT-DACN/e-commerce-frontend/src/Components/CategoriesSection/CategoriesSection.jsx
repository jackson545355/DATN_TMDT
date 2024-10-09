import React, { useState, useEffect } from "react";
import "./CategoriesSection.css";
import { Link, useNavigate } from "react-router-dom";

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const categoryMap = {
    0: {
      name: "Điện tử",
      background:
        "https://img.freepik.com/free-photo/modern-gym-composition-with-sport-elements_23-2147913642.jpg?t=st=1726918454~exp=1726922054~hmac=529625e3b2aa1e7d24b771b12b5bd18f4386aeeb63584eb162cda00cc834ce8a&w=826",
    },
    1: {
      name: "Gia dụng",
      background:
        "https://img.freepik.com/premium-photo/elegance-monochrome-black-washing-machine-minimalist-black-background_957479-30596.jpg",
    },
    2: {
      name: "Mỹ phẩm",
      background:
        "https://img.freepik.com/free-photo/monochrome-beauty-product-skincare_23-2151307237.jpg?t=st=1726918733~exp=1726922333~hmac=188ebd0485f2635986439330be6aa0de85b31d8484264600682056d33125439e&w=826",
    },
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/products/getAll");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const products = data.products;
        const categoryData = products.reduce((acc, product) => {
          const { id_category, images, name_product, price_product } = product;
          if (!acc[id_category]) {
            acc[id_category] = {
              categoryTitle: categoryMap[id_category].name,
              backgroundImage: categoryMap[id_category].background,
              products: [],
            };
          }
          acc[id_category].products.push({
            _id: product._id,
            name_product,
            price_product,
            images,
          });
          return acc;
        }, {});
        console.log("Category data:", categoryData);
        setCategories(Object.values(categoryData));
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleSourceNowClick = (category) => {
    navigate("/filterSection", { state: {  category  } });
  };

  return (
    <div className="categories-section">
      {categories.map((category, index) => (
        <div
          className="category"
          key={index}
          style={{ backgroundImage: `url(${category.backgroundImage})` }}
        >
          <div className="category-title">
            <h3>{category.categoryTitle}</h3>
            <button
              className="source-now-btn"
              onClick={() => handleSourceNowClick(category.categoryTitle)}
            >
              Xem thêm
            </button>
          </div>
          <div className="category-product-grid">
            {category.products.slice(0,8).map((product) => (
              <Link to={`/product/${product._id}`} key={product._id}>
                <div  className="category-product-card">
                  <img src={product.images[0]} alt={product.name_product} />
                  <p className="category-product-name" title={product.name_product}>{product.name_product}</p>
                  <p className="category-product-price">
                    {product.price_product}₫
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoriesSection;
