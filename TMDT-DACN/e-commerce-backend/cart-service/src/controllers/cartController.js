const axios = require('axios');
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
// const ProductController = require('../../../product-service/src/controllers/productController');

const PRODUCT_SERVICE_URL = 'http://localhost:3002';

exports.createCart = async (req, res) => {
  try {
    const userID = req.userId;
    const cart = await Cart.findOne({ id_user: userID });
    if (cart) {
      return res.status(404).send(`Cart with userID ${userID} is already created`);
    }

    const newCart = new Cart(req.body);
    await newCart.save();
    res.status(201).send(newCart);
  } catch (error) {
    res.status(500).send('Error creating cart');
  }
};

exports.getCartByUserId = async (req, res) => {
  try {
    const userID = req.userId;
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).send('Invalid user ID');
    }

    let cart = await Cart.findOne({ id_user: userID });
    let updatedProducts = [];
    if (!cart) {
      cart = new Cart({
        id_user: userID,
        products: []
      });
      await cart.save();
      return res.status(201).json({ success: true, cart });
    } else {
      updatedProducts = await Promise.all(
        cart.products.map(async (item) => {
          const productId = item.id_product.toString();
          const product = await axios.get(`${PRODUCT_SERVICE_URL}/products/get-one-by-id/${productId}`);
          if (product) {
            const data = product.data.product;
            return {
              ...item.toObject(), // Chuyển đổi item thành đối tượng để có thể chỉnh sửa
              name_product: data.name_product,
              price_product: data.price_product,
              image: data.image,
              description: data.description,
              stock: data.stock,
              id_category: data.id_category,
              images: data.images,
            };
          } else {
            return item;
          }
        })
      );
    }

    const updatedCart = {
      ...cart.toObject(),
      products: updatedProducts
    };

    res.json(updatedCart);
  } catch (error) {
    res.status(500).send(`Error fetching or creating cart: ${error}`);
  }
};

exports.addProduct = async (req, res) => {
  try {
    const userID = req.userId;
    const productID = req.body.id_product;
    const quantity = req.body.quantity;
    const color = req.body.color;

    const product = await axios.get(`${PRODUCT_SERVICE_URL}/products/get-one-by-id/${productID}`);
    if (!product) {
      return res.status(404).send('Product not found');
    }

    let cart = await Cart.findOne({ id_user: userID });
    if (!cart) {
      cart = new Cart({
        id_user: userID,
        products: [{ id_product: productID, quantity: quantity, color: color }]
      });
    } else {
      const productIndex = cart.products.findIndex(p => p.id_product.toString() === productID && p.color === color);
      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ id_product: productID, quantity, color });
      }
    }

    await cart.save();
    res.status(200).send(cart);
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).send(`Error adding product to cart ${error}`);
  }
};

exports.removeProducts = async (req, res) => {
  try {
    const userID = req.userId;
    const { id_product, color } = req.body; // List[id_products]

    let cart = await Cart.findOne({ id_user: userID });
    if (!cart) {
      return res.status(404).send('Cart is not created');
    }

    const productIndex = cart.products.findIndex(p => p.id_product.toString() === id_product && p.color === color);
    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);
    }

    await cart.save();

    const updatedProducts = await Promise.all(
      cart.products.map(async (item) => {
        const productId = item.id_product.toString();
        const product = await axios.get(`${PRODUCT_SERVICE_URL}/products/get-one-by-id/${productId}`);
        if (product) {
          const data = product.data.product;
          return {
            ...item.toObject(), // Chuyển đổi item thành đối tượng để có thể chỉnh sửa
            name_product: data.name_product,
            price_product: data.price_product,
            image: data.image,
            description: data.description,
            stock: data.stock,
            id_category: data.id_category,
            images: data.images,
          };
        } else {
          return item;
        }
      })
    );

    const updatedCart = {
      ...cart.toObject(),
      products: updatedProducts
    };

    res.status(200).send(updatedCart);
  } catch (error) {
    res.status(500).send('Error removing product(s)');
  }
};

exports.UpdateProducts = async (req, res) => {
  try {
    const userID = req.userId;
    const { id_product, color, quantity } = req.body; // Lấy product ID, color, và quantity từ request body

    let cart = await Cart.findOne({ id_user: userID });
    if (!cart) {
      return res.status(404).send('Cart not found');
    }

    const productIndex = cart.products.findIndex(p => p.id_product.toString() === id_product && p.color === color);
    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;

      if (cart.products[productIndex].quantity <= 0) {
        cart.products.splice(productIndex, 1);
      }
    } else if (quantity > 0) {
      cart.products.push({ id_product, color, quantity });
    }

    await cart.save();

    const updatedProducts = await Promise.all(
      cart.products.map(async (item) => {
        const productId = item.id_product.toString();
        const product = await axios.get(`${PRODUCT_SERVICE_URL}/products/get-one-by-id/${productId}`);
        if (product) {
          const data = product.data.product;
          return {
            ...item.toObject(), // Chuyển đổi item thành đối tượng để có thể chỉnh sửa
            name_product: data.name_product,
            price_product: data.price_product,
            image: data.image,
            description: data.description,
            stock: data.stock,
            id_category: data.id_category,
            images: data.images,
          };
        } else {
          return item;
        }
      })
    );

    const updatedCart = {
      ...cart.toObject(),
      products: updatedProducts
    };

    res.status(200).send(updatedCart);
  } catch (error) {
    console.error('Error updating product quantity:', error);
    res.status(500).send(`Error updating product quantity: ${error}`);
  }
};
