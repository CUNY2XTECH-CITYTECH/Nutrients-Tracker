// src/Pages/FoodLogger.jsx
import { useEffect, useState } from "react";

const API_KEY = "VsNxcVGrt9triez7CjKKNwKdjRidilAez1CFdvLk";

export default function FoodLogger({ username = "qqqqqqqq" }) {
  const [logs, setLogs] = useState([]);
  const [foodDetails, setFoodDetails] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);

  // 获取日志
  useEffect(() => {
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
  }, [username]);

  // 根据日志调用 USDA API 获取营养信息
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
      carbs: ["carbohydrate, by summation", "carbohydrate"],
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
            if (!res.ok) throw new Error("Failed to fetch USDA food data");
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
              return null;
            };

            const calories = getNutrientByPriority(nutrientPriorityMap.calories);
            const carbs = getNutrientByPriority(nutrientPriorityMap.carbs);
            const fat = getNutrientByPriority(nutrientPriorityMap.fat);
            const protein = getNutrientByPriority(nutrientPriorityMap.protein);

            return {
              name: data.description || "Unknown Food",
              calories: calories ? (calories * log.serving).toFixed(2) : "N/A",
              carbs: carbs ? (carbs * log.serving).toFixed(2) : "N/A",
              fat: fat ? (fat * log.serving).toFixed(2) : "N/A",
              protein: protein ? (protein * log.serving).toFixed(2) : "N/A",
              date: new Date(log.date).toLocaleDateString(),
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

  return (
    <div>
      <h2>Food Logs for {username}</h2>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {loadingLogs && <p>Loading logs...</p>}
      {!loadingLogs && logs.length === 0 && <p>No food logs found.</p>}

      {loadingDetails && <p>Loading food details...</p>}

      {!loadingDetails && foodDetails.length > 0 && (
        <ul>
          {foodDetails.map((food, idx) => (
            <li key={idx}>
              <strong>{food.name}</strong> ({food.date})<br />
              Calories: {food.calories} kcal<br />
              Carbs: {food.carbs} g<br />
              Fat: {food.fat} g<br />
              Protein: {food.protein} g
            </li>
          ))}
        </ul>
      )}

      {!loadingDetails && foodDetails.length === 0 && logs.length > 0 && (
        <p>No food details available.</p>
      )}
    </div>
  );
}
