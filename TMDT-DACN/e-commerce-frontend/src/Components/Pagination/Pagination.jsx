import React, { useState } from "react";
import "./Pagination.css"; // Ensure this is the correct path to your CSS file

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const [numberOfItems, setNumberOfItems] = useState(itemsPerPage);
  const pageNumbers = [];
  const totalPages = Math.ceil(totalItems / numberOfItems);
  const maxPageNumbersToShow = 5; // Số lượng trang tối đa hiển thị cùng lúc

  // Tính toán các trang cần hiển thị
    const generatePageNumbers = () => {
      const pageNumbers = [];
      console.log(pageNumbers);
      if (totalPages <= maxPageNumbersToShow) {
        // Hiển thị tất cả số trang nếu tổng số trang nhỏ hơn hoặc bằng số trang tối đa có thể hiển thị
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        if (currentPage < 3) {
          // Hiển thị các trang đầu tiên nếu currentPage nhỏ hơn 3
          for (let i = 1; i <= 4; i++) {
            pageNumbers.push(i);
          }
          pageNumbers.push("...");
          pageNumbers.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          // Hiển thị các trang cuối cùng nếu currentPage ở gần cuối danh sách
          pageNumbers.push(1);
          pageNumbers.push("...");
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pageNumbers.push(i);
          }
        } else {
          // Hiển thị các trang xung quanh currentPage khi currentPage ở giữa danh sách
          pageNumbers.push(1);
          pageNumbers.push("...");
          
          // Chỉ hiển thị 2 trang trước và 2 trang sau so với trang hiện tại
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pageNumbers.push(i);
          }
    
          // Nếu còn trang sau nữa, thì hiển thị thêm dấu "..." và trang cuối
          if (currentPage + 2 < totalPages) {
            pageNumbers.push("...");
          }
    
          pageNumbers.push(totalPages);
        }
      }
    
      return pageNumbers;
    };
    

  return (
    <div className="pagination-container">
      <div className="items-per-page">
        <label htmlFor="itemsPerPage">Hiện</label>
        <select
          name="itemsPerPage"
          id="itemsPerPage"
          value={numberOfItems}
          onChange={(e) => {
            setNumberOfItems(e.target.value);
            paginate(1, e.target.value); // Reset to page 1 with new number of items per page
          }}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>

      <div className="page-numbers">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {generatePageNumbers().map((number, index) =>
          number === "..." ? (
            <span key={index} className="dots">
              ...
            </span>
          ) : (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={currentPage === number ? "active" : ""}
            >
              {number}
            </button>
          )
        )}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
