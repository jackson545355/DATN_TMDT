const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  id_user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    default: 'active'
  },
  modifiedOn: {
    type: Date,
    default: Date.now
  },
  products: [
    new Schema ({
      id_product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      },
      color: {
        type: String,
        default: ""
      }
    }, {_id: false})
  ],
});

CartSchema.pre('save', function (next) {
  this.modifiedOn = Date.now();
  next();
});

module.exports = mongoose.model('Cart', CartSchema);
