import axios from "axios"
import foodLog from "../Models/FoodLog.js"

export async function userDetails (req, res) {
    const userInfo = req.userInfo
    // console.log(userInfo)

    const dateByClient = req.params.date || req.query.date;
    const date = new Date(dateByClient)

    const userLogs = await foodLog.find ({username:userInfo.username, date:date})

    res.json({userInfo, userLogs})
}