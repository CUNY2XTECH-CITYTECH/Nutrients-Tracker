import React, { useState, useEffect } from "react";
import { Pie, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export function Stats() {
  const [user, setUser] = useState(null);
  const [activity, setActivity] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  const activityMultiplier = {
    "Less than 30 min/day": 1.2,
    "30 to 60 min/day": 1.5,
    "More than 60 min/day": 1.75,
  };

  // Fetch user info from backend API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user info");
        const userInfo = await res.json();
        setUser(userInfo);
      } catch (err) {
        setError("Failed to load user info.");
      }
    };
    fetchUser();
  }, []);

  if (!user) return <p>Loading user info...</p>;

  const calculateNutrition = () => {
    if (!activity) {
      setError("Please select your physical activity.");
      return;
    }
    setError(null);

    const heightMeters = user.height * 0.0254;
    const weightKg = user.weight * 0.453592;

    // Current stats
    const bmi = (weightKg / (heightMeters * heightMeters)).toFixed(1);
    const currentCalories = Math.round(weightKg * 30);
    const recommendedCalories = Math.round(currentCalories * activityMultiplier[activity]);

    // Macronutrients
    const macroRatio = { protein: 0.25, carbs: 0.5, fat: 0.25 };
    const calculateMacros = (calories) => ({
      protein: (calories * macroRatio.protein) / 4,
      carbs: (calories * macroRatio.carbs) / 4,
      fat: (calories * macroRatio.fat) / 9,
    });

    const currentMacros = calculateMacros(currentCalories);
    const recommendedMacros = calculateMacros(recommendedCalories);

    // Food groups
    const foodGroupsRatio = { fruitsVegetables: 0.4, grains: 0.3, protein: 0.2, dairy: 0.1 };
    const totalFoodGrams = weightKg * 30;
    const calculateFoodGroups = (factor = 1) => ({
      fruitsVegetables: +(totalFoodGrams * foodGroupsRatio.fruitsVegetables * factor).toFixed(1),
      grains: +(totalFoodGrams * foodGroupsRatio.grains * factor).toFixed(1),
      protein: +(totalFoodGrams * foodGroupsRatio.protein * factor).toFixed(1),
      dairy: +(totalFoodGrams * foodGroupsRatio.dairy * factor).toFixed(1),
    });

    const currentFoodGroups = calculateFoodGroups(1);
    const recommendedFoodGroups = calculateFoodGroups(activityMultiplier[activity]);

    // Pie chart (macros)
    const pieData = {
      labels: ["Protein (g)", "Carbs (g)", "Fat (g)"],
      datasets: [
        {
          label: "Current",
          data: [currentMacros.protein, currentMacros.carbs, currentMacros.fat],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
        {
          label: "Recommended",
          data: [recommendedMacros.protein, recommendedMacros.carbs, recommendedMacros.fat],
          backgroundColor: ["#FF99AA", "#66B2FF", "#FFE699"],
        },
      ],
    };

    // Doughnut chart (food groups)
    const doughnutData = {
      labels: ["Fruits & Vegetables (g)", "Grains (g)", "Protein (g)", "Dairy (g)"],
      datasets: [
        {
          label: "Current",
          data: [
            currentFoodGroups.fruitsVegetables,
            currentFoodGroups.grains,
            currentFoodGroups.protein,
            currentFoodGroups.dairy,
          ],
          backgroundColor: ["#4caf50", "#ff9800", "#f44336", "#2196f3"],
        },
        {
          label: "Recommended",
          data: [
            recommendedFoodGroups.fruitsVegetables,
            recommendedFoodGroups.grains,
            recommendedFoodGroups.protein,
            recommendedFoodGroups.dairy,
          ],
          backgroundColor: ["#A5D6A7", "#FFCC80", "#F28B82", "#90CAF9"],
        },
      ],
    };

    setData({
      bmi,
      currentCalories,
      recommendedCalories,
      pieData,
      doughnutData,
    });

    setStep(2);
  };

  const tooltipCallback = (context) => {
    const datasetLabel = context.dataset.label;
    const value = context.parsed;
    return `${datasetLabel}: ${value.toFixed(1)} g`;
  };

  // Step 1: activity selection
  if (step === 1)
    return (
      <div style={{ maxWidth: 500, margin: "auto" }}>
        <h1>Welcome, {user.name}</h1>
        <p>
          Height: {user.height} in | Weight: {user.weight} lb | Gender: {user.gender}
        </p>
        <select value={activity} onChange={(e) => setActivity(e.target.value)}>
          <option value="">Select Physical Activity</option>
          <option value="Less than 30 min/day">
            Less than 30 min/day of moderate activity
          </option>
          <option value="30 to 60 min/day">
            30 to 60 min/day of moderate activity
          </option>
          <option value="More than 60 min/day">
            More than 60 min/day of moderate activity
          </option>
        </select>
        <button onClick={calculateNutrition} style={{ marginLeft: 10 }}>
          View your stats, charts, and food plan
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );

  // Step 2: display stats and charts
  return (
    <div style={{ maxWidth: 700, margin: "auto" }}>
      <h1>Hello, {user.name}</h1>
      <p>
        Height: {user.height} in | Weight: {user.weight} lb | Gender: {user.gender} | Age: {user.age}
      </p>

      <div style={{ marginBottom: 20 }}>
        <h3>Current BMI: {data.bmi}</h3>
        <h3>Current Calories: {data.currentCalories}</h3>
        <h3>Recommended Calories: {data.recommendedCalories}</h3>
      </div>

      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div style={{ width: 300 }}>
          <h3>Macronutrient Breakdown</h3>
          <Pie
            data={data.pieData}
            options={{
              responsive: true,
              plugins: { tooltip: { callbacks: { label: tooltipCallback } }, legend: { position: "bottom" } },
            }}
          />
        </div>
        <div style={{ width: 300 }}>
          <h3>Food Group Breakdown</h3>
          <Doughnut
            data={data.doughnutData}
            options={{
              responsive: true,
              plugins: { tooltip: { callbacks: { label: tooltipCallback } }, legend: { position: "bottom" } },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Stats;