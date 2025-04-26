const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  stock_name: { type: String, required: true },
  quantity: { type: Number, required: true },
  broker_name: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Trade', tradeSchema);
