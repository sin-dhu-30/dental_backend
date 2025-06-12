const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
const userroute=require('./Routers/UserRoute');
app.use('/api/users',userroute);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    // Start server only after DB connection
    app.listen(PORT, () => {
      console.log("🚀 Server running on port ${PORT}");
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));