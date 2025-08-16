
export async function DialogBoxForm() {
    return (
    <div>
        <label htmlFor="serving">Serving:</label>
        <input 
            type= "number"
            id="serving" 
            name="serving" 
            autoComplete="off"
            onChange = {handleChangeServing}/>

        <label htmlFor="units">Units:</label>            
        <select
            type= ""
            id="units" 
            name="units" 
            autoComplete="off"
            onChange = {handleChangeUnits}>
                <option value=""></option>
                <option value=""></option>
                <option value=""></option>
        </select>


        <label htmlFor="meal-type">Meal Type:</label>
        <select
            type= ""
            id="meal-type" 
            name="meal-type" 
            autoComplete="off"
            onChange = {handleChangeMealType}>
                <option value=""></option>
                <option value=""></option>
                <option value=""></option>
        </select>
        
    </div>
    )
}