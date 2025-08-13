// server/testMongo.js
import { MongoClient } from 'mongodb';

async function testConnection() {
  const uri = 'mongodb+srv://syedasghar:syedasghar@cluster0.zxbqbyb.mongodb.net/Nutrients-Tracker?retryWrites=true&w=majority&appName=Cluster0'; // 例如：mongodb+srv://user:pass@cluster0.mongodb.net/dbname?retryWrites=true&w=majority
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ MongoDB 连接成功！');
  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error);
  } finally {
    await client.close();
  }
}

testConnection();