import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios"
import AuthContext from "../../context/authProvider";
import "./FoodLogger.css"
import { FoodLogItem } from "../../Componets/foodLogger/foodLogItem";

const USDA_API_KEY = "VsNxcVGrt9triez7CjKKNwKdjRidilAez1CFdvLk";

export function FoodLogger() {
  // const [userInfo, setUserInfo] = useState(null);

  // const [userId, setUserId] = useState(null);
  // const [logs, setLogs] = useState([]);
  // const [foodDetails, setFoodDetails] = useState([]);
  // const [loadingUser, setLoadingUser] = useState(false);
  // const [loadingLogs, setLoadingLogs] = useState(false);
  // const [loadingDetails, setLoadingDetails] = useState(false);
  // const [error, setError] = useState(null);
  // const canvasRef = useRef(null);

  // // 1. 获取用户信息和 userId
  // useEffect(() => {
  //   setLoadingUser(true);
  //   setError(null);

  //   fetch("/test", {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //     },
  //   })
  //     .then((res) => {
  //       if (!res.ok) throw new Error("Failed to fetch user info");
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setUserInfo(data);
  //       setUserId(data.userId);
  //       setLoadingUser(false);
  //     })
  //     .catch((err) => {
  //       setError(err.message);
  //       setLoadingUser(false);
  //     });
  // }, []);

  // // 2. 根据 userId 获取食物日志
  // useEffect(() => {
  //   if (!userId) return;
  //   setLoadingLogs(true);
  //   setError(null);

  //   fetch(`/api/food/logs/${userId}`, {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //     },
  //   })
  //     .then((res) => {
  //       if (!res.ok) throw new Error("Failed to fetch logs");
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setLogs(data);
  //       setLoadingLogs(false);
  //     })
  //     .catch((err) => {
  //       setError(err.message);
  //       setLoadingLogs(false);
  //     });
  // }, [userId]);

  // // 3. 根据 logs 调用 USDA API 获取详细营养信息
  // useEffect(() => {
  //   if (logs.length === 0) {
  //     setFoodDetails([]);
  //     return;
  //   }
  //   setLoadingDetails(true);
  //   setError(null);

  //   const nutrientPriorityMap = {
  //     calories: [
  //       "energy (atwater general factors)",
  //       "energy (atwater specific factors)",
  //       "energy",
  //     ],
  //     carbs: ["carbohydrate, by difference", "carbohydrate, by summation", "carbohydrate"],
  //     fat: ["total lipid (fat)", "fat", "total fat"],
  //     protein: ["protein"],
  //   };

  //   const fetchDetails = async () => {
  //     const details = await Promise.all(
  //       logs.map(async (log) => {
  //         try {
  //           const res = await fetch(
  //             `https://api.nal.usda.gov/fdc/v1/food/${log.foodId}?api_key=${USDA_API_KEY}`
  //           );
  //           if (!res.ok)
  //             throw new Error(`USDA fetch failed for foodId=${log.foodId}`);

  //           const data = await res.json();
  //           const nutrients = data.foodNutrients || [];

  //           const getNutrientByPriority = (names) => {
  //             for (const name of names) {
  //               const lowerName = name.toLowerCase();
  //               const match = nutrients.find(
  //                 (n) =>
  //                   n.nutrient?.name?.toLowerCase() === lowerName ||
  //                   n.nutrient?.name?.toLowerCase().includes(lowerName)
  //               );
  //               if (match) return match.amount;
  //             }
  //             return 0;
  //           };

  //           const serving = Number(log.serving) || 1;

  //           const calories = getNutrientByPriority(nutrientPriorityMap.calories);
  //           const carbs = getNutrientByPriority(nutrientPriorityMap.carbs);
  //           const fat = getNutrientByPriority(nutrientPriorityMap.fat);
  //           const protein = getNutrientByPriority(nutrientPriorityMap.protein);

  //           return {
  //             name: data.description || "Unknown Food",
  //             calories: +(calories * serving).toFixed(1),
  //             carbs: +(carbs * serving).toFixed(1),
  //             fat: +(fat * serving).toFixed(1),
  //             protein: +(protein * serving).toFixed(1),
  //             mealType: log.mealType,
  //             unit: log.unit,
  //             serving: serving,
  //           };
  //         } catch (err) {
  //           console.error(err);
  //           return null;
  //         }
  //       })
  //     );
  //     setFoodDetails(details.filter(Boolean));
  //     setLoadingDetails(false);
  //   };

  //   fetchDetails();
  // }, [logs]);

  // // 4. 按餐别分组
  // const grouped = {
  //   Breakfast: [],
  //   Lunch: [],
  //   Dinner: [],
  // };

  // foodDetails.forEach((food) => {
  //   const meal = food.mealType?.toLowerCase();
  //   if (meal === "breakfast") grouped.Breakfast.push(food);
  //   else if (meal === "lunch") grouped.Lunch.push(food);
  //   else if (meal === "dinner") grouped.Dinner.push(food);
  // });

  // // 5. 总营养计算
  // const totalNutrition = foodDetails.reduce(
  //   (acc, food) => {
  //     acc.calories += food.calories || 0;
  //     acc.carbs += food.carbs || 0;
  //     acc.fat += food.fat || 0;
  //     acc.protein += food.protein || 0;
  //     return acc;
  //   },
  //   { calories: 0, carbs: 0, fat: 0, protein: 0 }
  // );

  // // 6. 画饼图
  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;

  //   const ctx = canvas.getContext("2d");
  //   const { carbs, fat, protein } = totalNutrition;
  //   const values = [carbs, fat, protein];
  //   const colors = ["#36A2EB", "#FFCE56", "#4BC0C0"];
  //   const total = values.reduce((sum, v) => sum + v, 0);

  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   if (total === 0) return;

  //   let startAngle = 0;
  //   values.forEach((value, i) => {
  //     const sliceAngle = (value / total) * 2 * Math.PI;
  //     ctx.beginPath();
  //     ctx.moveTo(100, 100);
  //     ctx.arc(100, 100, 80, startAngle, startAngle + sliceAngle);
  //     ctx.closePath();
  //     ctx.fillStyle = colors[i];
  //     ctx.fill();
  //     startAngle += sliceAngle;
  //   });
  // }, [totalNutrition]);
 
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
  const [foodLogs, setFoodLogs] = useState([])


  //Function that gives back userinfo by decrypting access token if valid and gives user's logged food
  async function getLogs() {

    try{
      setError(null)

      const response = await axios.get("http://localhost:3000/logs/user-details",
        {
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





useEffect(() =>{
  getLogs()

},[])




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

      {/* <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#f9f9f9",
          padding: "1em",
          borderRadius: "8px",
          marginBottom: "1em",
        }}
      >
        <div>
          <h3>Total Calories: </h3>
          <h3>Total Carbs: g</h3>
          <h3>Total Fat: g</h3>
          <h3>Total Protein: g</h3>
        </div>

        <div style={{ display: "flex", gap: "1em" }}>
          <canvas width={200} height={200} />
          <div>
            <h4 style={{ margin: 0 }}>Nutritions:</h4>
            <ul style={{ listStyle: "none", padding: 0, marginTop: "0.5em" }}>
              <li>
                <span style={{ color: "#36A2EB" }}>⬤</span> Carbs
              </li>
              <li>
                <span style={{ color: "#FFCE56" }}>⬤</span> Fat
              </li>
              <li>
                <span style={{ color: "#4BC0C0" }}>⬤</span> Protein
              </li>
            </ul>
          </div>
        </div>
      </div> */}


      <div className="food-logger-meal-time-foods">

        <h1 className="title">Breakfast</h1>
        <div className= "meal-type-container breakfast">
            <FoodLogItem object={foodLogs} mealType="breakfast"/>
        </div>

        <h1 className="title">Lunch</h1>
        <div className= "meal-type-container lunch">
            <FoodLogItem object={foodLogs} mealType="lunch"/>
        </div>

        <h1 className="title">Dinner</h1>
        <div className= "meal-type-container dinner">
            <FoodLogItem object={foodLogs} mealType="dinner"/>
        </div>

      </div>

       
    </div>
  );

}