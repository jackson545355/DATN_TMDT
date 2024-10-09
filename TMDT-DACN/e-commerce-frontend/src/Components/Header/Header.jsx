import React, { useContext, useState, useEffect, useRef } from 'react';
import './Header.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../Assets/logoshop.png';
import defaultprofile from '../Assets/profile.png';
import cart from '../Assets/cart.png';
import { ShopContext } from '../../Context/ShopContext';

const Header = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems, fetchProducts, products  } = useContext(ShopContext);
  const [uploadUrl, setUploadUrl] = useState('');
  const [category, setCategory] = useState('all');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [avatar, setAvatar] = useState(defaultprofile);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {  
      fetch('http://localhost:3000/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setAvatar(data.user.profileImage || defaultprofile);
          } else {
            console.error("Failed to fetch user profile.");
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  }, []);

  useEffect(() => {
    // Gọi fetchProducts nếu chưa có sản phẩm nào trong state
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.name_product.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, products]);

  useEffect(() => {
    const productPageRegex = /^\/product\/[\w-]+$/; // Regex để xác định URL của trang sản phẩm
    if (!productPageRegex.test(location.pathname)) {
      setSearchTerm('');
    }
  }, [location]);

  useEffect(() => {
    if (filteredProducts.length > 0) {
      setFilteredProducts([]);
    }
  }, [searchTerm]);

  const handleCapture = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const key = "6e1d523e6e4384146c02efcd81cc2fbc";
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("expiration", 300);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${key}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const dataTemp = await response.json();
      console.log(dataTemp);
      const imageUrl = dataTemp.data.url;
      console.log(imageUrl);
      try {
        const responseFlask = await fetch("http://localhost:3006/imgSearch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl }),
        });

        const data = await responseFlask.json();
        console.table(data);
        const labelsOver10Percent = Object.entries(data.similarity)
          .filter(([label, probability]) => probability > 0.1) // Lọc ra những label có độ tương đồng lớn hơn 10%
          .sort((a, b) => b[1] - a[1]); // Sắp xếp các label từ cao xuống thấp theo độ tương đồng

        const allProductNames = [];
        labelsOver10Percent.forEach(([label]) => {
          const productNames = label.split("+"); // Tách tên sản phẩm bởi dấu +
          allProductNames.push(...productNames); // Đưa tất cả tên sản phẩm vào danh sách chung
        });
        console.log(allProductNames);
        navigate("/filterSection", { state: { labels: allProductNames } });
      } catch (error) {
        console.error("Failed to send image URL to Flask", error);
      }
    } catch (error) {
      console.error("There was an error uploading the file!", error);
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSelect = (product) => {
    setSearchTerm(product.name_product);
    navigate(`/product/${product._id}`);
  };

  const handleSearch = (e) => {
    // if (category !== "all") {
    //   const categoryMap = {
    //     houseware: "Gia dụng",
    //     electronics: "Điện tử",
    //     cosmetics: "Mỹ phẩm",
    //   };
    //   navigate("/filterSection", {
    //     state: { filters: { category: categoryMap[category] } },
    //   });
    // } else {
    //   navigate("/filterSection");
    // }
    e.preventDefault();
    if (searchTerm) {
      // Nếu có tìm kiếm, truyền danh sách sản phẩm tìm thấy và từ khóa tìm kiếm vào FilterSection
      navigate("/filterSection", {
        state: { 
          searchTerm: searchTerm, 
          filteredProducts: filteredProducts,
          category: category !== 'all' ? category : null // Giữ lại category nếu đã chọn
        }
      });
    } else if (category !== "all") {
      // Nếu không có từ khóa tìm kiếm nhưng có category, chỉ lọc theo category
      const categoryMap = {
        houseware: "Gia dụng",
        electronics: "Điện tử",
        cosmetics: "Mỹ phẩm",
      };
      navigate("/filterSection", {
        state: { filters: { category: categoryMap[category] } },
      });
    } else {
      // Nếu không có từ khóa và không có category, hiển thị toàn bộ sản phẩm
      navigate("/filterSection");
    }
  };
  

  const isLoginPage = location.pathname === "/login";

  return (
    <div className="header">
      <Link
        to="/"
        onClick={() => {
          setMenu("shop");
        }}
        style={{ textDecoration: "none" }}
        className="logo"
      >
        <img src={logo} alt="logo" />
        <p>MEGA</p>
      </Link>
      {!isLoginPage && ( // Ẩn các thành phần này nếu là trang login
        <>
      <form className="search-container">
        {/* <input type="text" placeholder="Search" className='search-bar' /> */}
        <input
          type="text"
          className='search-bar'
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {filteredProducts.length > 0 && (
          <ul className="search-results">
          {filteredProducts.map(product => (
            <li key={product._id} onClick={() => handleSearchSelect(product)}>
              {product.name_product}
            </li>
          ))}
        </ul>
        )}
        <select className="category-dropdown" onChange={handleCategoryChange}>
          <option value="all">Tất cả sản phẩm</option>
          <option value="electronics">Điện tử</option>
          <option value="houseware">Gia dụng</option>
          <option value="cosmetics">Mỹ phẩm</option>
        </select>
        <button className="search-button" onClick={handleSearch}>
          Tìm
        </button>
        {/* <input
          type="file"
          accept="image/*"
          className="upload-button"
          id="file-upload"
          style={{ display: "none" }}
          onChange={handleImageChange}
        /> */}
        <label
          htmlFor="file-upload"
          className="custom-upload-button"
          onClick={handleCapture}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </label>
      </form>
      <div className="user-actions">
        <Link to="/profile">
          <img src={avatar} alt="User Avatar" className="icon" />
        </Link>
        <Link to="/cart">
          <img src={cart} alt="cart" className="icon1" />
        </Link>
        <div className="cart-count">{getTotalCartItems()}</div>
      </div>
      <div className="login-cart">
        {localStorage.getItem("auth-token") ? (
          <button
            onClick={() => {
              localStorage.removeItem("auth-token");
              window.location.replace("/");
            }}
          >
            Đăng xuất
          </button>
        ) : (
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button>Đăng nhập</button>
          </Link>
        )}
      </div>
      </>
      )}
    </div>
  );
};

export default Header;
