const Trade = require('../models/trade.model');
const Lot = require('../models/lot.model');
const { realizeFIFO } = require('../services/fifoLotService');
const { realizeLIFO } = require('../services/lifoLotService');

exports.createTrade = async (req, res) => {
  try {
    const { stock_name, quantity, broker_name, price, method } = req.body;
    const amount = quantity * price;
    const trade = new Trade({ stock_name, quantity, broker_name, price, amount });
    await trade.save();

    if (quantity > 0) {
      const lot = new Lot({
        trade_id: trade._id,
        stock_name,
        lot_quantity: quantity,
        method
      });
      await lot.save();
    } else {
      if (method === 'FIFO') await realizeFIFO(stock_name, quantity, trade._id);
      else await realizeLIFO(stock_name, quantity, trade._id);
    }

    res.status(201).json({ message: 'Trade created', trade });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllTrades = async (req, res) => {
  try {
    const trades = await Trade.find().sort({ createdAt: -1 });
    res.json(trades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTradeById = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade) return res.status(404).json({ error: 'Trade not found' });
    res.json(trade);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTrade = async (req, res) => {
  try {
    const trade = await Trade.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!trade) return res.status(404).json({ error: 'Trade not found' });
    res.json({ message: 'Trade updated', trade });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTrade = async (req, res) => {
  try {
    const trade = await Trade.findByIdAndDelete(req.params.id);
    if (!trade) return res.status(404).json({ error: 'Trade not found' });
    res.json({ message: 'Trade deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.bulkUpload = async (req, res) => {
  try {
    const trades = req.body.trades;
    if (!Array.isArray(trades)) return res.status(400).json({ error: 'Trades must be an array' });

    for (const t of trades) {
      const { stock_name, quantity, broker_name, price, method } = t;
      const amount = quantity * price;
      const trade = new Trade({ stock_name, quantity, broker_name, price, amount });
      await trade.save();

      if (quantity > 0) {
        const lot = new Lot({
          trade_id: trade._id,
          stock_name,
          lot_quantity: quantity,
          method
        });
        await lot.save();
      } else {
        if (method === 'FIFO') await realizeFIFO(stock_name, quantity, trade._id);
        else await realizeLIFO(stock_name, quantity, trade._id);
      }
    }

    res.status(201).json({ message: 'Bulk trades uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
