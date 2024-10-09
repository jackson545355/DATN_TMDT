import React from 'react';
import './SupplierRequestSection.css'; // CSS file path

const SupplierRequestSection = () => {
  return (
    <div className="supplier-request-section">
      <div className="supplier-text-content">
        <h1>An easy way to send requests to all suppliers</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
      </div>
      <div className="supplier-form-content">
        <h2>Send quote to suppliers</h2>
        <form>
          <input type="text" placeholder="What item you need?" />
          <textarea placeholder="Type more details"></textarea>
          <div className="form-quantity">
            <input type="number" placeholder="Quantity" />
            <select>
              <option value="pcs">Pcs</option>
              {/* Other options */}
            </select>
          </div>
          <button type="submit">Send inquiry</button>
        </form>
      </div>
    </div>
  );
};

export default SupplierRequestSection;
