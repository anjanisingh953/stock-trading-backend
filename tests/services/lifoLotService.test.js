// tests/services/lifoLotService.test.js
const mongoose = require('mongoose');
require('dotenv').config()
const Lot = require('../../src/models/lot.model');
const { realizeLIFO } = require('../../src/services/lifoLotService');
const Trade = require('../../src/models/trade.model');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
});
afterEach(async () => {
  await Lot.deleteMany({});
});


afterAll(async () => {
  await mongoose.disconnect();
});

describe('LIFO Lot Realization', () => {
  it('should realize quantity LIFO style', async () => {
    const trade = await Trade.create({
      stock_name: 'GOOG',
      quantity: 50,
      broker_name: 'Broker A',
      price: 100,
      amount: 5000
    });

    await Lot.create({
      trade_id: trade._id,
      stock_name: 'GOOG',
      lot_quantity: 50,
      method: 'LIFO'
    });

    const sellTrade = await Trade.create({
      stock_name: 'GOOG',
      quantity: -50,
      broker_name: 'Broker B',
      price: 110,
      amount: -5500
    });

    await realizeLIFO('GOOG', sellTrade.quantity, sellTrade._id);

    const updatedLots = await Lot.find({ stock_name: 'GOOG' }).sort({ createdAt: -1 });

    expect(updatedLots.length).toBeGreaterThan(0);  // Added this check
    expect(updatedLots[0].realized_quantity).toBe(50);
    expect(updatedLots[0].lot_status).toBe('FULLY REALIZED');
    expect(updatedLots[0].realized_trades).toContainEqual(sellTrade._id);
  });

  it('should not over-realize lots', async () => {
    const trade = await Trade.create({
      stock_name: 'GOOG',
      quantity: 30,
      broker_name: 'Broker C',
      price: 120,
      amount: 3600
    });

    await Lot.create({
      trade_id: trade._id,
      stock_name: 'GOOG',
      lot_quantity: 30,
      method: 'LIFO'
    });

    const sellTrade = await Trade.create({
      stock_name: 'GOOG',
      quantity: -100,
      broker_name: 'Broker D',
      price: 90,
      amount: -9000
    });

    await realizeLIFO('GOOG', sellTrade.quantity, sellTrade._id);

    const updatedLots = await Lot.find({ stock_name: 'GOOG' }).sort({ createdAt: -1 });

    for (const lot of updatedLots) {
      expect(lot.realized_quantity).toBeLessThanOrEqual(lot.lot_quantity);
    }
  });
});
