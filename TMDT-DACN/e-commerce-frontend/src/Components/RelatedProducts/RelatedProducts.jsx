import React, { useState, useEffect } from 'react';
import './RelatedProducts.css';
import Item from '../Item/Item';
import axios from 'axios';

const RelatedProducts = ({ category }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/products/getLimit/');
        if (response.data.success) {
          const products = response.data.products;
          const filteredProducts = products.filter(product => product.id_category === category);
          const shuffledProducts = filteredProducts.sort(() => 0.5 - Math.random());
          const selectedProducts = shuffledProducts.slice(0, 4);
          setRelatedProducts(selectedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchData();
  }, [category]);

  return (
    <div className='relatedproducts'>
      <h2 className="csslai">Related Products</h2>
      <div className="relatedproducts-item">
        {relatedProducts.map((item) => (
          <Item
            key={item._id}
            id={item._id}
            name={item.name_product}
            image={item.images[0]}
            new_price={item.price_product}
            old_price={item.price_product}
          />
        ))}
      </div>
    </div>
  );
}

export default RelatedProducts;
