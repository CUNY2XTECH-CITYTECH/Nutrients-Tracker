import { useEffect, useState, useRef } from "react";

// USDA API Key for fetching detailed food nutrition info
const API_KEY = "VsNxcVGrt9triez7CjKKNwKdjRidilAez1CFdvLk";

export default function FoodLogger() {
  // State to store user information fetched from the backend
  const [userInfo, setUserInfo] = useState(null);

  // State to store food logs loaded by username from backend
  const [logs, setLogs] = useState([]);

  // State to store detailed nutrition information for each food log,
  // fetched from USDA API based on foodId
  const [foodDetails, setFoodDetails] = useState([]);

  // Loading states for different async operations
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Error message state for any fetch or processing error
  const [error, setError] = useState(null);

  // Ref to the canvas element used for drawing nutrition pie chart
  const canvasRef = useRef(null);

  // Extract username from loaded userInfo, fallback to empty string if unavailable
  const username = userInfo?.username || "";

  /**
   * 1. Load current user information when component mounts
   * - Fetch from /api/test endpoint
   * - Update userInfo state on success
   * - Handle errors and loading states properly
   */
  useEffect(() => {
    setLoadingUser(true);
    setError(null);
    fetch("/api/test")
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
  }, []);

  /**
   * 2. Load food logs based on current username
   * - Fetch from /api/food/logs/:username endpoint
   * - Update logs state on success
   * - Handle errors and loading states
   */
  const loadLogs = () => {
    if (!username) return; // Prevent fetch if username not available

    setLoadingLogs(true);
    setError(null);

    fetch(`/api/food/logs/${username}`)
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
  };

  // Automatically trigger log loading whenever username changes
  useEffect(() => {
    loadLogs();
  }, [username]);

  /**
   * 3. Load detailed nutrition info for each food log using USDA API
   * - Triggered whenever logs array changes
   * - For each log, fetch USDA food details by foodId
   * - Extract calories, carbs, fat, protein according to priority mapping
   * - Multiply by serving size to get actual nutrition values
   * - Aggregate results into foodDetails state
   */
  useEffect(() => {
    if (logs.length === 0) {
      setFoodDetails([]);
      return;
    }

    setLoadingDetails(true);
    setError(null);

    // Priority mapping for nutrients, tries in order to get the best match
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

    const fetchDetails = async () => {
      const details = await Promise.all(
        logs.map(async (log) => {
          try {
            const res = await fetch(
              `https://api.nal.usda.gov/fdc/v1/food/${log.foodId}?api_key=${API_KEY}`
            );
            if (!res.ok)
              throw new Error(`Failed USDA fetch for foodId=${log.foodId}`);

            const data = await res.json();
            const nutrients = data.foodNutrients || [];

            // Helper function: tries nutrient names in priority order,
            // returns the first matched nutrient amount or 0 if none found
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

            // Default serving size to 1 if missing or invalid
            const serving = Number(log.serving) || 1;

            // Extract nutrient amounts by priority, then scale by serving
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
              date: new Date(log.date).toLocaleDateString(),
              mealType: log.mealType,
              unit: log.unit,
              serving: serving,
            };
          } catch (err) {
            console.error(err);
            return null; // skip failed fetches
          }
        })
      );

      // Filter out null results and update state
      setFoodDetails(details.filter(Boolean));
      setLoadingDetails(false);
    };

    fetchDetails();
  }, [logs]);

  /**
   * Group foods by meal type (Breakfast, Lunch, Dinner)
   * - Convert mealType to lowercase and match accordingly
   * - Default to empty arrays if no matching mealType
   */
  const grouped = {
    Breakfast: [],
    Lunch: [],
    Dinner: [],
  };

  foodDetails.forEach((food) => {
    const meal = food.mealType?.toLowerCase();
    if (meal === "breakfast") grouped.Breakfast.push(food);
    else if (meal === "lunch") grouped.Lunch.push(food);
    else if (meal === "dinner") grouped.Dinner.push(food);
  });

  /**
   * Calculate total nutrition sums for calories, carbs, fat, and protein
   * - Used for summary display and pie chart
   */
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

  /**
   * Draw pie chart on canvas for nutrition breakdown (Carbs, Fat, Protein)
   * - Runs whenever totalNutrition changes
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const { carbs, fat, protein } = totalNutrition;
    const values = [carbs, fat, protein];
    const colors = ["#36A2EB", "#FFCE56", "#4BC0C0"]; // Colors for carbs, fat, protein respectively
    const total = values.reduce((sum, v) => sum + v, 0);

    // Clear previous drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // If no data, do not draw
    if (total === 0) return;

    // Draw pie slices proportionally
    let startAngle = 0;
    values.forEach((value, i) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(100, 100); // center point
      ctx.arc(100, 100, 80, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();
      startAngle += sliceAngle;
    });
  }, [totalNutrition]);

  /**
   * JSX Render:
   * - Display user info with loading/error states
   * - Show total nutrition summary with a pie chart
   * - Button to refresh logs manually
   * - Show loading states for logs and details
   * - Grouped food logs by meal type listing only name and calories
   */
  return (
    <div style={{ maxWidth: "900px", margin: "auto", fontFamily: "sans-serif" }}>
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

      <button onClick={loadLogs} disabled={loadingLogs} style={{ marginBottom: "1em" }}>
        🔄 Refresh
      </button>

      {loadingLogs && <p>Loading logs...</p>}
      {loadingDetails && <p>Loading food details...</p>}

      {foodDetails.length > 0 &&
        ["Breakfast", "Lunch", "Dinner"].map((mealType) => (
          <div key={mealType} style={{ marginBottom: "2em" }}>
            <h2 style={{ borderBottom: "1px solid #ccc", paddingBottom: "4px" }}>{mealType}</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {grouped[mealType].map((food, idx) => (
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
              ))}
            </ul>
          </div>
        ))}

      {!loadingDetails && foodDetails.length === 0 && logs.length > 0 && (
        <p>No food details available.</p>
      )}
    </div>
  );
}
