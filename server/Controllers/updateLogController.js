import FoodLog from "../Models/FoodLog.js"

export async function updateLog (req, res) {
    const {formData} = req.body
    const {serving, mealType, logsDate, logId} = formData

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