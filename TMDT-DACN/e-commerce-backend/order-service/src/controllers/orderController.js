const Order = require('../models/Order');
const Product = require('../models/Product');
const axios = require('axios');
const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { exec } = require('child_process');
const path = require('path');
const grpcClient = require('../services/grpcClient');

exports.createOrder = async (req, res) => {
  const { products, address, phone, paymentMethod, subtotal, discount, total  } = req.body;
  const createdAt = req.body.createdAt ? new Date(req.body.createdAt) : new Date();
  const status = req.body.status ? req.body.status : 'pending';
  // const userId = req.userId;
  // const session = await mongoose.startSession();
  // session.startTransaction();

  // try {
  //   let sum = 0; // Tính subtotal
  //   for (const item of products) {
  //     const stockProduct = await axios.get(`http://localhost:3002/products/get-one-by-id/${item.product}`);
  //     const productData = stockProduct.data.product;

  const address1 = address;
  const userId = req.userId;
  // const session = await mongoose.startSession();
  // session.startTransaction();
  let sum = 0;
  //console.log("item", products);

  try {
    // Kiểm tra và cập nhật số lượng tồn kho cho mỗi sản phẩm bằng cách gọi gRPC tới product-service
    for (const item of products) {
      // Sử dụng gRPC client để gọi GetProductById
      const stockProduct = await new Promise((resolve, reject) => {
        grpcClient.GetProductById({ product_id: item.product }, (error, response) => {
          if (error) return reject(error);
          resolve(response);
        });
      });
      const productData = stockProduct.product;
      //console.log(productData)
      // Kiểm tra tồn kho
      const colorObject = productData.colors.find(color => color.color === item.colors);
      if (colorObject.stock < item.stock) {
        // await session.abortTransaction();
        // session.endSession();
        return res.status(400).json({ success: false, error: 'Insufficient stock for product' });
      }
      // colorObject.stock -= item.stock;
      // productData.numberSold += item.stock;

      sum += productData.price_product * item.stock; // Cập nhật subtotal
      // const response = await axios.put(`http://localhost:3002/products/update-one-by-id/${item.product}`, productData, {
      //   headers: { "Content-Type": "application/json" }
      // });

      // if (response.status !== 200) {
      // // Cập nhật tồn kho và số lượng đã bán
      colorObject.stock -= item.stock;
      productData.numberSold += item.stock;
      //sum += parseFloat(productData.price_product) * item.stock; // Chuyển đổi giá sản phẩm sang số thực nếu cần
      // console.log(productData)
      // Sử dụng gRPC client để gọi UpdateProductById
      // const updateResponse = await new Promise((resolve, reject) => {
      //   console.log("--------------------")
      //   grpcClient.UpdateProductById({ product_id: item.product, product: productData }, (error, response) => {
      //     if (error) return reject(error);
      //     resolve(response);
      //   });
      //});
      console.log("aaaaaaaaaaaaaaaaaaaaa")
      const response = await axios.put(`http://localhost:3002/products/update-one-by-id/${item.product}`, productData, {
        headers: { "Content-Type": "application/json" }
      });
      console.log(response)
      if (!response.data.success) {
        // await session.abortTransaction();
        // session.endSession();
        return res.status(400).json({ success: false, error: 'Failed to update product stock' });
      }
    }

    // Tạo đơn hàng
    // const order = new Order({ user: userId, products, total: sum, address: address1, Phone: phone, paymentMethod: paymentMethod || 'COD', createdAt: createdAt, status: status });
    // await order.save({ session });
    // Tính toán discount và total
    //const subtotal = parseFloat(req.body.subtotal) || 0; // Chuyển đổi về số hoặc đặt giá trị mặc định là 0 nếu không hợp lệ
    const discount = subtotal * 0.2; // Ví dụ giảm giá 10% nếu subtotal trên 1,000,000₫
    const total = subtotal - discount;
    // const discount1 = discount
    console.log("111111111111")
    // Tạo đơn hàng với subtotal, discount, và total
    const order = new Order({
      user: userId,
      products,
      address: address1,
      phone: phone,
      paymentMethod: paymentMethod || 'COD',
      createdAt: createdAt,
      status: status,
      subtotal: subtotal, // Thêm subtotal vào đơn hàng
      discount: discount, // Thêm discount vào đơn hàng
      total: total, // Thêm total vào đơn hàng
    });

    // console.log(order);

    await order.save();
    // await session.commitTransaction();
    //session.endSession();
    res.status(201).json({ success: true, order });
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    // await session.abortTransaction();
    // session.endSession();
    res.status(500).json({ success: false, error: error.message });
  }
};

