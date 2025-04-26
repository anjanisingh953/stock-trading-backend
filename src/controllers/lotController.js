const Lot = require('../models/lot.model');

exports.getLotsByMethod = async (req, res) => {
  try {
    const { method } = req.params;
    const lots = await Lot.find({ method }).populate('trade_id').populate('realized_trades');
    res.json(lots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
