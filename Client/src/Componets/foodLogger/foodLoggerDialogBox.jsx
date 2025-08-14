import axios from "axios"
import { useState, useEffect, useContext } from "react"
import AuthContext from "../../context/authProvider"

export function FoodItemDialogBox (toggleDialog=false, foodId) {

    // const [foodDetails, setFoodDetails] = useState(null);
    const [openDialog, setOpenDialog] = useState(false)
    // const {auth} = useContext(AuthContext)

    useEffect(() => {
        setOpenDialog(toggleDialog);
    }, [openDialog]);

    // async function allFoodDetail () {
    //     const response = await axios.get("", 
    //         {
    //             params:{foodId:foodId},
    //             headers: {'Authorization': `Bearer ${auth.accessToken}`}
    //         }
    //     )
    //     const foodDetails = response.data
    //     console.log(foodDetails) 
    // }



    // useEffect (()=>{
    //     allFoodDetail
    // },[])



return (
        <dialog id="myDialog" open={openDialog}>
            <h2>Dialog title {foodId}</h2>
            <p>Information</p>
            <button id="closeDialog" onClick= {()=> setOpenDialog(false)}>Close</button>
        </dialog>
)}