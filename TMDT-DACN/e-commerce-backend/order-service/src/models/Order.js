const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      stock: Number,
      colors: String,
      reviewed: {
        type: Boolean,
        default: false
      }
    },
  ],
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'shipping', 'completed', 'cancelled'],
    default: 'pending',
  },
  total: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  subtotal: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updateTime: {
    shipping: {
      type: Date,
      default: null
    },
    completed: {
      type: Date,
      default: null
    },
    cancelled: {
      type: Date,
      default: null
    },
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'thanh toán thẻ','Chưa thanh toán'],
    required: false
  },
  // refund: {
  //   date: {
  //     type: Date,
  //     default: null
  //   },
  //   status: {
  //     type: String,
  //     enum: ['pending', 'processed', 'failed',''],
  //     default: ''
  //   }
  // },
  Phone: {
    type: String,
    default: "",
  }
});

OrderSchema.virtual('month').get(function () {
  return this.createdAt.getMonth() + 1; // Tháng trong JavaScript là từ 0 đến 11
});

OrderSchema.set('toJSON', { virtuals: true });
OrderSchema.set('toObject', { virtuals: true });

OrderSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    const now = new Date();
    now.setHours(now.getHours() + 7);
    if (this.status === 'shipping') {
      this.updateTime.shipping = now;
    } else if (this.status === 'completed') {
      this.updateTime.completed = now;
    } else if (this.status === 'cancelled') {
      this.updateTime.cancelled = now;
    }
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
