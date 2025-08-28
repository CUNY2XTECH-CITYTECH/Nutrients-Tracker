import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios"
import AuthContext from "../../context/authProvider";
import "./FoodLogger.css"
import { FoodLogItem } from "../../Componets/foodLogger/foodLogItem";


export function FoodLogger() {
 
   const {auth} = useContext(AuthContext); //Global context that store access token

  const [error, setError] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [userInfo, setUserInfo] =  useState({
    name: '',
    birthday:'',
    height:'',
    weight:'',
    gender: '',
    username: '',
})
  const [foodLogs, setFoodLogs] = useState([]) //gets save food logs that user saved
  const [renderComponent, setRenderComponent] = useState(0) //Used to render the child  compoents

  const today = new Date();
  today.setHours(0, 0, 0, 0)

  function dateFormater (date) {
      let month = date.getMonth() + 1; // getMonth returns 0-11 so add 1 for actual month
      let day = date.getDate();
      let year = date.getFullYear();
      const formattedDate = `${month}/${day}/${year}`;
    return formattedDate
  }
  const [rawDate,setRawDate] = useState(today)
  const [logsDate, setLogsDate] = useState(dateFormater(today))
  
  // useEffect(()=>{
  //   console.log(`Today: ${today}, rawDate: ${rawDate}, LogsDate: ${logsDate}`)
  // },[rawDate, logsDate, today])

  //Updates renderComponet state and triggers useEffect to get updated data log info
  const forceRerender = () => {
    setRenderComponent(Math.random()); // Update with a random value to ensure change
  };


  //Function that gives back userinfo by decrypting access token if valid and gives user's logged food
  async function getLogs() {

    try{
      setError(null)

      const response = await axios.get("http://localhost:3000/logs/user-details",
        {
          params: {date:rawDate},
          headers: {'Authorization': `Bearer ${auth.accessToken}`}
        })

      // console.log(response.data.userInfo)
      // console.log(response.data.userLogs)

      //saving all user info in state
      const userDetails = response.data.userInfo
      setUserInfo({
        name: userDetails.name,
        birthday:userDetails.birthday,
        height:userDetails.height,
        weight:userDetails.weight,
        gender: userDetails.gender,
        username: userDetails.username,
      })
      setLoadingUser(false)

      //saving all user logs in state
      const userFoods = response.data.userLogs
      setFoodLogs(userFoods)
      // console.log("foodLogs: ",userFoods)

      }catch (error){
        console.error(error)
        setError(error)
      }
}

//Gets updated food logs for when a render is trigger during food item CRUD or date change
useEffect(() =>{
  getLogs()
  // console.log(`useEffect rawDate: ${rawDate}`)
},[renderComponent, logsDate.toString()])


//Changes the date to the previous day
function handlePrevDate (){
  const prevDate = rawDate;
  prevDate.setDate(prevDate.getDate() - 1);

  setRawDate(prevDate)

  const prevDateFormat = dateFormater(prevDate)
  setLogsDate(prevDateFormat)
 return
}

//Changes the date to the next day
function handleNextDate() {
  if(rawDate >= today) return //Can only incrument throught current and previous dates

  const nextDate = rawDate;
  nextDate.setDate(nextDate.getDate() + 1);
  setRawDate(nextDate)

  const nextDateFormat = dateFormater(nextDate)
  setLogsDate(nextDateFormat)
 return
}





  return (
    <div className="Content-parent" style={{ maxWidth: 900, margin: "auto", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: "0.5em" }}>
        Food Logs for {userInfo ? userInfo.username : "Loading..."}
      </h2>

      {loadingUser && <p>Loading user info...</p>}
      {error && (
        <p style={{ color: "red" }}>
          <strong>Error:</strong> {error}
        </p>
      )}

      {userInfo && (
        <div
          style={{
            marginBottom: "1em",
            padding: "1em",
            background: "#eef",
            borderRadius: "8px",
          }}
        >
          <h3>👤 {userInfo.name}</h3>
          <p>Username: {userInfo.username}</p>
          <p>Birthday: {userInfo.birthday}</p>
          <p>Height: {userInfo.height} cm</p>
          <p>Weight: {userInfo.weight} kg</p>
          <p>Gender: {userInfo.gender}</p>
        </div>
      )}

      <div className="logs-date-container">
        <div className="prev-date" onClick={handlePrevDate}>&lt;</div>
        <div className="logs-date">{logsDate}</div>
        <div className="next-date" onClick={handleNextDate}>&gt;</div>
      </div>

        <div className="food-logger-meal-time-foods">

          <h1 className="title">Breakfast</h1>
          <div className= "meal-type-container breakfast">
              <FoodLogItem 
                object={foodLogs} 
                mealType="breakfast" 
                render={renderComponent} 
                rerender={forceRerender} 
                logsDate={logsDate}/>
          </div>

          <h1 className="title">Lunch</h1>
          <div className= "meal-type-container lunch">
              <FoodLogItem 
                object={foodLogs} 
                mealType="lunch" 
                render={renderComponent} 
                rerender={forceRerender}
                logsDate={logsDate}/>
          </div>

          <h1 className="title">Dinner</h1>
          <div className= "meal-type-container dinner">
              <FoodLogItem 
                object={foodLogs} 
                mealType="dinner" 
                render={renderComponent} 
                rerender={forceRerender}
                logsDate={logsDate}/>
          </div>

        </div>


       
    </div>
  );

}