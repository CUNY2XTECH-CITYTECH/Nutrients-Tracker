import { useEffect, useState, useContext, useRef } from "react";
import AuthContext from "../context/authProvider"; // 你的认证上下文路径
const USDA_API_KEY = "VsNxcVGrt9triez7CjKKNwKdjRidilAez1CFdvLk";

export default function FoodLogger() {
  const { auth } = useContext(AuthContext);
  const accessToken = auth?.accessToken || null;
  const username = auth?.user || null;

  const [userInfo, setUserInfo] = useState(null);
  const [logs, setLogs] = useState([]);
  const [foodDetails, setFoodDetails] = useState([]);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  // 获取用户信息
  useEffect(() => {
    if (!accessToken) {
      setError("No access token found, please login.");
      return;
    }

    setLoadingUser(true);
    setError(null);

    fetch("/test", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user info");
        return res.json();
      })
      .then((data) => {
        setUserInfo(data);
        setLoadingUser(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoadingUser(false);
      });
  }, [accessToken]);

  // 根据 username 获取食物日志
  useEffect(() => {
    if (!accessToken || !username) return;

    setLoadingLogs(true);
    setError(null);
    fetch(`http://localhost:3000/api/food/logs/${username}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
})
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch logs");
        return res.json();
      })
      .then((data) => {
        setLogs(data);
        setLoadingLogs(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoadingLogs(false);
      });
  }, [accessToken, username]);

  // 根据日志调用 USDA API 获取详细营养信息
  useEffect(() => {
    if (logs.length === 0) {
      setFoodDetails([]);
      return;
    }

    setLoadingDetails(true);
    setError(null);

    const nutrientPriorityMap = {
      calories: [
        "energy (atwater general factors)",
        "energy (atwater specific factors)",
        "energy",
      ],
      carbs: ["carbohydrate, by difference", "carbohydrate, by summation", "carbohydrate"],
      fat: ["total lipid (fat)", "fat", "total fat"],
      protein: ["protein"],
    };

    async function fetchDetails() {
      try {
        const details = await Promise.all(
          logs.map(async (log) => {
            try {
              const res = await fetch(
                `https://api.nal.usda.gov/fdc/v1/food/${log.foodId}?api_key=${USDA_API_KEY}`
              );
              if (!res.ok)
                throw new Error(`USDA fetch failed for foodId=${log.foodId}`);

              const data = await res.json();
              const nutrients = data.foodNutrients || [];

              const getNutrientByPriority = (names) => {
                for (const name of names) {
                  const lowerName = name.toLowerCase();
                  const match = nutrients.find(
                    (n) =>
                      n.nutrient?.name?.toLowerCase() === lowerName ||
                      n.nutrient?.name?.toLowerCase().includes(lowerName)
                  );
                  if (match) return match.amount;
                }
                return 0;
              };

              const serving = Number(log.serving) || 1;

              const calories = getNutrientByPriority(nutrientPriorityMap.calories);
              const carbs = getNutrientByPriority(nutrientPriorityMap.carbs);
              const fat = getNutrientByPriority(nutrientPriorityMap.fat);
              const protein = getNutrientByPriority(nutrientPriorityMap.protein);

              return {
                name: data.description || "Unknown Food",
                calories: +(calories * serving).toFixed(1),
                carbs: +(carbs * serving).toFixed(1),
                fat: +(fat * serving).toFixed(1),
                protein: +(protein * serving).toFixed(1),
                mealType: log.mealType,
                unit: log.units,
                serving,
              };
            } catch (err) {
              console.error(err);
              return null;
            }
          })
        );
        setFoodDetails(details.filter(Boolean));
      } catch (err) {
        setError("Error fetching food details");
      } finally {
        setLoadingDetails(false);
      }
    }

    fetchDetails();
  }, [logs]);

  // 按餐别分组
  const grouped = { Breakfast: [], Lunch: [], Dinner: [] };
  foodDetails.forEach((food) => {
    const meal = food.mealType?.toLowerCase();
    if (meal === "breakfast") grouped.Breakfast.push(food);
    else if (meal === "lunch") grouped.Lunch.push(food);
    else if (meal === "dinner") grouped.Dinner.push(food);
  });

  // 总营养计算
  const totalNutrition = foodDetails.reduce(
    (acc, food) => {
      acc.calories += food.calories || 0;
      acc.carbs += food.carbs || 0;
      acc.fat += food.fat || 0;
      acc.protein += food.protein || 0;
      return acc;
    },
    { calories: 0, carbs: 0, fat: 0, protein: 0 }
  );

  // 画饼图
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { carbs, fat, protein } = totalNutrition;
    const values = [carbs, fat, protein];
    const colors = ["#36A2EB", "#FFCE56", "#4BC0C0"];
    const total = values.reduce((sum, v) => sum + v, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (total === 0) return;

    let startAngle = 0;
    values.forEach((value, i) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(100, 100);
      ctx.arc(100, 100, 80, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();
      startAngle += sliceAngle;
    });
  }, [totalNutrition]);

  return (
    <div style={{ maxWidth: 900, margin: "auto", fontFamily: "sans-serif" }}>
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
          <p>Birthday: {new Date(userInfo.birthday).toLocaleDateString()}</p>
          <p>Height: {userInfo.height} cm</p>
          <p>Weight: {userInfo.weight} kg</p>
          <p>Gender: {userInfo.gender}</p>
        </div>
      )}

      <div
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
          <h3>Total Calories: {totalNutrition.calories.toFixed(1)}</h3>
          <h3>Total Carbs: {totalNutrition.carbs.toFixed(1)}g</h3>
          <h3>Total Fat: {totalNutrition.fat.toFixed(1)}g</h3>
          <h3>Total Protein: {totalNutrition.protein.toFixed(1)}g</h3>
        </div>

        <div style={{ display: "flex", gap: "1em" }}>
          <canvas ref={canvasRef} width={200} height={200} />
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
      </div>

      <button
        onClick={() => {
          if (username) {
            setLoadingLogs(true);
            fetch(`/api/food/logs/${username}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
              .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch logs");
                return res.json();
              })
              .then((data) => {
                setLogs(data);
                setLoadingLogs(false);
              })
              .catch((err) => {
                setError(err.message);
                setLoadingLogs(false);
              });
          }
        }}
        disabled={loadingLogs}
        style={{ marginBottom: "1em" }}
      >
        🔄 Refresh
      </button>

      {loadingLogs && <p>Loading logs...</p>}
      {loadingDetails && <p>Loading food details...</p>}

      {["Breakfast", "Lunch", "Dinner"].map((mealType) => (
        <div key={mealType} style={{ marginBottom: "2em" }}>
          <h2
            style={{
              borderBottom: "1px solid #ccc",
              paddingBottom: "4px",
            }}
          >
            {mealType}
          </h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {grouped[mealType].length === 0 ? (
              <li style={{ color: "#888", fontStyle: "italic" }}>No foods logged.</li>
            ) : (
              grouped[mealType].map((food, idx) => (
                <li
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderBottom: "1px dashed #ddd",
                  }}
                >
                  <span>{food.name}</span>
                  <span>{food.calories.toFixed(1)} kcal</span>
                </li>
              ))
            )}
          </ul>
        </div>
      ))}

      {!loadingDetails && foodDetails.length === 0 && logs.length > 0 && (
        <p>No food details available.</p>
      )}
    </div>
  );
}
