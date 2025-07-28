import express from "express"
import bodyParser from "body-parser"
const app = express()

import cors from "cors"
const corsOptions = {origin: "http://localhost:5173"}
app.use(cors(corsOptions))

import mongoose from "mongoose" 
import 'dotenv/config'; // loads .env file
mongoose.connect(process.env.MONGODB_URI)

// import apiRoutes from "./Routes/authRoutes.js"

const port = 3000
app.use(express.json());






app.listen(port, () => {
    console.log(`Server is lietening on ${port}`)
})