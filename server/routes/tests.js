const express = require('express');
const router = express.Router();

// @route   GET api/tests
// @desc    Get all test results
router.get('/', async (req, res) => {
  try {
    res.json({ message: 'Test results retrieved successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/tests
// @desc    Save test result
router.post('/', async (req, res) => {
  try {
    const { testType, result } = req.body;
    res.json({ message: 'Test result saved successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
