const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Nên thêm unique để đảm bảo tên người dùng không trùng lặp
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Admin', AdminSchema);
