const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User model (we'll create this later)
// const User = require('../models/User');

// @route   POST api/users/register
// @desc    Register a user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // For now, just return success
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/login
// @desc    Login user & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // For now, just return a dummy token
    const token = jwt.sign(
      { id: 'dummy_id' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