// exports.createOrder = async (req, res) => {
//   const { products, address, phone, paymentMethod, subtotal, discount, total } = req.body;
//   const createdAt = req.body.createdAt ? new Date(req.body.createdAt) : new Date();
//   const status = req.body.status ? req.body.status : 'pending';
//   const userId = req.userId;
//   let sum = 0;

//   try {
//     // Kiểm tra và cập nhật số lượng tồn kho cho mỗi sản phẩm
//     for (const item of products) {
//       // Lấy thông tin sản phẩm từ API
//       const stockProduct = await axios.get(`http://localhost:3002/products/get-one-by-id/${item.product}`);
//       const productData = stockProduct.data.product;

//       // Kiểm tra tồn kho
//       const colorObject = productData.colors.find(color => color.color === item.colors);
//       if (!colorObject || colorObject.stock < item.stock) {
//         return res.status(400).json({ success: false, error: 'Insufficient stock for product' });
//       }

//       // Cập nhật tồn kho và số lượng đã bán
//       colorObject.stock -= item.stock;
//       productData.numberSold += item.stock;
//       sum += productData.price_product * item.stock;

//       // Cập nhật thông tin sản phẩm qua API
//       const response = await axios.put(`http://localhost:3002/products/update-one-by-id/${item.product}`, productData, {
//         headers: { "Content-Type": "application/json" }
//       });
      
//       if (!response.data.success) {
//         return res.status(400).json({ success: false, error: 'Failed to update product stock' });
//       }
//     }

//     // Tính toán discount và total
//     const calculatedDiscount = subtotal * 0.2; // Ví dụ giảm giá 20% nếu subtotal trên 1,000,000₫
//     const calculatedTotal = subtotal - calculatedDiscount;

//     // Tạo đơn hàng
//     const order = new Order({
//       user: userId,
//       products,
//       address: address,
//       phone: phone,
//       paymentMethod: paymentMethod || 'COD',
//       createdAt: createdAt,
//       status: status,
//       subtotal: subtotal,
//       discount: calculatedDiscount,
//       total: calculatedTotal,
//     });

//     await order.save();
//     res.status(201).json({ success: true, order });
//     return order;
//   } catch (error) {
//     console.error('Error creating order:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };


exports.updateNumberSold = async (productId, quantitySold) => {
  try {
    // const productResponse = await axios.get(`http://localhost:3002/products/get-one-by-id/${productId}`);
    // const productData = productResponse.data.product;
    // productData.numberSold += quantitySold;
    // await axios.put(`http://localhost:3002/products/update-one-by-id/${productId}`, productData, {
    //   headers: { "Content-Type": "application/json" }
    // });
    // Sử dụng gRPC client để gọi GetProductById
    const productResponse = await new Promise((resolve, reject) => {
      grpcClient.GetProductById({ product_id: productId }, (error, response) => {
        if (error) return reject(error);
        resolve(response);
      });
    });

    const productData = productResponse.product;
    productData.numberSold += quantitySold;

    // Sử dụng gRPC client để gọi UpdateProductById
    await new Promise((resolve, reject) => {
      grpcClient.UpdateProductById({ product_id: productId, product: productData }, (error, response) => {
        if (error) return reject(error);
        resolve(response);
      });
    });
  } catch (error) {
    console.error('Error updating number sold:', error);
  }
}

