import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/nutrition', (req, res) => {
  const { height, weight } = req.body;

  if (
    typeof height !== 'number' ||
    typeof weight !== 'number' ||
    height <= 0 ||
    weight <= 0
  ) {
    return res.status(400).json({ error: 'Invalid height or weight' });
  }

  // Just echo back received data — frontend will do all calculations and chart data generation
  return res.json({ height, weight, message: 'Data received. Calculate on frontend.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});