const mongoose = require('mongoose');
require('dotenv').config()
const Lot = require('../../src/models/lot.model');
const { realizeFIFO } = require('../../src/services/fifoLotService');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
});

afterEach(async () => {
  await Lot.deleteMany({});
});


afterAll(async () => {
  await mongoose.disconnect();
});

describe('FIFO Lot Realization', () => {
  let lot1, lot2, sellTradeId;

  beforeEach(async () => {
    await Lot.deleteMany({});

    // Insert two FIFO lots
    lot1 = await Lot.create({
      stock_name: 'AAPL',
      lot_quantity: 100,
      realized_quantity: 0,
      realized_trades: [],
      lot_status: 'OPEN',
      method: 'FIFO',
      trade_id: new mongoose.Types.ObjectId(), 
      timestamp: new Date('2024-01-01T10:00:00Z')
    });

    lot2 = await Lot.create({
      stock_name: 'AAPL',
      lot_quantity: 50,
      realized_quantity: 0,
      realized_trades: [],
      lot_status: 'OPEN',
      method: 'FIFO',
      trade_id: new mongoose.Types.ObjectId(), 
      timestamp: new Date('2024-01-02T10:00:00Z')
    });

    sellTradeId = new mongoose.Types.ObjectId(); // Fake sell trade id
  });

  it('should realize quantity FIFO style', async () => {
    await realizeFIFO('AAPL', -120, sellTradeId);

    const updatedLots = await Lot.find({ stock_name: 'AAPL' }).sort({ timestamp: 1 });

    expect(updatedLots[0].realized_quantity).toBe(100);
    expect(updatedLots[0].lot_status).toBe('FULLY REALIZED');
    expect(updatedLots[0].realized_trades).toContainEqual(sellTradeId);

    expect(updatedLots[1].realized_quantity).toBe(20);
    expect(updatedLots[1].lot_status).toBe('PARTIALLY REALIZED');
    expect(updatedLots[1].realized_trades).toContainEqual(sellTradeId);
  });

  it('should not over-realize lots', async () => {
    await realizeFIFO('AAPL', -10, sellTradeId);

    const updatedLot = await Lot.findById(lot1._id);

    expect(updatedLot.realized_quantity).toBe(10);
    expect(updatedLot.lot_status).toBe('PARTIALLY REALIZED');
  });
});
