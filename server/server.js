import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb'

const app = express()
const PORT = 3000
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

const uri = 'mongodb+srv://syedasghar:syedasghar@cluster0.zxbqbyb.mongodb.net/Nutrients-Tracker?retryWrites=true&w=majority&appName=Cluster0'
const client = new MongoClient(uri)

app.get('/api/food/logs/:username', async (req, res) => {
  const { username } = req.params
  try {
    await client.connect()
    const db = client.db('Nutrients-Tracker')
    const collection = db.collection('Food')

    const logs = await collection.find({ username }).toArray()

    if (logs.length === 0) {
      return res.status(404).json({ message: 'No logs found' })
    }

    res.json(logs)
  } catch (error) {
    console.error('Error fetching logs:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
