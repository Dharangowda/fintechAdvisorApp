const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Import route files
const project1Routes = require('./routes/project1.routes');
const project2Routes = require('./routes/project2.routes');
const project3Routes = require('./routes/project3.routes');
const project4Routes = require('./routes/project4.routes');

// Mount routes with prefixes
app.use('/api/purchase-analyzer', project1Routes);
app.use('/api/investment-comparator', project2Routes);
app.use('/api/debt-payoff', project3Routes);
app.use('/api/crypto-checker', project4Routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});