const Lot = require('../models/lot.model');

async function realizeLIFO(stock, quantity, tradeId) {
  const lots = await Lot.find({
    stock_name: stock,
    method: 'LIFO',
    lot_status: { $ne: 'FULLY REALIZED' }
  }).sort({ createdAt: -1 });

  let remainingQty = Math.abs(quantity);

  for (const lot of lots) {
    const available = lot.lot_quantity - lot.realized_quantity;
    const consume = Math.min(remainingQty, available);

    lot.realized_quantity += consume;
    lot.realized_trades.push(tradeId);
    lot.lot_status = lot.realized_quantity === lot.lot_quantity ? 'FULLY REALIZED' : 'PARTIALLY REALIZED';
    await lot.save();

    remainingQty -= consume;
    if (!remainingQty) break;
  }
}

module.exports = { realizeLIFO };
