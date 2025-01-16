require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const testRoutes = require('./routes/tests');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tests', testRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Display Test API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