// Lấy danh sách tất cả các đơn hàng
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().select();
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Lấy danh sách các đơn hàng của người dùng hiện tại
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('user products.product');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateReviewStatus = async (req, res) => {
  const { productId, reviewed } = req.body;

  try {
    const order = await Order.findOneAndUpdate(
      { "products.product": productId },
      { $set: { "products.$.reviewed": reviewed } },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getOrdersByID = async (req, res) => {
  try {
    const OrderID = req.params.id
    if (!mongoose.Types.ObjectId.isValid(OrderID)) {
      return res.status(400).send('Invalid Order ID');
    }

    const Orders = await Order.findById(OrderID);
    if (!Orders) {
      return res.status(404).send(`Product not found by id ${OrderID}`);
    }
    res.json({ success: true, Orders });
  } catch (error) {
    res.status(500).send('Error fetching product');
  }
};

// Cập nhật trạng thái đơn hàng
exports.deleteOrderByID = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).send('Delete Successfully');
  } catch (error) {
    res.status(500).send('Error deleting product');
  }
};

exports.getOrderByUserID = async (req, res) => {
  const userId = req.userId;

  try {
    // Tìm tất cả đơn hàng của người dùng dựa trên userId
    const orders = await Order.find({ user: userId }).populate('products');

    if (!orders) {
      return res.status(404).json({ success: false, error: 'Orders not found' });
    }

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

var accessKey = 'F8BBA842ECF85';
var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';

exports.payMomo = async (req, res) => {
  // MoMo API parameters
  var orderInfo = 'Pay with MoMo';
  var partnerCode = 'MOMO'; 
  var partnerName = 'MEGA';
  var redirectUrl = 'http://localhost:3015/myorder';
  var ipnUrl = 'http://localhost:3003/orders/callback';
  var requestType = "payWithMethod";
  var amount = req.body.amount || 2000;
  var orderId = partnerName + req.body.orderId;
  var requestId = orderId;
  var extraData = '';
  var autoCapture = true;
  var lang = 'vi';
  // Signature
  var rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

  console.log("--------------------RAW SIGNATURE----------------")
  console.log(rawSignature)

  var signature = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  console.log("--------------------SIGNATURE----------------")
  console.log(signature)
  var expiredTime = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  // JSON object to send to MoMo API
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "MEGA",
    storeId: "MomoMEGA",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: '',
    signature: signature,
    responseTime: expiredTime
  });

  console.log("--------------------REQUEST BODY----------------")
  console.log(requestBody)

  // Option for axios
  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody)
    },
    data: requestBody
  };

  try {
    const result = await axios(options);
    return res.status(200).json(result.data);
  } catch (error) {
    console.error('Error making MoMo payment request:', error.response ? error.response.data : error.message);
    return res.status(500).json({
      statusCode: 500,
      message: "server error"
    });
  }
}

exports.callback = async (req, res) => {
  console.log('MoMo callback request body:');
  console.log(req.body);
  return res.status(200).json(req.body);
};

exports.transactionStatus = async (req, res) => {
  const { orderId, requestId } = req.body;
  const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = JSON.stringify({
    partnerCode: 'MOMO',
    requestId: orderId,
    orderId: orderId,
    signature: signature,
    lang: 'vi',
  });

  const options = {
    method: 'POST',
    url: 'https://test-payment.momo.vn/v2/gateway/api/query',
    headers: {
      'Content-Type': 'application/json',
    },
    data: requestBody,
  };

  try {
    const result = await axios(options);
    console.log('MoMo transaction status response:', result.data);
    if (result.data) {
      return res.status(200).json(result.data);
    } else {
      return res.status(400).json({ message: 'Failed to create MoMo payment URL' });
    }
  } catch (error) {
    console.error('Error making MoMo payment request:', error.response ? error.response.data : error.message);
    return res.status(500).json({
      statusCode: 500,
      message: "server error"
    });
  }
};

