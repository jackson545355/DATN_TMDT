const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Kiểm tra và tạo thư mục 'uploads/' nếu chưa tồn tại
const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// In đường dẫn của thư mục 'uploads/' ra console
console.log('Upload directory:', uploadDir);

// Cấu hình Multer để lưu file tạm thời trước khi xử lý
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const uploadFile = multer({ storage });

module.exports = uploadFile;
