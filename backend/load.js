const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const loadSchema = new mongoose.Schema({
  cropName: String,
  cropEmoji: String,
  fromCity: String,
  toCity: String,
  status: String
}, { timestamps: true });

const Load = mongoose.models.Load || mongoose.model('Load', loadSchema);

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    const loads = await Load.find();
    res.json(loads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const newLoad = new Load(req.body);
    await newLoad.save();
    res.json(newLoad);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;