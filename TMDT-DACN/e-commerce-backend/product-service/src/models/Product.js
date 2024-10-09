const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name_product: {
    type: String,
    required: true,
  },
  price_product: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  model3D: {
    // Thêm trường mới để lưu URL mô hình 3D
    type: String,
    required: false, // Có thể không bắt buộc tùy theo yêu cầu
  },
  brand: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // number: {
  //   type: mongoose.Decimal128,
  //   required: true,
  // },
  colors: [
    {
      color: {
        type: String,
        required: true,
      },
      stock: {
        type: Number,
        required: true,
      },
    },
  ], // Thêm trường màu sắc và tồn kho cho mỗi màu
  totalStock: {
    type: Number,
    default: 0,
  },
  id_category: {
    type: Number,
    enum: [0, 1, 2],
    required: true,
  },
  comments: [
    new Schema(
      {
        user: {
          userid: {
            type: String,
            ref: "User",
          },
          username: {
            type: String,
          },
          profileImage: {
            type: String,
          },
        },
        comment: {
          type: String,
          required: false,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
      { _id: false }
    ),
  ],
  numberSold: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
