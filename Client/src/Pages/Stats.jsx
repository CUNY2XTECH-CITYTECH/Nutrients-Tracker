import React, { useState } from "react";
import { Pie, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export function Stats() {
  const [inputs, setInputs] = useState({ feet: "", inches: "", weight: "", goal: "lose" });
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const validateInputs = () => {
    const ft = Number(inputs.feet || 0);
    const inch = Number(inputs.inches || 0);
    const w = Number(inputs.weight || 0);
    return ft >= 0 && inch >= 0 && w > 0;
  };

  const calculateNutrition = () => {
    if (!validateInputs()) {
      setError("Please enter valid positive numbers for height (feet & inches) and weight (lb).");
      setData(null);
      return;
    }
    setError(null);

    const totalInches = Number(inputs.feet || 0) * 12 + Number(inputs.inches || 0);
    const heightMeters = totalInches * 0.0254;
    const weightKg = Number(inputs.weight) * 0.453592;

    const bmi = (weightKg / (heightMeters * heightMeters)).toFixed(1);

    // Current calories (based on baseline multiplier)
    let calorieMultiplier = inputs.goal === "gain" ? 35 : 28;
    const dailyCalories = Math.round(weightKg * calorieMultiplier);

    // Recommended calories based on goal
    let recommendedBMI = inputs.goal === "gain" ? 23 : 21;
    let recommendedCalories =
      inputs.goal === "gain"
        ? Math.round(dailyCalories * 1.1) // increase for muscle gain
        : Math.round(dailyCalories * 0.9); // decrease for weight loss

    // Macronutrients (protein 25%, carbs 50%, fat 25%)
    const macroRatio = { protein: 0.25, carbs: 0.5, fat: 0.25 };

    const proteinGrams = (dailyCalories * macroRatio.protein) / 4;
    const carbGrams = (dailyCalories * macroRatio.carbs) / 4;
    const fatGrams = (dailyCalories * macroRatio.fat) / 9;

    const recommendedProteinGrams = (recommendedCalories * macroRatio.protein) / 4;
    const recommendedCarbGrams = (recommendedCalories * macroRatio.carbs) / 4;
    const recommendedFatGrams = (recommendedCalories * macroRatio.fat) / 9;

    // Food group grams
    const totalFoodGrams = weightKg * 30;
    const foodGroupsRatio = { fruits: 0.2, vegetables: 0.2, grains: 0.3, protein: 0.2, dairy: 0.1 };

    const fruitsGrams = +(totalFoodGrams * foodGroupsRatio.fruits).toFixed(1);
    const vegetablesGrams = +(totalFoodGrams * foodGroupsRatio.vegetables).toFixed(1);
    const grainsGrams = +(totalFoodGrams * foodGroupsRatio.grains).toFixed(1);
    const proteinFoodGrams = +(totalFoodGrams * foodGroupsRatio.protein).toFixed(1);
    const dairyGrams = +(totalFoodGrams * foodGroupsRatio.dairy).toFixed(1);

    const recommendedTotalFoodGrams = totalFoodGrams * 1.1;
    const recommendedFruitsGrams = +(recommendedTotalFoodGrams * foodGroupsRatio.fruits).toFixed(1);
    const recommendedVegetablesGrams = +(recommendedTotalFoodGrams * foodGroupsRatio.vegetables).toFixed(1);
    const recommendedGrainsGrams = +(recommendedTotalFoodGrams * foodGroupsRatio.grains).toFixed(1);
    const recommendedProteinFoodGrams = +(recommendedTotalFoodGrams * foodGroupsRatio.protein).toFixed(1);
    const recommendedDairyGrams = +(recommendedTotalFoodGrams * foodGroupsRatio.dairy).toFixed(1);

    setData({
      bmi,
      recommendedBMI,
      dailyCalories,
      recommendedCalories,
      pieCurrent: [proteinGrams, carbGrams, fatGrams],
      pieRecommended: [recommendedProteinGrams, recommendedCarbGrams, recommendedFatGrams],
      doughnutCurrent: [fruitsGrams, vegetablesGrams, grainsGrams, proteinFoodGrams, dairyGrams],
      doughnutRecommended: [recommendedFruitsGrams, recommendedVegetablesGrams, recommendedGrainsGrams, recommendedProteinFoodGrams, recommendedDairyGrams],
      goal: inputs.goal
    });
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "right" },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed.toFixed(1)} g`,
        },
      },
    },
  };

  const doughnutOptions = { ...pieOptions };

  const getRecommendedFoods = (goal) => {
    // Healthy food suggestions based on goal
    if (goal === "lose") {
      return {
        Breakfast: ["Oatmeal with Berries", "Egg Whites", "Greek Yogurt"],
        Lunch: ["Grilled Chicken Salad", "Quinoa & Veggies", "Tuna Wrap"],
        Dinner: ["Baked Salmon", "Steamed Broccoli", "Brown Rice"]
      };
    } else {
      // Build muscle
      return {
        Breakfast: ["Omelet with Veggies", "Protein Pancakes", "Greek Yogurt & Nuts"],
        Lunch: ["Grilled Chicken Breast", "Brown Rice & Beans", "Salmon Salad"],
        Dinner: ["Steak & Sweet Potatoes", "Quinoa Bowl with Protein", "Grilled Fish"]
      };
    }
  };

  return (
    <div style={{ maxWidth: 950, margin: "auto", textAlign: "center" }}>
      <h1>Interactive BMI & Nutrition Stats</h1>
      <div style={{ marginBottom: 20 }}>
        <input
          type="number"
          placeholder="Feet"
          value={inputs.feet}
          onChange={(e) => setInputs({ ...inputs, feet: e.target.value })}
          style={{ marginRight: 10 }}
        />
        <input
          type="number"
          placeholder="Inches"
          value={inputs.inches}
          onChange={(e) => setInputs({ ...inputs, inches: e.target.value })}
          style={{ marginRight: 10 }}
        />
        <input
          type="number"
          placeholder="Weight (lb)"
          value={inputs.weight}
          onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          style={{ marginRight: 10 }}
        />
        <select
          value={inputs.goal}
          onChange={(e) => setInputs({ ...inputs, goal: e.target.value })}
          style={{ marginRight: 10 }}
        >
          <option value="lose">Lose Weight</option>
          <option value="gain">Build Muscle Mass</option>
        </select>
        <button onClick={calculateNutrition}>Analyze</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {data && (
        <>
          <div style={{ marginBottom: 30 }}>
            <h3>Current BMI: {data.bmi}</h3>
            <h3>Recommended BMI: {data.recommendedBMI}</h3>
            <h3>Current Calories: {data.dailyCalories}</h3>
            <h3>Recommended Calories: {data.recommendedCalories}</h3>
          </div>

          <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
            <div style={{ width: 300 }}>
              <h3>Macronutrients (Current)</h3>
              <Pie
                data={{
                  labels: ["Protein", "Carbs", "Fat"],
                  datasets: [{ data: data.pieCurrent, backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"] }],
                }}
                options={pieOptions}
              />
            </div>
            <div style={{ width: 300 }}>
              <h3>Macronutrients (Recommended)</h3>
              <Pie
                data={{
                  labels: ["Protein", "Carbs", "Fat"],
                  datasets: [{ data: data.pieRecommended, backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"] }],
                }}
                options={pieOptions}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", marginTop: 30 }}>
            <div style={{ width: 300 }}>
              <h3>Food Groups (Current)</h3>
              <Doughnut
                data={{
                  labels: ["Fruits", "Vegetables", "Grains", "Protein", "Dairy"],
                  datasets: [{ data: data.doughnutCurrent, backgroundColor: ["#4caf50", "#8bc34a", "#ff9800", "#f44336", "#2196f3"] }],
                }}
                options={doughnutOptions}
              />
            </div>
            <div style={{ width: 300 }}>
              <h3>Food Groups (Recommended)</h3>
              <Doughnut
                data={{
                  labels: ["Fruits", "Vegetables", "Grains", "Protein", "Dairy"],
                  datasets: [{ data: data.doughnutRecommended, backgroundColor: ["#4caf50", "#8bc34a", "#ff9800", "#f44336", "#2196f3"] }],
                }}
                options={doughnutOptions}
              />
            </div>
          </div>

          {/* Healthy Food Recommendations */}
          <div style={{ marginTop: 40, textAlign: "center" }}>
            <h2>Healthy Foods for Your Goal</h2>
            {Object.entries(getRecommendedFoods(data.goal)).map(([meal, foods]) => (
              <div key={meal} style={{ marginTop: 30 }}>
                <h3>{meal}</h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {foods.map((food, idx) => (
                    <li key={idx} style={{ margin: "6px 0" }}>
                      🍽️ {food}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Stats;