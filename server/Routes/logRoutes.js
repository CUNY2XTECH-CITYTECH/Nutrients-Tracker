import express from "express";
import FoodLog from "../Models/FoodLog.js"; 

const router = express.Router();


router.get('/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const logs = await FoodLog.find({ username });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching logs" });
  }
});

export default router;