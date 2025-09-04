import axios from "axios"
import { useState, useContext, useEffect } from "react"
import AuthContext from "../../context/authProvider"

export function DialogBoxForm({servingSize, servingSaved, newMealType, mealType, logsDate} ) {

    const [mealTypeInput, setMealTypeInput] = useState(mealType)

    // useEffect(()=>{
    //     console.log(`Use Effect- 
    //         Serving:${servingSaved} 
    //         MealType:${mealType} 
    //         newMealType:${mealTypeInput}
    //         Date Prop:${logsDate}`
    //     )
    // })

    //On mount, sets the saved mealType as mealtype that gets send to server during save 
    useEffect(()=>{
        newMealType(mealType)
    },[])


    //Runs when user types in serving input box
    function handleChangeServing (e) {
        const value = e.target.value
        servingSize(value)  //Passes updated servingSize to servingSize prop function
    }

    function handleChangeMealType (e){
        const value = e.target.value
        newMealType(value)
        setMealTypeInput(value)
    }

    return (
    <div className="food-item-log-deatils">
        <form id="user-log-stats">
        <label htmlFor="serving">Serving:</label>
        <input 
            type= "number"
            id="serving" 
            name="serving" 
            autoComplete="off"
            placeholder={servingSaved}
            onChange = {handleChangeServing}
            />

        <label htmlFor="units">Units:</label>            
        <select
            type= ""
            id="units" 
            name="units" 
            autoComplete="off"
            // onChange = {handleChangeUnits}
            >
                <option value="g">g</option>
        </select>


        <label htmlFor="mealTypeForm">Meal Type:</label>
        <select
            type= ""
            id="mealTypeForm" 
            name="mealTypeForm" 
            autoComplete="off"
            value= {mealTypeInput}
            onChange={handleChangeMealType}
            >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
        </select>
        </form>


        <p className="date">Date: {logsDate}</p>
    </div>
    )
}