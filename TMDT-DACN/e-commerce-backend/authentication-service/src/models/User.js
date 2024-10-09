const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: ''
  },
  fullName: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  gender:{
    type: String,
    default: "",
  },
  Birth:{
    type: String,
    default: "",
  }
});

module.exports = mongoose.model('User', UserSchema);
