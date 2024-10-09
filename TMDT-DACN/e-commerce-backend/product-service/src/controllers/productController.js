const axios = require('axios');
const mongoose = require("mongoose");
const Product = require("../models/Product");
const USER_SERVICE_URL = 'http://localhost:3001/auth';
const csv = require("csv-parser");
const xlsx = require("xlsx");
const fs = require("fs");

exports.createByFile = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  try {
    let products = [];
    let failedProducts = [];
    let successCount = 0;
    let promises = [];
    const parseProductData = async (row) => {
      const name_product = row.title;
      const price_product = row.price;
      const description = row.description || "Updating";
      const brand = row.brand || "Updating";
      const model3D = row.model3D || "Updating";
      const number = 0;
      const images = [
        row.imgUrl_1,
        row.imgUrl_2,
        row.imgUrl_3,
        row.imgUrl_4,
      ].filter(Boolean);
      let id_category = null;
      let colors = row.color.split(","); // Lấy giá trị colors từ row
      let totalStock = 0; // Khởi tạo biến totalStock

      // Kiểm tra và chuyển đổi colors từ chuỗi JSON sang mảng nếu cần
      if (typeof colors === "string") {
        // console.log(row.color);
        //   try {
        //     colors = JSON.parse(colors);
        //   } catch (error) {
        //     console.error("Error parsing colors:", error);
        //     throw new Error("Invalid input: colors must be a valid JSON array");
        //   }
      }
      // console.log(Array.isArray(colors));
      if (Array.isArray(colors)) {
        colors = colors.map((color) => ({
          color: color,
          stock: Math.floor(Math.random() * (50 - 30 + 1)) + 30,
        }));
        colors.forEach((color) => {
          totalStock += color.stock * Math.floor(Math.random()); // Cộng dồn số lượng tồn kho từ mỗi màu sắc
        });
      } else {
        console.error("Expected colors to be an array, but received:", colors);
        throw new Error("Invalid input: colors must be an array");
      }
      // console.log(colors);
      // Map category_id thành id_category dựa trên giá trị trong file

      const categoryMap = {
        0: [
          54, 55, 56, 57, 58, 60, 63, 64, 65, 66, 68, 69, 70, 71, 72, 73, 74,
          75, 76, 77, 78, 79, 80, 81, 82, 83, 185, 186, 187, 188, 189, 190, 191,
          192, 193, 194, 195, 196, 197, 241, 242, 243, 244, 245, 248, 249, 251,
          252, 253, 254, 255, 256, 259, 260, 261, 262, 263,
        ],
        1: [
          201, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215,
        ],
        2: [45, 46, 47, 48, 49, 50, 51, 52, 53],
      };

      for (let [key, value] of Object.entries(categoryMap)) {
        console.log("value",value);
        console.log(row.category_id);
        console.log(value.includes(JSON.parse(row.category_id)));
        if (value.includes(JSON.parse(row.category_id))) {
          id_category = key;
          console.log("id_cate",id_category);
          break;
        }
      }

      // Map dữ liệu từ row thành object sản phẩm
      try {
        const newProduct = new Product({
          name_product,
          price_product,
          description,
          number,
          id_category,
          brand, // Thêm trường brand
          images, // Sửa lại trường này thành mảng chứa URL ảnh
          model3D, // Thêm trường model3D để lưu URL mô hình 3D
          colors,
          totalStock,
        });

        await newProduct.save();
        successCount += 1; // Đếm số sản phẩm thành công
        console.log("successCount", successCount);
        return { success: true, product: newProduct };
        // res.status(201).json({ success: true, product: newProduct });
      } catch (error) {
        failedProducts.push(name_product ? name_product : "null");
        console.error("Error creating product:", error);
        console.log(name_product ? name_product : "null");
        console.log("arr", failedProducts);
        console.log("length", failedProducts.length);
        console.log("if", failedProducts.length > 0);
        // Đảm bảo rằng sản phẩm thất bại được thêm vào danh sách
        return { success: false, error: "Error creating product" };
        // res.status(500).json({ success: false, error: "Error creating product" });
      }
    };

    if (file.mimetype === "text/csv") {
      // Đọc file CSV
      await new Promise((resolve, reject) => {
        fs.createReadStream(file.path)
          .pipe(csv())
          .on("data", async (row) => {
            promises.push(parseProductData(row));
          })
          .on("end",() => {
            resolve();
        })
          .on("error", (error) => {
            reject(error);
        });
      });
      await Promise.all(promises);
    } else if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel"
    ) {
      // Đọc file Excel
      const workbook = xlsx.readFile(file.path);
      const sheet_name_list = workbook.SheetNames;
      sheet_name_list.forEach(function (y) {
        const worksheet = workbook.Sheets[y];

        const rows = xlsx.utils.sheet_to_json(worksheet);
        rows.forEach(async (row) => {
          promises.push(parseProductData(row));
        });
      });
      await Promise.all(promises);
      
    }
    // Kiểm tra kết quả và phản hồi
    if (failedProducts.length > 0 && successCount > 0) {
      console.log("alu");
      return res.status(201).json({
        success: false,
        message: "Some products could not be added",
        successCount,
        failedProducts,
      });
    } else if (successCount > 0 && failedProducts.length == 0) {
      console.log("ula");
      return res.status(201).json({
        success: true,
        message: "All products were added successfully",
        successCount,
      });
    }
    else if (failedProducts.length > 0 && successCount == 0){
      return res.status(500).json({ success: false, error: "Error creating product" });
    }
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({
      success: false,
      message: "Error processing file",
      error: error.message,
    });
  } finally {
    //   // Xóa file sau khi xử lý
    //   fs.unlinkSync(file.path);
  }
};

