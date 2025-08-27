
export function DialogBoxForm({servingSize, servingSaved, mealType}) {

    function handleChangeServing (e) {
        servingSize(e.target.value)
    }



    return (
    <div className="food-item-log-deatils">
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


        <label htmlFor="meal-type">Meal Type:</label>
        <select
            type= ""
            id="meal-type" 
            name="meal-type" 
            autoComplete="off"
            defaultValue={mealType}
            >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
        </select>
        <div className="date">Date: </div>
    </div>
    )
}