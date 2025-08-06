import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import 'dotenv/config'
import cookieParser from "cookie-parser"
import credentials from "./Middleware/Credentials.js"
import corsOptions from "./config/corsOptions.js"
import authRoutes from "./Routes/authRoutes.js"
import foodRoutes from "./Routes/foodRoutes.js"
import { MongoClient } from "mongodb"

const app = express()

const port = process.env.port || 3000

const MONGO_URI = process.env.MONGODB_URI

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Mongoose connected to MongoDB"))
  .catch(err => {
    console.error("❌ Mongoose connection error:", err)
    process.exit(1)
  })

const client = new MongoClient(MONGO_URI)

app.use(cors(corsOptions))  
app.use(credentials)       
app.use(cookieParser())    
app.use(express.json())    

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
  } finally {
    await client.close()
  }
})

app.use("/", authRoutes)
app.use("/api/food", foodRoutes)

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`)
})
