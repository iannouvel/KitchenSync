const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const recipesRouter = require('./routes/recipes');

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] // Update this with your frontend domain
    : ['http://localhost:3000']
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/recipes', recipesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 