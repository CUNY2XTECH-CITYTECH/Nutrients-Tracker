import FoodLog from "../Models/FoodLog.js"

export async function updateLog (req, res) {
    const {serving, mealType, logsDate, logId} = req.body

    console.log(serving, mealType, logsDate, logId)
    try{
        const updatedLog = await FoodLog.updateOne(
            {
                _id:logId
            },
            {
                serving:serving, 
                mealType:mealType, 
                Date:logsDate
            }
        );
        res.json({"Working":"working"})

    }catch(error){
        console.error(error)
    }
}