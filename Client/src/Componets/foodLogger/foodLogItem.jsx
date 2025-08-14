import { useState, useEffect, useContext } from "react";
import axios from "axios"
import AuthContext from "../../context/authProvider";
import "./foodLoggerItem.css"
// import {FoodItemDialogBox} from "./foodLoggerDialogBox"

export function FoodLogItem({ object = [], mealType }) {

    const[anyFoods, setAnyFoods] = useState(false) //stores any food user saved 
    const [toggleDialog, setToggleDialog] = useState(false) //sets the opening and closing of dialog box
    const [dialogFood, setDialogFood] = useState(null) //The food the dialog box is going to show in detail
    const {auth} = useContext(AuthContext)

    //saves all of the marco and micro nutrients of the food that gets clicked
    const [foodDetails, setFoodDetails] = useState({
        foodId: '',
        name: '',
        cal: { name: 'Calories', value: null, unit: 'kcal' },
        
        macros: {
            carbs: { name: 'Carbohydrates', value: null, unit: 'g' },
            fiber: { name: 'Dietary Fiber', value: null, unit: 'g' },
            sugar: { name: 'Sugars', value: null, unit: 'g' },
            protein: { name: 'Protein', value: null, unit: 'g' },
            fats: {
                totalFat: { name: 'Total Fat', value: null, unit: 'g' },
                saturatedFat: { name: 'Saturated Fat', value: null, unit: 'g' },
                monounsaturatedFat: { name: 'Monounsaturated Fat', value: null, unit: 'g' },
                polyunsaturatedFat: { name: 'Polyunsaturated Fat', value: null, unit: 'g' },
                cholesterol: { name: 'Cholesterol', value: null, unit: 'mg' }
            }
        },
        vitamins: {
            vitaminA: { name: 'Vitamin A', value: null, unit: 'IU' },
            vitaminC: { name: 'Vitamin C', value: null, unit: 'mg' },
            vitaminD: { name: 'Vitamin D', value: null, unit: 'IU' },
            vitaminE: { name: 'Vitamin E', value: null, unit: 'mg' },
            vitaminK: { name: 'Vitamin K', value: null, unit: 'µg' },
            thiamin: { name: 'Thiamin (B1)', value: null, unit: 'mg' },
            riboflavin: { name: 'Riboflavin (B2)', value: null, unit: 'mg' },
            niacin: { name: 'Niacin (B3)', value: null, unit: 'mg' },
            b6: { name: 'Vitamin B6', value: null, unit: 'mg' },
            folate: { name: 'Folate (B9)', value: null, unit: 'µg' }
        },
        minerals: {
            calcium: { name: 'Calcium', value: null, unit: 'mg' },
            iron: { name: 'Iron', value: null, unit: 'mg' },
            phosphorus: { name: 'Phosphorus', value: null, unit: 'mg' },
            potassium: { name: 'Potassium', value: null, unit: 'mg' },
            sodium: { name: 'Sodium', value: null, unit: 'mg' },
            zinc: { name: 'Zinc', value: null, unit: 'mg' },
            copper: { name: 'Copper', value: null, unit: 'mg' },
            manganese: { name: 'Manganese', value: null, unit: 'mg' }
        }
    });


useEffect(()=>{
    console.log(toggleDialog)
})

    //
    useEffect(() => {
        const Foods = object.filter(item => item.mealType === mealType);   // Check if there are any foods matching the mealType
        setAnyFoods(Foods.length > 0);  //if food exist with mealtype prop given, food exists
    }, [object, mealType])

    //If not foods logged for given mealtype, return div
    if(!anyFoods) return (
        <div className="no-food-item-container">
            <p>No Foods to display. Add foods to your diet in the Foods tab!</p>
        </div>
    )

    function foodClick(foodId){
        setDialogFood(foodId)
        setToggleDialog(true)
        allFoodDetail(foodId)
    }





    //DIALOG BOX CODE


    //Gets foodId as prop and gets all the nutritional information need to display to user
    async function allFoodDetail(foodId) {
    try {
        const response = await axios.get("http://localhost:3000/logs/food-all-details", {
            params: { foodId: foodId },
            headers: { 'Authorization': `Bearer ${auth.accessToken}` }
        });

        // Server returns data in the exact structure we need
        setFoodDetails(prev => ({
            ...prev,
            ...response.data.result
        }));

    } catch (e) {
        console.error(e);
    }
}









  return (
    <>
        {/*Filters the array to given meal type */}
        {object.filter(item => item.mealType == mealType) 
            .map(({name, foodId, serving, unit, calories }, index) => (         //for each object in array, creates a food item container that user can click to see details
            <div className="food-item-container"
                 key={`${foodId}-${index}`}
                 onClick={() => foodClick(foodId)}>
                <h3 className="food-name">{name}</h3>
                <p className="serving-size">{serving} {unit}</p>
                <p className="calories">{calories} kcal</p>
            </div>
            )
        )}

        <dialog id="food-item-dialog" open={toggleDialog}>
            <h2>{foodDetails.name}</h2>


            <div className="dialog-content">

                <div className="userInput">
                </div>
                
                

                <div className="food-info">

                    <div className="vitamins-container">
                        <h3>Macros</h3>
                        <p>{foodDetails.cal.name+" "+foodDetails.cal.value+" "+foodDetails.cal.unit}</p>
                        <p>{foodDetails.macros.protein.name+" "+foodDetails.macros.protein.value+" "+foodDetails.macros.protein.unit}</p>
                        <p>{foodDetails.macros.carbs.name+" "+foodDetails.macros.carbs.value+" "+foodDetails.macros.carbs.unit}</p>
                        <p>{foodDetails.macros.fats.totalFat.name+" "+foodDetails.macros.fats.totalFat.value+" "+foodDetails.macros.fats.totalFat.unit}</p>

                    </div>


                    <div className="vitamins-container">
                        <h3>Vitamins</h3>
                        {Object.entries(foodDetails.vitamins).map(([key, vitamin]) => (
                            <p key={key}>{vitamin.name}: {vitamin.value || 'N/A'} {vitamin.unit}</p>
                            )
                        )}
                    </div>

                    <div className="minerals-container">
                        <h3>Minerals</h3>
                        {Object.entries(foodDetails.minerals).map(([key, mineral]) => (
                            <p key={key}>{mineral.name}: {mineral.value || 'N/A'} {mineral.unit}</p>
                            )
                        )}
                    </div>

                    <div className="fat-container">
                        <h3>Fat</h3>
                        {Object.entries(foodDetails.macros.fats).map(([key, fat]) => (
                            <p key={key}>{fat.name}: {fat.value || 'N/A'} {fat.unit}</p>
                            )
                        )}
                    </div>
                </div>
            </div>

            <button id="closeDialog" onClick= {() => {setToggleDialog(false); setDialogFood(null);}}>Close</button>
        </dialog>



    </>
  );
}