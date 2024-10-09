const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const Product = require('./models/Product'); // Đảm bảo bạn đã khai báo đúng đường dẫn

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const GRPC_PORT = process.env.GRPC_PORT || '50051'; // Đặt cổng gRPC server từ biến môi trường hoặc sử dụng cổng mặc định 50051

// Middleware
app.use(express.json());
app.use(cors()); // Thêm middleware CORS

// Routes
app.use('/products', productRoutes);

// Connect to the database
require('./config/db');

// Khởi động HTTP server
app.listen(PORT, () => {
  console.log(`Product Service (HTTP) is running on port ${PORT}`);
});

// Khởi động gRPC server
const packageDefinition = protoLoader.loadSync(
  path.resolve(__dirname, './proto/product.proto'),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);
const productProto = grpc.loadPackageDefinition(packageDefinition).product;

const grpcServer = new grpc.Server();

grpcServer.addService(productProto.ProductService.service, {
  GetProductById: async (call, callback) => {
    try {
      const product = await Product.findById(call.request.product_id);
      if (!product) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: 'Product not found',
        });
      }
      callback(null, { product });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: error.message,
      });
    }
  },
  UpdateProductById: async (call, callback) => {
    try {
      const { product_id, product } = call.request;
      const updatedProduct = await Product.findByIdAndUpdate(product_id, product, { new: true });
      if (!updatedProduct) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: 'Failed to update product',
        });
      }
      callback(null, { success: true });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: error.message,
      });
    }
  },
  GetAllProducts: async (call, callback) => {
    try {
      const products = await Product.find();
      callback(null, { products });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: error.message,
      });
    }
  },
});

grpcServer.bindAsync(`0.0.0.0:${GRPC_PORT}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.error(`Failed to bind gRPC server: ${error}`);
    return;
  }
  console.log(`Product Service (gRPC) is running on port ${port}`);
  // Không cần gọi grpcServer.start() nữa
});

