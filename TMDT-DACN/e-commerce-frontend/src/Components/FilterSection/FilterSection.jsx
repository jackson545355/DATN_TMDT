import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './FilterSection.css';
import ProductList from '../ProductList/ProductList';

const categoryMap = {
  0: "Điện tử",
  1: "Gia dụng",
  2: "Mỹ phẩm"
};

const FilterSection = () => {
  const location = useLocation();
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(false);
  const [isBrandExpanded, setIsBrandExpanded] = useState(false);
  const [isTypeExpanded, setIsTypeExpanded] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [checkedCategories, setCheckedCategories] = useState({});
  const [checkedBrands, setCheckedBrands] = useState({});
  const [checkedTypes, setCheckedTypes] = useState({});
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [searchBrand, setSearchBrand] = useState(""); // State for search input
  const maxItemsToShow = 5; // Số lượng mục tối đa hiển thị trước khi thêm nút "Xem thêm"

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3002/products/getAll');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Normalize product brand names to lower case
        const normalizedProducts = data.products.map(product => ({
          ...product,
          brand: product.brand.toLowerCase(),
        }));

        setProducts(normalizedProducts);
        setFilteredProducts(normalizedProducts);

        // Extract unique categories and normalized brands
        const categories = [...new Set(normalizedProducts.map(product => categoryMap[product.id_category]))];
        const brands = [...new Set(normalizedProducts.map(product => product.brand))];

        setAvailableCategories(categories);
        setAvailableBrands(brands);

      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchProducts();
  }, []);

  // const filterProducts = (products) => {
  //   let updatedProducts = [...products];

  //   if (location.state && location.state.filters) {
  //     const { category } = location.state.filters;
  //     if (category) {
  //       setSelectedCategories([category]);
  //       setCheckedCategories({ [category]: true });
  //       handleFilterChange();
  //     }
  //     updatedProducts = updatedProducts.filter(product => product.category === category);
  //   }

  //   if (location.state && location.state.labels) {
  //     const productNames = location.state.labels;
  //     updatedProducts = updatedProducts.filter(product =>
  //       productNames.some(name =>
  //         product.name_product.toLowerCase().includes(name.toLowerCase())
  //       )
  //     );
  //   }

  //   setFilteredProducts(updatedProducts);
  // };

  useEffect(() => {
    console.log(location.state);
    console.log(products);
    if (location.state && products.length > 0) {
      const { searchTerm, filteredProducts, category, labels } =
      //  {}
      location.state
      ;
      console.log(location.state);
      // console.log(labels);
      if (labels){
        const productNames = location.state.labels;
        const filtered = products.filter(product =>
        productNames.some(name =>
          product.name_product.toLowerCase().includes(name.toLowerCase())
        )
      );
        setFilteredProducts(filtered);
      } else if (filteredProducts && filteredProducts.length > 0) {
        // Nếu có danh sách sản phẩm đã lọc, hiển thị nó
        setFilteredProducts(filteredProducts);
      } else if (searchTerm) {
        // Nếu có từ khóa tìm kiếm nhưng không có sản phẩm lọc trước, lọc lại dựa trên sản phẩm
        const filtered = products.filter(product =>
          product.name_product.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
      } else if (category) {
        // Lọc sản phẩm dựa trên category nếu có
        setSelectedCategories([category]);
        setCheckedCategories({ [category]: true });
        // handleFilterChange();
        const filtered = products.filter(product => categoryMap[product.id_category] === category);
        setFilteredProducts(filtered);
      }
    }
  }, [location.state, products]);
  

  const handleFilterChange = () => {
    let filtered = products;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => selectedCategories.includes(categoryMap[product.id_category]));
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => selectedBrands.includes(product.brand.toLowerCase()));
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(product => selectedTypes.includes(product.type));
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category, initial = false) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
    setCheckedCategories(prev => ({ ...prev, [category]: !prev[category] }));

    if (initial) {
      setCheckedCategories({ [category]: true });
      setSelectedCategories([category]);
    }
  };

  const handleBrandChange = (brand) => {
    const normalizedBrand = brand.toLowerCase(); // Normalize brand for consistency
    const newBrands = selectedBrands.includes(normalizedBrand)
      ? selectedBrands.filter(b => b !== normalizedBrand)
      : [...selectedBrands, normalizedBrand];
    setSelectedBrands(newBrands);
    setCheckedBrands(prev => ({ ...prev, [normalizedBrand]: !prev[normalizedBrand] }));
  };

  const handleTypeChange = (type) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(newTypes);
    setCheckedTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  useEffect(() => {
    handleFilterChange();
  }, [selectedCategories, selectedBrands, selectedTypes]);

  // Lọc các thương hiệu dựa vào từ khóa tìm kiếm
  const filteredBrands = availableBrands.filter(brand => brand.toLowerCase().includes(searchBrand.toLowerCase()));

  return (
    <div className="container-main">
      <aside className="filter-section">
        <details open>
          <summary>Phân loại</summary>
          <ul>
            {availableCategories.slice(0, isCategoryExpanded ? availableCategories.length : maxItemsToShow).map(category => (
              <li key={category}>
                <input
                  type="checkbox"
                  id={category}
                  checked={!!checkedCategories[category]}
                  onChange={() => handleCategoryChange(category)}
                />
                <label htmlFor={category}>{category}</label>
              </li>
            ))}
          </ul>
          {availableCategories.length > maxItemsToShow && (
            <button className="see-all" onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}>
              {isCategoryExpanded ? 'Rút gọn' : 'Xem tất cả'}
            </button>
          )}
        </details>

        <details open>
          <summary>Thương hiệu</summary>
          <input
            type="text"
            placeholder="Tìm kiếm thương hiệu..."
            value={searchBrand}
            onChange={(e) => setSearchBrand(e.target.value)}
          />
          <ul>
            {filteredBrands.slice(0, isBrandExpanded ? filteredBrands.length : maxItemsToShow).map(brand => (
              <li key={brand}>
                <input
                  type="checkbox"
                  id={brand}
                  checked={!!checkedBrands[brand]}
                  onChange={() => handleBrandChange(brand)}
                />
                <label htmlFor={brand}>{brand.charAt(0).toUpperCase() + brand.slice(1)}</label>
              </li>
            ))}
          </ul>
          {filteredBrands.length > maxItemsToShow && (
            <button className="see-all" onClick={() => setIsBrandExpanded(!isBrandExpanded)}>
              {isBrandExpanded ? 'Rút gọn' : 'Xem tất cả'}
            </button>
          )}
        </details>

        {/* <details open>
          <summary>Type</summary>
          <ul>
            <li>
              <input
                type="checkbox"
                id="phones"
                checked={!!checkedTypes['Phones']}
                onChange={() => handleTypeChange('Phones')}
              />
              <label htmlFor="phones">Điện thoại</label>
            </li>
            <li>
              <input
                type="checkbox"
                id="laptops"
                checked={!!checkedTypes['Laptops']}
                onChange={() => handleTypeChange('Laptops')}
              />
              <label htmlFor="laptops">Laptop</label>
            </li>
            {isTypeExpanded && (
              <>
                <li>
                  <input
                    type="checkbox"
                    id="tablets"
                    checked={!!checkedTypes['Tablets']}
                    onChange={() => handleTypeChange('Tablets')}
                  />
                  <label htmlFor="tablets">Máy tính bảng</label>
                </li>
              </>
            )}
          </ul>
          <button className="see-all" onClick={() => setIsTypeExpanded(!isTypeExpanded)}>
            {isTypeExpanded ? 'Rút gọn' : 'Xem tất cả'}
          </button>
        </details> */}
      </aside>
      <ProductList
         products={filteredProducts}
         selectedCategories={selectedCategories}
         selectedBrands={selectedBrands}
         selectedTypes={selectedTypes}
         onRemoveFilter={(type, value) => {
           if (type === 'category') {
             handleCategoryChange(value);
           } else if (type === 'brand') {
             handleBrandChange(value);
           } else if (type === 'type') {
             handleTypeChange(value);
           }
         }}
         resetPage={filteredProducts}
      />
    </div>
  );
};

export default FilterSection;
