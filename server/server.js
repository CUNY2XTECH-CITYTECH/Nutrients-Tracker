import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import mongoose from "mongoose" 
import 'dotenv/config'; // loads .env file
import cookieParser from "cookie-parser"
// import suggestionsRoutes from "./Routes/suggestionsRoutes.js"
import dotenv from "dotenv";
dotenv.config();
import recipeRoutes from "./Routes/recipeRoutes.js";
import logRoutes from "./Routes/logRoutes.js";
import authRoutes from "./Routes/authRoutes.js"
import foodRoutes from "./Routes/foodRoutes.js"
const app = express()


import { getUserInfo } from "./Middleware/Credentials.js"
const credentials = getUserInfo
app.use(credentials)


import corsOptions from "./config/corsOptions.js";


app.use(cors(corsOptions))

mongoose.connect(process.env.MONGODB_URI)

app.use(cookieParser()) //middleware for cookies
const port = 3000
app.use(express.json());



app.use("/", authRoutes)


app.use("/api/food", foodRoutes)

// app.use("/suggestions", suggestionsRoutes)
app.use("/recipes", recipeRoutes);

app.use("/api/food/logs", logRoutes); 






app.listen(port, () => {
    console.log(`Server is lietening on ${port}`)
})