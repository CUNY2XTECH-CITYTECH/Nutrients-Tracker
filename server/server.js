// server.js
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// 允许所有来源跨域请求
app.use(cors());

// 支持 JSON 请求体
app.use(express.json());

// 示例路由：获取某个用户名的日志（示例数据）
app.get('/api/food/logs/:username', (req, res) => {
  const { username } = req.params;
  
  // 假数据示范，实际请接数据库查询
  if (username === 'qqqqqqqq') {
    res.json([
      {
        username: 'qqqqqqqq',
        foodId: 1750340,
        mealType: 'lunch',
        serving: 2,
        unit: 'oz',
        date: '2025-08-05T00:00:00.000Z'
      }
    ]);
  } else {
    res.json({ message: 'No logs found for user.' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
