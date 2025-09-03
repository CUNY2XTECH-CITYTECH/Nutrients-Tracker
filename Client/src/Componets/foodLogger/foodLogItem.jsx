import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios"
import AuthContext from "../../context/authProvider";
import "./foodLoggerItem.css"
import { DialogBoxForm } from "./foodItemForm";

export function FoodLogItem({ object = [], mealType, render, rerender, logsDate}) {

    const[anyFoods, setAnyFoods] = useState(false) //stores any food user saved 
    const [toggleDialog, setToggleDialog] = useState(false) //sets the opening and closing of dialog box
    const [dialogFood, setDialogFood] = useState(null) //The food the dialog box is going to show in detail
    const [logId, setLogId] = useState("logIdDefault")//The object id of the food log saved in db
    const {auth} = useContext(AuthContext) //Global constext that saves user info
    const [isLoading, setIsLoading] = useState(false) //If true, shows loading screen while fetching for food details
    const [servingAmount, setServingAmount] = useState(100)
    const [newMealType, setNewMealType] = useState(mealType)
    const [foodDetails, setFoodDetails] = useState({
        foodId: null,
        name: null,

        macros: {
            1008: { name: 'Calories', value: null , unit: 'kcal' },
            1005: { name: 'Carbohydrates', value: null, unit: 'g' },
            1004: { name: 'Total Fat', value: null, unit: 'g' },
            1003: { name: 'Protein', value: null, unit: 'g' },
            1079: { name: 'Dietary Fiber', value: null, unit: 'g' },
            2000: { name: 'Sugars', value: null, unit: 'g' },
        },

        fats: {
            1004: { name: 'Total Fat', value: null, unit: 'g' },
            1258: { name: 'Saturated Fat', value: null, unit: 'g' },
            1292: { name: 'Monounsaturated Fat', value: null, unit: 'g' },
            1293: { name: 'Polyunsaturated Fat', value: null, unit: 'g' },
            1253: { name: 'Cholesterol', value: null, unit: 'mg' }
        },

        vitamins: {
            1106: { name: 'Vitamin A', value: null, unit: 'IU' },
            1162: { name: 'Vitamin C', value: null, unit: 'mg' },
            1110: { name: 'Vitamin D', value: null, unit: 'IU' },
            1109: { name: 'Vitamin E', value: null, unit: 'mg' },
            1185: { name: 'Vitamin K', value: null, unit: 'µg' },
            1165: { name: 'Thiamin (B1)', value: null, unit: 'mg' },
            1166: { name: 'Riboflavin (B2)', value: null, unit: 'mg' },
            1167: { name: 'Niacin (B3)', value: null, unit: 'mg' },
            1175: { name: 'Vitamin B6', value: null, unit: 'mg' },
            1177: { name: 'Folate (B9)', value: null, unit: 'µg' }
        },
        minerals: {
            1087: { name: 'Calcium', value: null, unit: 'mg' },
            1089: { name: 'Iron', value: null, unit: 'mg' },
            1091: { name: 'Phosphorus', value: null, unit: 'mg' },
            1092: { name: 'Potassium', value: null, unit: 'mg' },
            1093: { name: 'Sodium', value: null, unit: 'mg' },
            1095: { name: 'Zinc', value: null, unit: 'mg' },
            1098: { name: 'Copper', value: null, unit: 'mg' },
            1101: { name: 'Manganese', value: null, unit: 'mg' }
        }
    })



    useEffect(() => {
        const Foods = object.filter(item => item.mealType === mealType);   // Check if there are any foods matching the mealType
        setAnyFoods(Foods.length > 0);  //if food exist with mealtype prop given, food exists
    }, [object, mealType])

    //If not foods logged for given mealtype, return this div
    if(!anyFoods) return (
        <div className="no-food-item-container">
            <p>No Foods to display. Add foods to your diet in the Foods tab!</p>
        </div>
    )

    //When food item div gets clicked, saves foodId of clicked div, dialog box opens, fetch data with the foodId
    function foodClick(foodId, serving, _id){
        setLogId(_id)
        setDialogFood(foodId)
        setToggleDialog(true)
        allFoodDetail(foodId)
        setServingAmount(serving)
        console.log(_id, mealType)

    }





    //DIALOG BOX CODE

    //Gets foodId as prop and gets all the nutritional information need to display to user
    async function allFoodDetail(foodId) {
    try {
        setIsLoading(true); //Show loading screen until function is complete
        const response = await axios.get("http://localhost:3000/logs/food-all-details", {
            params: { foodId: foodId },
            headers: { 'Authorization': `Bearer ${auth.accessToken}` }
        });

        const result = response.data

        //Keeps the previous values in the object and changes the value of "value" attribute in object
        setFoodDetails((prev) => ({

        foodId: result.foodId,
        name: result.name,
        
        macros: {
            1008: { ...prev.macros[1008], value: result.nutrients[1008]},
            1005: { ...prev.macros[1005], value: result.nutrients[1005]},
            1004: { ...prev.macros[1004], value: result.nutrients[1004]},
            1003: { ...prev.macros[1003], value: result.nutrients[1003]},
            1079: { ...prev.macros[1079], value: result.nutrients[1079]},
            2000: { ...prev.macros[2000], value: result.nutrients[2000]},
        },

        fats: {
            1004: { ...prev.fats[1004], value: result.nutrients[1004]},
            1258: { ...prev.fats[1258], value: result.nutrients[1258]},
            1292: { ...prev.fats[1292], value: result.nutrients[1292]},
            1293: { ...prev.fats[1293], value: result.nutrients[1293]},
            1253: { ...prev.fats[1253], value: result.nutrients[1253]}
        },

        vitamins: {
            1106: { ...prev.vitamins[1106], value: result.nutrients[1106]},
            1162: { ...prev.vitamins[1162], value: result.nutrients[1162]},
            1110: { ...prev.vitamins[1110], value: result.nutrients[1110]},
            1109: { ...prev.vitamins[1109], value: result.nutrients[1109]},
            1185: { ...prev.vitamins[1185], value: result.nutrients[1185]},
            1165: { ...prev.vitamins[1165], value: result.nutrients[1165]},
            1166: { ...prev.vitamins[1166], value: result.nutrients[1166]},
            1167: { ...prev.vitamins[1167], value: result.nutrients[1167]},
            1175: { ...prev.vitamins[1175], value: result.nutrients[1175]},
            1177: { ...prev.vitamins[1177], value: result.nutrients[1177]}
        },
        minerals: {
            1087: { ...prev.minerals[1087], value: result.nutrients[1087]},
            1089: { ...prev.minerals[1089], value: result.nutrients[1089]},
            1091: { ...prev.minerals[1091], value: result.nutrients[1091]},
            1092: { ...prev.minerals[1092], value: result.nutrients[1092]},
            1093: { ...prev.minerals[1093], value: result.nutrients[1093]},
            1095: { ...prev.minerals[1095], value: result.nutrients[1095]},
            1098: { ...prev.minerals[1098], value: result.nutrients[1098]},
            1101: { ...prev.minerals[1101], value: result.nutrients[1101]}
        }
    }));

    } catch (e) {
        console.error(e);
    } finally {
    setIsLoading(false);
  }
}

    //Deletes saved food item in logs page
    async function handleDeleteLog () {
        setIsLoading(true)
        try{
            
            const response = await axios.delete("http://localhost:3000/logs/deleteLog",
                {
                    params:{foodId:dialogFood},
                    headers: { 'Authorization': `Bearer ${auth.accessToken}` }
                }
            )
            console.log(response)
            setToggleDialog(false)
            setIsLoading(false)
        }catch(error){
            console.error(error)
        } finally {
            rerender(); //Has callback function that updates a state in parent component that triggers useeffect that gets updated user log info
        }
    }

    let handleServingAmount = (amount) => {
        setServingAmount(amount)
    }

    let handleMealType = (amount) => {
        setNewMealType(amount)
    }

    function handleCloseDialog () {
    setToggleDialog(false);
    setDialogFood(null);
    setServingAmount(100);
    setLogId(null);
    }


    async function handleUpdateLog() {
        // console.log(`Hit Handle function- Serving:${servingAmount} MealType:${newMealType} Date Prop:${logsDate} LogId Prop:${logId}`)
        
        if (servingAmount == "") return

        try {
            const response = await axios.patch("http://localhost:3000/logs/updateLog",
                    {
                        serving:servingAmount,
                        mealType:newMealType,
                        logsDate:logsDate,
                        logId:logId
                    },
                    {
                        headers: 
                        { 
                            'Authorization': `Bearer ${auth.accessToken}`
                        }
                    }
            )
            console.log(response.data)
            return
        }catch(error) {
            console.error(error)
        }finally{
            handleCloseDialog()
            rerender()
        }
    }

  


  return (
    <>
        {/*Filters the array to given meal type */}
        {object.filter(item => item.mealType == mealType) 
            .map(({_id, name, foodId, serving, unit, calories }, index) => (         //for each object in array, creates a food item container that user can click to see details
            <div className="food-item-container"
                 key={_id}
                 onClick={() => foodClick(foodId, serving, _id)}>
                <h3 className="food-name">{name}</h3>
                <p className="serving-size">{serving} {unit}</p>
                <p className="calories">{calories} kcal</p>
            </div>
            )
        )}

        <dialog id="food-item-dialog" open={toggleDialog}>
            <h2>{foodDetails.name}</h2>


            <div className="dialog-content">
                
                
                

                <div className="food-info">

                {isLoading?(
                    <p className="food-item-dialog-loading">Loading...</p>
                ):(
                <>
                        

                    <div className="macros-container food-detail-section">
                        <h3>Macros</h3>
                        {Object.entries(foodDetails.macros).map(([key,macro]) => (
                            <p key={key}>{`${macro.name}: ${macro.value == "No Data"?"No Data":Math.round(macro.value * servingAmount)/100} ${macro.value === "No Data"?'':macro.unit}`}</p>
                        ) )}
                    </div>

                    <div className="user-input-container food-detail-section">
                        <h3>User Inputs</h3>
                        <DialogBoxForm 
                            servingSize={handleServingAmount} 
                            servingSaved={servingAmount} 
                            newMealType={handleMealType}
                            logsDate={logsDate}
                            mealType={mealType}
                             />
                    </div>


                    <div className="vitamins-container food-detail-section">
                        <h3>Vitamins</h3>
                        {Object.entries(foodDetails.vitamins).map(([key, vitamin]) => (
                            <p key={key}>{`${vitamin.name}: ${vitamin.value == "No Data"?"No Data":Math.round(vitamin.value * servingAmount)/100} ${vitamin.value === "No Data"?'':vitamin.unit}`}</p>
                            )
                        )}
                    </div>

                    <div className="minerals-container food-detail-section">
                        <h3>Minerals</h3>
                        {Object.entries(foodDetails.minerals).map(([key, mineral]) => (
                            <p key={key}>{`${mineral.name}: ${mineral.value == "No Data"?"No Data":Math.round(mineral.value * servingAmount)/100} ${mineral.value === "No Data"?'':mineral.unit}`}</p>
                            )
                        )}
                    </div>

                    <div className="fat-container food-detail-section">
                        <h3>Fat</h3>
                        {Object.entries(foodDetails.fats).map(([key, fat]) => (
                            <p key={key}>{`${fat.name}: ${fat.value == "No Data"?"No Data":Math.round(fat.value * servingAmount)/100} ${fat.value === "No Data"?'':fat.unit}`}</p>
                            )
                        )}
                    </div>
                    </> )}
                </div>
            </div>
            <div className="food-item-btn">
                <button className="close-dialog" onClick= {handleCloseDialog}>Close</button>
                <button className="delete-food-log" onClick={handleDeleteLog}>Delete</button>
                <button className="save-food-log" onClick={handleUpdateLog}>Save</button>
            </div>
        </dialog>



    </>
  );
}