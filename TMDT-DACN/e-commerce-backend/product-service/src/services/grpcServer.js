const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/Product'); // Đảm bảo đường dẫn đúng tới model Product

// Load protobuf
const packageDefinition = protoLoader.loadSync(
  path.resolve(__dirname, '../proto/product.proto'),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);
const productProto = grpc.loadPackageDefinition(packageDefinition).product;

// Implement gRPC server
const server = new grpc.Server();

server.addService(productProto.ProductService.service, {
  GetProductById: async (call, callback) => {
    try {
      console.log("2222222222222222222222222")
      const product = await Product.findById(call.request.product_id);
      if (!product) {
        return callback({
          code: grpc.status.NOT_FOUND,
          message: 'Product not found',
        });
      }

      // Kiểm tra và xử lý userid trong comments để tránh lỗi CastError
      product.comments = product.comments.map((comment) => {
        if (!comment.user.userid || !mongoose.Types.ObjectId.isValid(comment.user.userid)) {
          comment.user.userid = null; // Gán giá trị null nếu userid không hợp lệ
        } else {
          comment.user.userid = mongoose.Types.ObjectId(comment.user.userid);
        }
        return comment;
      });

      callback(null, { product });
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: error.message,
      });
    }
  },
  UpdateProductById: async (call, callback) => {
    console.log("dddddddddddddddddddd")
    try {
      const { product_id, product } = call.request;
      // // Kiểm tra và xử lý userid trong comments để tránh lỗi CastError
      // product.comments = product.comments.filter(comment => comment.user.userid && mongoose.Types.ObjectId.isValid(comment.user.userid));
      
      //Kiểm tra và xử lý userid trong comments để tránh lỗi CastError
      product.comments = product.comments.map((comment) => {
        if (!comment.user.userid || !mongoose.Types.ObjectId.isValid(comment.user.userid)) {
          comment.user.userid = null; // Gán giá trị null nếu userid không hợp lệ
        } else {
          comment.user.userid = mongoose.Types.ObjectId(comment.user.userid);
        }
        return comment;
      });
      
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

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('Product gRPC Server running at http://0.0.0.0:50051');
  server.start();
});