// Các hàm khác trong orderController
exports.updateOrderStatus = async (req, res) => {
  const { id, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid Order ID');
  }

  if (!['pending', 'shipping', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).send('Invalid status');
  }

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).send(`Order not found by id ${id}`);
    }

    // Cập nhật status
    order.status = status;

    // Lưu lại order để kích hoạt middleware 'pre-save'
    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error during order status update:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateProductStocks = async (req, res) => {
  const { orderId } = req.body;
  console.log("orderId", orderId)

  try {
    // Tìm đơn hàng theo ID
    const order = await Order.findById(orderId);
    console.log("order", order)
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Duyệt qua từng sản phẩm trong đơn hàng
    for (const item of order.products) {
      console.log("item", item);
      // Truy xuất thông tin sản phẩm từ API hoặc từ database
      const stockProduct = await axios.get(`http://localhost:3002/products/get-one-by-id/${item.product}`);
      const productData = stockProduct.data.product;
    
      if (!productData) {
        console.error(`Product not found for item ${item.product}`);
        continue; // Bỏ qua vòng lặp này nếu không tìm thấy sản phẩm
      }
    
      // Tìm màu tương ứng của sản phẩm
      const productColor = productData.colors.find(c => c.color === item.colors);
    
      if (productColor) {
        productColor.stock += item.stock; // Tăng số lượng stock của sản phẩm theo màu
        productData.totalStock += item.stock; // Cập nhật tổng số lượng tồn kho
      } else {
        console.error(`Color ${item.colors} not found in product ${item.product}`);
        continue; // Bỏ qua vòng lặp này nếu không tìm thấy màu
      }
    
      // Cập nhật thông tin sản phẩm vào database qua API
      try {
        const response = await axios.put(
          `http://localhost:3002/products/update-one-by-id/${item.product}`,
          productData, // Gửi toàn bộ dữ liệu sản phẩm đã cập nhật
          {
            headers: { "Content-Type": "application/json" }
          }
        );
    
        if (response.status !== 200) {
          console.error(`Failed to update stock for product ${item.product}`);
          // Có thể thực hiện các hành động bổ sung nếu cần thiết (như log lỗi hoặc thông báo cho người dùng)
        }
      } catch (updateError) {
        console.error(`Error updating product ${item.product}:`, updateError.message);
      }
    }
    

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating product stocks:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.predictProduct = async (req, res) => {
  const scriptPath = path.join(__dirname, 'PredictGrowth.py'); // Tạo đường dẫn tuyệt đối
  exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('Internal Server Error');
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send('Internal Server Error');
    }
    const predictions = JSON.parse(stdout);
    res.json({ success: true, predictedData: predictions });
  });
};

exports.predictRevenue = async (req, res) => {
  const scriptPath = path.join(__dirname, 'PredictRevenue.py');
  exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('Internal Server Error');
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send('Internal Server Error');
    }
    const predictions = JSON.parse(stdout);
    res.json({ success: true, predictedData: predictions });
  });
};

exports.generateFakeOrders = async (req, res) => {
  try {
    const { numberOfOrders, fixedDate } = req.body;

    // Gọi API để lấy tất cả sản phẩm từ service product
    const productResponse = await axios.get('http://localhost:3002/products/getAll');
    let products = productResponse.data.products;

    // Gọi API để lấy tất cả user từ service auth
    const userResponse = await axios.get('http://localhost:3001/auth/users');
    const users = userResponse.data.users;
    const statusOptions = ['pending', 'shipping', 'completed'];
    const orders = [];

    for (let i = 0; i < numberOfOrders; i++) {
      const randomProducts = [];
      const randomProductCount = faker.number.int({ min: 1, max: 5 });

      for (let j = 0; j < randomProductCount; j++) {
        const randomProductIndex = Math.floor(Math.random() * products.length);
        const randomProduct = products[randomProductIndex];

        if (randomProduct.colors.length > 0) {
          const chosenColorIndex = faker.number.int({ min: 0, max: randomProduct.colors.length - 1 });
          const chosenColor = randomProduct.colors[chosenColorIndex];

          if (chosenColor.stock > 0) {
            const orderStock = faker.number.int({ min: 1, max: chosenColor.stock });
            products[randomProductIndex].colors[chosenColorIndex].stock -= orderStock;

            randomProducts.push({
              product: randomProduct._id,
              stock: orderStock,
              colors: chosenColor.color,
            });
          }
        }
      }

      const randomUser = users[Math.floor(Math.random() * users.length)];

      if (randomProducts.length > 0) {
        const orderData = {
          userId: randomUser._id,
          products: randomProducts,
          address: faker.location.streetAddress(),
          phone: randomUser.phone || faker.phone.number(),
          paymentMethod: faker.helpers.arrayElement(['COD', 'thanh toán thẻ', 'Chưa thanh toán']),
          createdAt: fixedDate ? new Date(fixedDate) : new Date(),
          status: faker.helpers.arrayElement(statusOptions)
        };

        const order = await createOrderHelper(orderData);
        orders.push(order);
      }
    }

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error generating fake orders:', error);
    res.status(500).json({ success: false, error: 'Error generating fake orders' });
  }
};


