import React, { useContext, useEffect } from 'react';
import Breadcrums from '../Components/Breadcrums/Breadcrums';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';
import ContentReviewer from '../Components/DescriptionBox/component/ContentReviewer/ContentReviewer';
// import Comment from '../Components/Comment/Comment';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';

const WebProduct = () => {
  const { products, fetchProducts } = useContext(ShopContext);
  const { productId } = useParams();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products]);
  
  const product = products.find((e) => e._id === productId);

  return (
    <div>
      <Breadcrums product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox>
        {/* <ContentReviewer productId={productId}/> */}
        <ContentReviewer productId={productId} />
      </DescriptionBox>
      {product && <RelatedProducts category={product.id_category} />}
    </div>
  );
};

export default WebProduct;
