// routes/foodLogs.js
import express from 'express';
import FoodLog from '/models/FoodLog.js';

const router = express.Router();

// 根据username获取日志
router.get('/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const logs = await FoodLog.find({ username });
    if (!logs || logs.length === 0) {
      return res.status(404).json({ message: 'No logs found for user.' });
    }
    res.json(logs);
  } catch (error) {
    console.error('Error fetching food logs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