exports.createOneProduct = async (req, res) => {
  const {
    name_product,
    price_product,
    description,
    number,
    id_category,
    brand,
    model3D,
  } = req.body;
  const images = req.files.map((file) => file.location); // Lấy liên kết các ảnh đã upload lên S3
  console.log("Colors received:", typeof req.body.colors);
  let colors = req.body.colors; // Lấy giá trị colors từ body
  let totalStock1 = 0; // Khởi tạo biến totalStock

  // Kiểm tra và chuyển đổi colors từ chuỗi JSON sang mảng
  if (typeof colors === "string") {
    try {
      colors = JSON.parse(colors);
    } catch (error) {
      console.error("Error parsing colors:", error);
      return res.status(400).json({
        success: false,
        error: "Invalid input: colors must be a valid JSON array",
      });
    }
  }

  if (Array.isArray(colors)) {
    colors.forEach((color) => {
      totalStock1 += color.stock; // Cộng dồn số lượng tồn kho từ mỗi màu sắc
    });
  } else {
    console.error("Expected colors to be an array, but received:", colors);
    return res.status(400).json({
      success: false,
      error: "Invalid input: colors must be an array",
    });
  }

  try {
    const newProduct = new Product({
      name_product,
      price_product,
      description,
      number,
      id_category,
      brand, // Thêm trường brand
      images, // Sửa lại trường này thành mảng chứa URL ảnh
      model3D, // Thêm trường model3D để lưu URL mô hình 3D
      colors,
      totalStock: totalStock1,
    });

    await newProduct.save();
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, error: "Error creating product" });
  }
};

exports.createManyProduct = async (req, res) => {
  try {
    const result = await Product.insertMany(req.body);
    res.status(201).send(`Inserted records: ${result}`);
  } catch (error) {
    res.status(500).send("Error creating products");
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productID = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productID)) {
      return res.status(400).send("Invalid product ID");
    }

    const product = await Product.findById(productID);
    if (!product) {
      return res.status(404).send(`Product not found by id ${productID}`);
    }
    res.json({ success: true, product: product });
  } catch (error) {
    res.status(500).send("Error fetching product");
  }
};

exports.getProductByIds = async (req, res) => {
  try {
    const ids = req.params.ids
      .split(",")
      .filter((id) => mongoose.Types.ObjectId.isValid(id));
    if (ids.length === 0) {
      return res.status(400).send("Invalid product IDs");
    }
    const products = await Product.find({ _id: { $in: ids } });
    if (!products) {
      return res.status(404).send("Product not found");
    }
    res.json(products);
  } catch (error) {
    res.status(500).send("Error fetching product");
  }
};

