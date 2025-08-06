import express from 'express';
import FoodLog from '/models/FoodLog.js';

const router = express.Router();

router.get('/logs/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const logs = await FoodLog.find({ userId });
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
    