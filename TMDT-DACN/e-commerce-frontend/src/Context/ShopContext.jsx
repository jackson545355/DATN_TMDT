import React, { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [cartId, setCartId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProducts();
        await fetchCart();
      } catch (error) {
        console.error('Error fetching products or cart:', error);
      }
    };

    fetchData();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3002/products/getLimit/');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCart = async () => {
    if (localStorage.getItem("auth-token")) {
      try {
        const response = await axios.get('http://localhost:3005/carts/get-one-by-user-id/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("auth-token")}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.data && response.data._id) {
          const cartData = {};
          response.data.products.forEach(product => {
            const key = `${product.id_product}-${product.color}`;
            cartData[key] = product.quantity;
          });
          setCartItems(cartData);
          setCartId(response.data._id);
        } else {
          await createCart();
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    }
  };

  const createCart = async () => {
    try {
      const response = await axios.post('http://localhost:3005/carts/create-one/', {}, {
        headers: {
          'Authorization': `${localStorage.getItem("auth-token")}`,
          'Content-Type': 'application/json',
        }
      });
      setCartId(response.data._id);
      return response.data._id;
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  };

  const addToCart = async (itemId, quantity = 1, color) => {
    try {
      const productResponse = await axios.get(`http://localhost:3002/products/get-one-by-id/${itemId}`);
      const product = productResponse.data.product;
      const colorData = product.colors.find(c => c.color === color);
      const key = `${itemId}-${color}`;
      const currentQuantity = cartItems[key] || 0;

      if (currentQuantity + quantity > colorData.stock) {
        window.alert(`Cannot add more than ${colorData.stock} items for color ${color}`);
        return;
      }
      if (!cartId) {
        await fetchCart();
      }
      setCartItems((prev) => {
        const newCartItems = { ...prev };
        if (newCartItems[key]) {
          newCartItems[key] += quantity;
        } else {
          newCartItems[key] = quantity;
        }
        return newCartItems;
      });

      await axios.post('http://localhost:3005/carts/add-product/', {
        id_product: itemId, quantity: quantity, color: color
      }, {
        headers: {
          'Authorization': `${localStorage.getItem("auth-token")}`,
          'Content-Type': 'application/json',
        }
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (itemId, color) => {
    const key = `${itemId}-${color}`;
    setCartItems((prev) => {
      const newCartItems = { ...prev };
      if (newCartItems[key] > 1) {
        newCartItems[key] -= 1;
      } else {
        delete newCartItems[key];
      }
      return newCartItems;
    });
    try {
      await axios.post('http://localhost:3005/carts/remove-product/', {
        id_product: itemId, color: color
      }, {
        headers: {
          'Authorization': `${localStorage.getItem("auth-token")}`,
          'Content-Type': 'application/json',
        }
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      const productKeys = Object.keys(cartItems);
      await axios.delete('http://localhost:3005/carts/remove-products', {
        data: { id_products: productKeys.map(key => key.split('-')[0]), colors: productKeys.map(key => key.split('-')[1]) },
        headers: {
          'Authorization': `${localStorage.getItem("auth-token")}`,
          'Content-Type': 'application/json',
        }
      });
      setCartItems({});
      // getTotalCartItems();
      setCartId(null);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const [productId, color] = item.split('-');
        const itemInfo = products.find((product) => product._id === productId);
        totalAmount += cartItems[item] * itemInfo.price_product;
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    return Object.keys(cartItems).length;
  };

  const contextValue = {
    fetchCart,
    products,
    getTotalCartItems,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalCartAmount,
    fetchProducts
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