exports.updateProduct = async (req, res) => {

  try {
    // Giả định colors nằm trong req.body, nếu không thì cần phải xử lý tương ứng
    let colors = req.body.colors;
    console.log(req.body);
    // Kiểm tra và chuyển đổi colors từ chuỗi JSON sang mảng nếu nó là một chuỗi
    if (typeof colors === "string") {
      try {
        colors = JSON.parse(colors);
        req.body.colors = colors; // Cập nhật lại trong body nếu parse thành công
      } catch (error) {
        console.error("Error parsing colors:", error);
        return res.status(400).json({
          success: false,
          error: "Invalid input: colors must be a valid JSON array",
        });
      }
    }

    // Tính toán totalStock từ mảng colors
    let totalStock = colors.reduce(
      (acc, colorItem) => acc + colorItem.stock,
      0
    );

    // Cập nhật sản phẩm và totalStock trong cùng một lần gọi cập nhật
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, totalStock }, // Cập nhật totalStock cùng lúc với các thông tin khác
      { new: true }
    );

    // console.log(updatedProduct);
    if (!updatedProduct) {
      return res.status(404).send("Product not found");
    }

    res.json({ success: true, updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Error updating product");
  }
};

// API để cập nhật nhiều sản phẩm
exports.updateManyProducts = async (req, res) => {
  try {
    const updates = req.body; // Dữ liệu cập nhật cho nhiều sản phẩm
    console.log(updates);
    const results = [];

    for (const update of updates) {
      const updatedProduct = await Product.findByIdAndUpdate(
        update._id,
        { $set: update },
        { new: true }
      );
      if (!updatedProduct) {
        console.error(`Product not found with id: ${update._id}`);
      } else {
        results.push(updatedProduct);
      }
    }

    res.json({ success: true, updatedProducts: results });
  } catch (error) {
    console.error("Error updating products:", error);
    res.status(500).send("Error updating products");
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).send("Delete Successfully");
  } catch (error) {
    res.status(500).send("Error deleting product");
  }
};
exports.addComment = async (req, res) => {
  const productId = req.params.id;
  // const { comment, rating } = req.body;
  const { comment, rating, username, image } = req.body;
  const userId = req.userId;
  const response = await axios.get(`${USER_SERVICE_URL}/users`);
  const users = response.data.users;
  const user = users.find(user => user._id === userId);
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const newComment = {
      user: user,
      comment,
      rating,
      date: new Date()
    };
    
    product.comments.push(newComment);
    await product.save();
    
    res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCommentsByProductId = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.userId;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, comments: product.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// exports.GetAll = async (req, res) => {
//   try {
//     // const products = await Product.find().select();
//     const products = await Product.find().limit(20);
//     res.json({ success: true, products });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

exports.GetAll = async (req, res) => {
  try {
    const products = await Product.find().select();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.GetLimit = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là 1
    const limit = parseInt(req.query.limit) || 1000; // Số lượng sản phẩm trên mỗi trang, mặc định là 100
    const skip = (page - 1) * limit; // Số lượng sản phẩm cần bỏ qua

    // Chỉ chọn những trường cần thiết để giảm lượng dữ liệu cần truyền tải
    const projection = {
      name_product: 1,
      price_product: 1,
      images: 1,
      brand: 1,
      id_category: 1,
    };

    // Lấy danh sách sản phẩm với lazy load và chỉ chọn những trường cần thiết
    const products = await Product.aggregate([
      {
        $match: {}, // Nếu cần lọc thêm điều kiện, có thể thêm vào đây
      },
      {
        $sort: { _id: 1 }, // Sắp xếp theo _id, có thể thay đổi cách sắp xếp tùy nhu cầu
      },
      {
        $group: {
          _id: "$id_category", // Nhóm theo category
          products: { $push: "$$ROOT" }, // Đẩy toàn bộ sản phẩm vào mảng
        },
      },
      {
        $project: {
          products: { $slice: ["$products", 200] }, // Lấy tối đa 200 sản phẩm từ mỗi category
        },
      },
      {
        $unwind: "$products", // Trả sản phẩm về dạng phẳng để dễ hiển thị
      },
      {
        $replaceRoot: { newRoot: "$products" }, // Thay thế root bằng sản phẩm
      },
      {
        $skip: skip, // Bỏ qua sản phẩm cho các trang trước đó
      },
      {
        $limit: limit, // Giới hạn số sản phẩm trả về cho trang hiện tại
      },
      {
        $project: projection, // Chỉ lấy các trường cần thiết
      },
    ]);

    // Đếm tổng số sản phẩm (có thể cache lại phần này để tối ưu thêm)
    const totalProducts = await Product.countDocuments();

    res.json({
      success: true,
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

