const mongoose = require('mongoose');

const lotSchema = new mongoose.Schema({
  trade_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Trade', required: true },
  stock_name: { type: String, required: true },
  lot_quantity: { type: Number, required: true },
  realized_quantity: { type: Number, default: 0 },
  realized_trades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trade' }],
  lot_status: { type: String, enum: ['OPEN', 'PARTIALLY REALIZED', 'FULLY REALIZED'], default: 'OPEN' },
  method: { type: String, enum: ['FIFO', 'LIFO'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Lot', lotSchema);