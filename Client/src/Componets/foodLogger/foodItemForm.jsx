import axios from "axios"
import { useState, useContext } from "react"
import AuthContext from "../../context/authProvider"

export function DialogBoxForm({servingSize, servingSaved, mealType, logsDate, handleCloseDialog, logId, rerender} ) {

    const {auth} = useContext(AuthContext)
    const [formData, setFormData] = useState(
        {
            serving:servingSaved,
            mealType:mealType,
            logsDate:logsDate,
            logId:logId
        }
    )


    //Runs when user types in serving input box
    function handleChangeServing (e) {
        servingSize(e.target.value)  //Passes updated servingSize to servingSize prop function

        //updates state of serving size
        setFormData((prev)=> (
            {
                ...prev,
                serving:e.target.value
            }
        ))
    }

    function handleChangeMealType (e){
        setFormData((prev)=> (
            {
                ...prev,
                mealType:e.target.value
            }
        ))
    }

    //Runs when form is submitted
    async function handleUpdateLogDB(e) {
        e.preventDefault()
        try {
            const response = await axios.patch("http://localhost:3000/logs/updateLog",
                    {
                        formData:formData
                    },
                    {
                        headers: 
                        { 
                            'Authorization': `Bearer ${auth.accessToken}`
                        }
                    }
            )
            // console.log(response.data)
            return
        }catch(error) {
            console.error(error)
        }finally{
            handleCloseDialog()
            rerender()
        }
    }

    return (
    <div className="food-item-log-deatils">
        <form id="user-log-stats" onSubmit={handleUpdateLogDB}>
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