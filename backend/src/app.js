const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const recipesRouter = require('./routes/recipes');
const { db } = require('./config/firebase');

const app = express();

// Initialize Firebase
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : require('./config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com']
    : ['http://localhost:3000']
}));
app.use(express.json());

// Routes
app.use('/api/recipes', recipesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 