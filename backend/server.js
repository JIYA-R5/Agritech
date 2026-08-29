const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Connect to MongoDB if MONGO_URI is provided
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => console.log('❌ MongoDB Connection Error:', err.message));
} else {
  console.log('⚠️ MONGO_URI not provided. Skipping MongoDB connection.');
}

// API Routes
app.use('/api/trucks', require('./truck'));
app.use('/api/loads', require('./load'));
app.use('/api/warnings', require('./warning'));
app.use('/api/weather', require('./weather'));

// Listen on port only when run directly (local development)
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;