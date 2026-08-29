const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const warningSchema = new mongoose.Schema({
  type: String,
  message: String,
  resolved: { type: Boolean, default: false }
}, { timestamps: true });

const Warning = mongoose.models.Warning || mongoose.model('Warning', warningSchema);

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    const warnings = await Warning.find();
    res.json(warnings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const newWarning = new Warning(req.body);
    await newWarning.save();
    res.json(newWarning);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;