// Helper function to create order
async function createOrderHelper(orderData) {
  try {
    const req = { body: orderData, userId: orderData.userId };
    const res = {
      status: function () { return this; },
      json: function (data) { return data.order; }
    };

    // Call the original createOrder function
    const order = await exports.createOrder(req, res);
    console.log(order)
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}


// Hàm tạo thời gian ngẫu nhiên giữa hai khoảng thời gian
const getRandomDateBetween = (startDate, endDate) => {
  const randomTime = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
  return randomTime;
};

exports.autoUpdateOrderTimes = async (req, res) => {
  try {
    // Lấy tất cả đơn hàng từ cơ sở dữ liệu
    const orders = await Order.find({});

    let updatedOrders = [];

    for (let order of orders) {
      let hasUpdate = false;

      // Kiểm tra và cập nhật thời gian shipping cho đơn hàng "completed" nếu chưa có
      if (order.status === 'completed' && !order.updateTime.shipping && order.updateTime.completed) {
        // Thời gian shipping được tạo ngẫu nhiên trong khoảng giữa createdAt và completedTime
        order.updateTime.shipping = getRandomDateBetween(order.createdAt, order.updateTime.completed);
        hasUpdate = true;
      }

      // Kiểm tra và cập nhật thời gian shipping nếu chưa có (cho các đơn hàng "shipping")
      if (order.status === 'shipping' && !order.updateTime.shipping) {
        // Thời gian shipping phải sau createdAt từ 1 đến 48 giờ
        order.updateTime.shipping = getRandomDateBetween(order.createdAt, new Date());
        hasUpdate = true;
      }

      // Kiểm tra và cập nhật thời gian completed nếu chưa có (cho các đơn hàng "completed")
      if (order.status === 'completed' && !order.updateTime.completed) {
        // Thời gian completed được tạo sau shipping hoặc createdAt (nếu chưa có shipping) từ 1 đến 72 giờ
        if (order.updateTime.shipping) {
          order.updateTime.completed = getRandomDateBetween(order.updateTime.shipping, new Date());
        } else {
          order.updateTime.completed = getRandomDateBetween(order.createdAt, new Date());
        }
        hasUpdate = true;
      }

      // Đảm bảo thời gian shipping phải trước thời gian completed
      if (order.updateTime.shipping && order.updateTime.completed && new Date(order.updateTime.shipping) > new Date(order.updateTime.completed)) {
        // Điều chỉnh lại thời gian shipping để trước thời gian completed
        order.updateTime.shipping = getRandomDateBetween(order.createdAt, order.updateTime.completed);
        hasUpdate = true;
      }

      // Nếu có bất kỳ thay đổi nào, lưu lại đơn hàng
      if (hasUpdate) {
        await order.save();
        updatedOrders.push(order);
      }
    }

    res.status(200).json({ success: true, message: 'Orders updated successfully', updatedOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating orders', error: error.message });
  }
};