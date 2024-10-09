import './ContentDescription.css';

const ContentDescription = ({ product }) => {
  return (
    <div className="product-description">
      <p>{product.description}</p>
    </div>
  );
};

export default ContentDescription;
