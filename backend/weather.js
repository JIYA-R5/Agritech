const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const router = express.Router();

const weatherSchema = new mongoose.Schema({
  city: String,
  temperature: Number,
  condition: String,
  humidity: String,
  soilMoisture: String,
  riskLevel: String
}, { timestamps: true });

const Weather = mongoose.models.Weather || mongoose.model('Weather', weatherSchema);

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    const weather = await Weather.find();
    res.json(weather);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const newWeather = new Weather(req.body);
    await newWeather.save();
    res.json(newWeather);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/live/:city', async (req, res) => {
  const city = req.params.city;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    console.error('❌ WEATHER_API_KEY is not set in environment variables!');
    return res.status(500).json({ 
      error: 'WEATHER_API_KEY is missing. Please add it to environment variables.' 
    });
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );
    res.json(response.data);
  } catch (error) {
    console.error(`❌ OpenWeather API Error for ${city}:`, error.response?.data || error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Weather data fetch failed';
    res.status(status).json({ error: message });
  }
});

module.exports = router;