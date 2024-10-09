const mongoose = require('mongoose');
const dotenv = require('dotenv');
//const Order = require('../models/Order'); // Đường dẫn đến model của bạn

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
})
  .then(() => {
    console.log('Connected to MongoDB');
    //updateDatabase(); // Gọi hàm updateDatabase sau khi kết nối thành công
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

// async function updateDatabase() {
//   try {
//     // Cập nhật tất cả các tài liệu thiếu trường updateTime
//     await Order.updateMany(
//       { refund: { $exists: false } },
//       {
//         $set: {
//           refund: {
//             date: null,
//             status: ''
//           }
//         }
//       }
//     );

//     console.log('Database update completed.');
//     mongoose.connection.close();
//   } catch (err) {
//     console.error('Error updating database:', err);
//     mongoose.connection.close();
//   }
// }

