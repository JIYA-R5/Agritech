const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const truckSchema = new mongoose.Schema({
  truckNumber: String,
  driverName: String,
  cropName: String,
  status: String,
  currentLocation: String,
  temperature: Number,
  tempStatus: String,
  fromCity: String,
  toCity: String,
  startTime: String,
  expectedArrival: String
}, { timestamps: true });

const Truck = mongoose.models.Truck || mongoose.model('Truck', truckSchema);

// GET all trucks
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    const trucks = await Truck.find();
    res.json(trucks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new truck
router.post('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const newTruck = new Truck(req.body);
    await newTruck.save();
    res.json(newTruck);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;