import { useEffect, useState, useContext, useRef } from "react";
import AuthContext from "../context/authProvider"; // Auth context provides user info and tokens
const USDA_API_KEY = "VsNxcVGrt9triez7CjKKNwKdjRidilAez1CFdvLk";

export default function FoodLogger() {
  // Get auth state from context: contains accessToken and user info (username)
  const { auth } = useContext(AuthContext);
  const accessToken = auth?.accessToken || null; // JWT token to authorize API requests
  const username = auth?.user || null; // Username string

  // Local React states to store user info, food logs, nutrition details, loading states, and errors
  const [userInfo, setUserInfo] = useState(null);
  const [logs, setLogs] = useState([]);
  const [foodDetails, setFoodDetails] = useState([]);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null); // For drawing nutrition pie chart

  // Effect: Fetch logged-in user info from backend /test endpoint, requires Authorization header
  useEffect(() => {
    if (!accessToken) {
      // If no token (not logged in), show error and skip fetching
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
        return res.json(); // Parse JSON user info from response
      })
      .then((data) => {
        setUserInfo(data); // Save user info in state
        setLoadingUser(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoadingUser(false);
      });
  }, [accessToken]);

  // Effect: Fetch food logs by username from backend /api/food/logs/:username
  // Requires valid accessToken and username, triggers when either changes
  useEffect(() => {
    if (!accessToken || !username) return; // Skip if token or username missing

    setLoadingLogs(true);
    setError(null);

    fetch(`/api/food/logs/${username}`, {
      headers: { Authorization: `Bearer ${accessToken}` }, // Send JWT for auth
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch logs"); // Handle HTTP errors
        return res.json(); // Parse JSON array of logs
      })
      .then((data) => {
        setLogs(data); // Save logs in state
        setLoadingLogs(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoadingLogs(false);
      });
  }, [accessToken, username]);

  // Effect: For each food log, fetch detailed nutrition info from USDA API
  // Runs when logs change, skips if no logs
  useEffect(() => {
    if (logs.length === 0) {
      setFoodDetails([]); // Clear details if no logs
      return;
    }

    setLoadingDetails(true);
    setError(null);

    // Nutrient name priorities for matching USDA nutrient info (some foods may have different nutrient names)
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
        // Fetch details for each food in logs in parallel
        const details = await Promise.all(
          logs.map(async (log) => {
            try {
              // Fetch from USDA API with foodId and API key
              const res = await fetch(
                `https://api.nal.usda.gov/fdc/v1/food/${log.foodId}?api_key=${USDA_API_KEY}`
              );
              if (!res.ok)
                throw new Error(`USDA fetch failed for foodId=${log.foodId}`);

              const data = await res.json();
              const nutrients = data.foodNutrients || [];

              // Helper: Try to find nutrient amount by priority names
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

              const serving = Number(log.serving) || 1; // Use serving size, default 1

              // Get nutrient amounts adjusted by serving size
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
                unit: log.unit, // fix typo here from 'units' to 'unit'
                serving,
              };
            } catch (err) {
              console.error(err);
              return null; // Skip failed fetches
            }
          })
        );
        setFoodDetails(details.filter(Boolean)); // Remove nulls
      } catch (err) {
        setError("Error fetching food details");
      } finally {
        setLoadingDetails(false);
      }
    }

    fetchDetails();
  }, [logs]);

  // Group fetched food details by mealType for display (Breakfast, Lunch, Dinner)
  const grouped = { Breakfast: [], Lunch: [], Dinner: [] };
  foodDetails.forEach((food) => {
    const meal = food.mealType?.toLowerCase();
    if (meal === "breakfast") grouped.Breakfast.push(food);
    else if (meal === "lunch") grouped.Lunch.push(food);
    else if (meal === "dinner") grouped.Dinner.push(food);
  });

  // Calculate total nutrition sums for calories, carbs, fat, protein
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

  // Draw pie chart on canvas to visualize carbs/fat/protein distribution
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const { carbs, fat, protein } = totalNutrition;
    const labels = ["Carbs", "Fat", "Protein"];
    const values = [carbs, fat, protein];
    const colors = ["#36A2EB", "#FFCE56", "#4BC0C0"];

    const total = values.reduce((sum, v) => sum + v, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (total === 0) return; // Nothing to draw

    let startAngle = 0;

    values.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(100, 100); // center point of circle
      ctx.arc(100, 100, 80, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[index];
      ctx.fill();
      startAngle += sliceAngle;
    });
  }, [totalNutrition]);

  return (
    <div style={{ maxWidth: 900, margin: "auto", fontFamily: "sans-serif" }}>
      {/* Title showing logged in username or loading text */}
      <h2 style={{ marginBottom: "0.5em" }}>
        Food Logs for {userInfo ? userInfo.username : "Loading..."}
      </h2>

      {/* Show loading or error messages */}
      {loadingUser && <p>Loading user info...</p>}
      {error && (
        <p style={{ color: "red" }}>
          <strong>Error:</strong> {error}
        </p>
      )}

      {/* User profile info section */}
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

      {/* Summary box showing total nutrition and pie chart */}
      <div
        style={{  
          display: "flex",
          justifyContent: "space-between",
          background: "#f9f9f9",
          padding: "1em",
          borderRadius: "8px",
          marginBottom: "1em",
        }}
      >
        <div>
          <h3>Total Calories: {format(totalNutrition.calories)}</h3>
          <h3>Total Carbs: {format(totalNutrition.carbs)}g</h3>
          <h3>Total Fat: {format(totalNutrition.fat)}g</h3>
          <h3>Total Protein: {format(totalNutrition.protein)}g</h3>
        </div>
        <div style={{ display: "flex", gap: "1em" }}>
          {/* Nutrition pie chart */}
          <canvas ref={canvasRef} width={200} height={200} />
          {/* Legend */}
          <div>
            <h4 style={{ margin: 0 }}>Nutritions:</h4>
            <ul style={{ listStyle: "none", padding: 0, marginTop: "0.5em" }}>
              <li><span style={{ color: "#36A2EB" }}>⬤</span> Carbs</li>
              <li><span style={{ color: "#FFCE56" }}>⬤</span> Fat</li>
              <li><span style={{ color: "#4BC0C0" }}>⬤</span> Protein</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Manual refresh button to re-fetch logs */}
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

      {/* Loading indicators */}
      {loadingLogs && <p>Loading logs...</p>}
      {loadingDetails && <p>Loading food details...</p>}

      {/* Render grouped foods by meal type */}
      {["Breakfast", "Lunch", "Dinner"].map((mealType) => (
        <div key={mealType} style={{ marginBottom: "2em" }}>
          <h2 style={{ borderBottom: "1px solid #ccc", paddingBottom: "4px" }}>{mealType}</h2>
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

      {/* Show message if logs exist but no food details */}
      {!loadingDetails && foodDetails.length === 0 && logs.length > 0 && (
        <p>No food details available.</p>
      )}
    </div>
  );
}
