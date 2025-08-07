import { useEffect, useState, useRef } from "react";

const API_KEY = "VsNxcVGrt9triez7CjKKNwKdjRidilAez1CFdvLk";

export default function FoodLogger({ username = "qqqqqqqq" }) {
  const [logs, setLogs] = useState([]);
  const [foodDetails, setFoodDetails] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  // Fetch user logs
  const loadLogs = () => {
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

  useEffect(() => {
    loadLogs();
  }, [username]);

  // Fetch food details for logs
  useEffect(() => {
    if (logs.length === 0) {
      setFoodDetails([]);
      return;
    }

    setLoadingDetails(true);
    setError(null);

    const nutrientPriorityMap = {
      calories: ["energy (atwater general factors)", "energy (atwater specific factors)", "energy"],
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
            if (!res.ok) throw new Error(`Failed USDA fetch for foodId=${log.foodId}`);

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
              date: new Date(log.date).toLocaleDateString(),
              mealType: log.mealType,
              unit: log.unit,
              serving: serving,
            };
          } catch (err) {
            console.error(err);
            return null;
          }
        })
      );

      setFoodDetails(details.filter(Boolean));
      setLoadingDetails(false);
    };

    fetchDetails();
  }, [logs]);

  // Group foods by mealType ignoring case
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

  // Calculate total nutrition
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

  // Draw pie chart of macros
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
    <div style={{ maxWidth: "900px", margin: "auto", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: "0.5em" }}>Food Logs for {username}</h2>

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

      {error && (
        <p style={{ color: "red" }}>
          <strong>Error:</strong> {error}
        </p>
      )}

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

      {!loadingDetails && foodDetails.length === 0 && logs.length > 0 && <p>No food details available.</p>}
    </div>
  );
}
