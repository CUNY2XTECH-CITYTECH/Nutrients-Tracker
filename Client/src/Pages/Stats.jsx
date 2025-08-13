import React, { useState } from "react";
import { Pie, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export function Stats() {
  const [inputs, setInputs] = useState({ height: "", weight: "" }); // height in inches, weight in pounds
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const validateInputs = () => {
    const h = Number(inputs.height);
    const w = Number(inputs.weight);
    if (!h || !w || isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      return false;
    }
    return true;
  };

  const calculateNutrition = () => {
    if (!validateInputs()) {
      setError(
        "Please enter valid positive numbers for height (inches) and weight (lb)."
      );
      setData(null);
      return;
    }
    setError(null);

    // Convert height inches to meters: 1 inch = 0.0254 meters
    const heightMeters = Number(inputs.height) * 0.0254;

    // Convert weight pounds to kg: 1 lb = 0.453592 kg
    const weightKg = Number(inputs.weight) * 0.453592;

    // BMI calculation
    const bmi = (weightKg / (heightMeters * heightMeters)).toFixed(1);

    // Daily calories calculation (30 kcal per kg body weight)
    const dailyCalories = Math.round(weightKg * 30);

    // Macronutrient ratios
    const macroRatio = {
      protein: 0.25,
      carbs: 0.5,
      fat: 0.25,
    };

    // Macronutrient grams
    const proteinGrams = (dailyCalories * macroRatio.protein) / 4;
    const carbGrams = (dailyCalories * macroRatio.carbs) / 4;
    const fatGrams = (dailyCalories * macroRatio.fat) / 9;

    // Food groups based on total food grams (~weightKg * 30)
    const totalFoodGrams = weightKg * 30;

    const foodGroupsRatio = {
      fruitsVegetables: 0.4,
      grains: 0.3,
      protein: 0.2,
      dairy: 0.1,
    };

    const fruitsVegetablesGrams = +(
      totalFoodGrams * foodGroupsRatio.fruitsVegetables
    ).toFixed(1);
    const grainsGrams = +(totalFoodGrams * foodGroupsRatio.grains).toFixed(1);
    const proteinFoodGrams = +(totalFoodGrams * foodGroupsRatio.protein).toFixed(
      1
    );
    const dairyGrams = +(totalFoodGrams * foodGroupsRatio.dairy).toFixed(1);

    const pieData = {
      labels: ["Protein (g)", "Carbs (g)", "Fat (g)"],
      datasets: [
        {
          data: [proteinGrams, carbGrams, fatGrams],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
      ],
    };

    const doughnutData = {
      labels: [
        "Fruits & Vegetables (g)",
        "Grains (g)",
        "Protein (g)",
        "Dairy (g)",
      ],
      datasets: [
        {
          data: [
            fruitsVegetablesGrams,
            grainsGrams,
            proteinFoodGrams,
            dairyGrams,
          ],
          backgroundColor: ["#4caf50", "#ff9800", "#f44336", "#2196f3"],
        },
      ],
    };

    setData({
      bmi,
      dailyCalories,
      pieData,
      doughnutData,
    });
  };

  return (
    <div className="dashboard" style={{ maxWidth: 700, margin: "auto" }}>
      <h1>Welcome to your interactive stats page</h1>

      <div className="input-section" style={{ marginBottom: 20 }}>
        <input
          type="number"
          placeholder="Height (inches)"
          value={inputs.height}
          onChange={(e) => setInputs({ ...inputs, height: e.target.value })}
          style={{ marginRight: 10 }}
        />
        <input
          type="number"
          placeholder="Weight (lb)"
          value={inputs.weight}
          onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
        />
        <button onClick={calculateNutrition} style={{ marginLeft: 10 }}>
          Analyze
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {data && (
        <div className="results-section">
          <div className="metrics" style={{ marginBottom: 30 }}>
            <h3>BMI: {data.bmi}</h3>
            <h3>Daily Calories: {data.dailyCalories}</h3>
          </div>

          <div
            className="charts"
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <div style={{ width: 300 }}>
              <h3>Daily Macronutrient Breakdown</h3>
              <Pie
                data={data.pieData}
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || "";
                          const value = context.parsed || 0;
                          return `${label}: ${value.toFixed(1)} g`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>

            <div style={{ width: 300 }}>
              <h3>Daily Food Group Breakdown</h3>
              <Doughnut
                data={data.doughnutData}
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || "";
                          const value = context.parsed || 0;
                          return `${label}: ${value.toFixed(1)} g`;
                        },
                      },
                    },
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stats;