import axios from "axios"
import foodLog from "../Models/FoodLog.js"

export async function userDetails (req, res) {
    const userInfo = req.userInfo
    console.log(userInfo)

    const userLogs = await foodLog.find ({username:userInfo.username})
    res.json({userInfo, userLogs})
}