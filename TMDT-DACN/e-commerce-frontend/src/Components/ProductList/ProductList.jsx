import React, { useState, useEffect } from 'react';
import './ProductList.css';
import { faList, faTableCellsLarge, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating'; // Import Rating từ Material UI
import Stack from '@mui/material/Stack';  // Import Stack để sắp xếp rating

const ProductList = ({ products, selectedCategories, selectedBrands, selectedTypes, onRemoveFilter, resetPage }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = viewMode === 'grid' ? 9 : 6;
  const [ratings, setRatings] = useState({}); // Lưu rating của từng sản phẩm
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const [isLoading, setIsLoading] = useState(true); 
  const totalPages = Math.ceil(products.length / productsPerPage);

  const truncateProductName = (name, maxLength = 35) => {
    return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    // Khi prop resetPage thay đổi, đặt lại currentPage về 1
    setCurrentPage(1);
    if (!isLoading && currentProducts.length === 0) {
      alert("Không có sản phẩm phù hợp");
    }
  }, [resetPage]);

  


  const renderPageNumbers = () => {
    const pageNumbers = [];
    const totalPageNumbersToShow = 5; // Số trang hiển thị tối đa trong trường hợp không phải ở biên
    const boundaryPages = 1; // Số trang hiển thị ở đầu và cuối
  
    if (totalPages <= totalPageNumbersToShow) {
      // Hiển thị tất cả các trang nếu tổng số trang ít hơn hoặc bằng số trang hiển thị tối đa
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        // Khi currentPage từ 1 đến 3, hiển thị các trang từ 1 đến 5
        for (let i = 1; i <= totalPageNumbersToShow; i++) {
          pageNumbers.push(i);
        }
        if (totalPages > totalPageNumbersToShow) {
          pageNumbers.push('...');
          pageNumbers.push(totalPages);
        }
      } else if (currentPage > 3 && currentPage < totalPages - 2) {
        // Khi currentPage từ 4 đến tổng số trang trừ 2, hiển thị 1 ... currentPage-1 currentPage currentPage+1 ... totalPages
        pageNumbers.push(1);
        pageNumbers.push('...');
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        if (currentPage + 1 < totalPages - 1) {
          pageNumbers.push('...');
        }
        pageNumbers.push(totalPages);
      } else {
        // Khi currentPage nằm trong 3 trang cuối cùng
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      }
    }
  
    return pageNumbers.map((number, index) => {
      if (number === '...') {
        return <span key={index} className="pagination-ellipsis">...</span>;
      }
      return (
        <button
          key={index}
          onClick={() => handlePageChange(number)}
          className={`pagination-button ${currentPage === number ? 'active' : ''}`}
        >
          {number}
        </button>
      );
    });
  };
  
  useEffect(() => {
    // Fetch rating cho tất cả sản phẩm
    const fetchRatings = async () => {
      setIsLoading(true);
      const ratingsData = {};
      for (let product of products) {
        try {
          // console.log(`Fetching rating for product: ${product._id}`);
          const response = await fetch(`http://localhost:3000/products/get-one-by-id/${product._id}`);
          const data = await response.json();
          // console.log('Response data:', data);
          if (data.success) {
            const averageRating = data.product.comments.length > 0
              ? data.product.comments.reduce((acc, curr) => acc + curr.rating, 0) / data.product.comments.length
              : 0;
            ratingsData[product._id] = {
              averageRating: averageRating.toFixed(1), // Lưu rating trung bình
              numberOfReviews: data.product.comments.length // Lưu số lượng review
            };
          }
          if(product._id === "6697c7fca7d753e67a040336") {
          // console.log('Ratings data:', ratingsData);
          }
        } catch (error) {
          console.error('Error fetching product ratings:', error);
        }
      }
      setRatings(ratingsData);
      setIsLoading(false);
    };

    fetchRatings();
  }, [products]);

  return (
    <div className="product-list-container">
      <div className="controls">
        {/* <button onClick={() => setViewMode('grid')} className={`${viewMode === 'grid' ? 'active' : ''}`}>
          <FontAwesomeIcon icon={faList} />
        </button> */}
      </div>

      <div className="selected-filters">
        {selectedCategories.map(category => (
          <div className="filter-tag category-tag" key={category}>
            {category} <FontAwesomeIcon icon={faTimes} onClick={() => onRemoveFilter('category', category)} />
          </div>
        ))}
        {selectedBrands.map(brand => (
          <div className="filter-tag brand-tag" key={brand}>
            {brand} <FontAwesomeIcon icon={faTimes} onClick={() => onRemoveFilter('brand', brand)} />
          </div>
        ))}
        {selectedTypes.map(type => (
          <div className="filter-tag type-tag" key={type}>
            {type} <FontAwesomeIcon icon={faTimes} onClick={() => onRemoveFilter('type', type)} />
          </div>
        ))}
      </div>

      <div className={`product-list ${viewMode}`}>
  {currentProducts.length !== 0 ? currentProducts.map(product => (
    <div key={product._id} className="product-card">
      <img src={product.images[0]} title={product.name_product} />
      <h3 title={product.name_product}>{product.name_product}</h3>
      <div className="price">
        <span className="current-price">{product.price_product}₫</span>
        <span className="original-price">{product.price_product}₫</span>
      </div>
      <div className="product-meta">
        <div className="rating">
           <Stack spacing={1} direction="row">
            <Rating
              name="half-rating-read"
              value={ratings[product._id]?.averageRating || 0}
              precision={0.5}
              readOnly
            />
            <span className="rating-number">
              {ratings[product._id]?.averageRating || '0.0'} ({ratings[product._id]?.numberOfReviews || 0} reviews)
            </span>
          </Stack>
        </div>
      </div>
      <Link to={`/product/${product._id}`} className="view-details">
        Xem chi tiết
      </Link>
    </div>
  )) : (
    !isLoading && null
  )}
</div>

      {/* Tích hợp chức năng Pagination trực tiếp */}
      <div className="pagination1">
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className="pagination-button"
        >
          &laquo; Prev
        </button>

        {renderPageNumbers()}

        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next &raquo;
        </button>
      </div>
    </div>
  );
};

export default ProductList;
