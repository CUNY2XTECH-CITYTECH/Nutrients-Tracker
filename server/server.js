import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import mongoose from "mongoose" 
import 'dotenv/config'; // loads .env file
import cookieParser from "cookie-parser"

import authRoutes from "./Routes/authRoutes.js"
import foodRoutes from "./Routes/foodRoutes.js"
const app = express()


import credentials from "./Middleware/Credentials.js"
app.use(credentials)


import corsOptions from "./config/corsOptions.js";


app.use(cors(corsOptions))

mongoose.connect(process.env.MONGODB_URI)

app.use(cookieParser()) //middleware for cookies
const port = 3000
app.use(express.json());



app.use("/", authRoutes)
app.use("/api/food", foodRoutes)









app.listen(port, () => {
    console.log(`Server is lietening on ${port}`)
})