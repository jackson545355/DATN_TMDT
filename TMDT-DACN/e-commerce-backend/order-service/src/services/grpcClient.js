const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

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

// Tạo gRPC client
const client = new productProto.ProductService(
  'localhost:50051',  // Sử dụng 'localhost' thay vì '::1' để kết nối tới IPv4 loopback.
  grpc.credentials.createInsecure()
);

module.exports = client;
