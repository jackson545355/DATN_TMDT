const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password, fullName, phone, address, gender, Birth} = req.body;

    // Kiểm tra người dùng đã tồn tại
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, errors: 'User already exists' });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo người dùng mới
    user = new User({
      username,
      email,
      password: hashedPassword,
      fullName,
      phone,
      address,
      gender,
      Birth
    });

    await user.save();

    // Tạo token
    const payload = { userId: user.id };
    const token = jwt.sign(payload, 'secretKey', { expiresIn: '1h' });

    // Trả về JSON hợp lệ
    res.status(201).json({ success: true, message: 'User registered successfully', token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, errors: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body; // Đổi từ user thành username
    console.log(req.body);

    // Kiểm tra người dùng
    let user = await User.findOne({ username }); // Đổi từ user thành username
    console.log(user);
    if (!user) {
      return res.status(400).json({ success: false, errors: 'Invalid Credentials Username' });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password); // Sửa user thành user
    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).json({ success: false, errors: 'Invalid Credentials Password' });
    }

    // Tạo token
    const payload = { userId: user.id };
    const token = jwt.sign(payload, 'secretKey', { expiresIn: '1h' });

    // Trả về JSON hợp lệ
    res.json({ success: true, token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, errors: 'Server error' });
  }
};

// Lấy thông tin người dùng
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, errors: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, errors: 'Server error' });
  }
};

// Cập nhật thông tin người dùng
exports.updateProfile = async (req, res) => {
  const { fullName, phone, address, reliability, gender, birth } = req.body;
  // console.log(req.body)
  try {
    let user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, errors: 'User not found' });
    }

    user.fullName = fullName || user.fullName;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.reliability = reliability || user.reliability;
    user.gender = gender || user.gender
    user.Birth = birth || user.Birth;


    await user.save();

    res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, errors: 'Server error' });
  }
};

// Lấy danh sách toàn bộ người dùng
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Không trả về mật khẩu
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Lấy tên đầy đủ của người dùng theo ID
exports.getNameById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('fullName');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, fullName: user.fullName });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Lấy tên đầy đủ của người dùng theo ID
exports.getAvatarsByUsernames = async (req, res) => {
  try {
    const { userNames } = req.query; // Lấy từ query thay vì body
    if (!userNames || userNames.length === 0) {
      return res.status(400).json({ success: false, error: 'No usernames provided' });
    }

    // Tìm các user dựa trên danh sách username
    const users = await User.find({ username: { $in: userNames } }).select('username profileImage');
    res.json(users);
  } catch (error) {
    console.error('Error fetching avatars:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};



exports.updateProfileImage = async (req, res) => {
  const userId = req.userId

  const profileImageUrl = req.file ? req.file.location : null;

  if (!profileImageUrl) {
    return res.status(400).json({ success: false, message: 'No file uploaded or file not found.' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: profileImageUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating profile image:', error);
    res.status(500).json({ success: false, error: 'Error updating profile image' });
  }
};