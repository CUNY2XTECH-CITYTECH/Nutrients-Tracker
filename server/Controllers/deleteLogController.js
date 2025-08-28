import FoodLog from "../Models/FoodLog.js";

export async function deleteLog (req, res) {
    try {
        const { username } = req.userInfo;
        const foodId = req.params.foodId || req.query.foodId;
        console.log(`user ${username} foodId: ${foodId}`)

        // Deletes current users food log
        const result = await FoodLog.deleteOne({ username: username,foodId: foodId });
        res.status(200).json({message: "Food log deleted"});

    }catch(error){
        console.error(error)
    }
}