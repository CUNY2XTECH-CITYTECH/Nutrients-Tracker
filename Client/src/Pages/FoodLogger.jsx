import React, { useEffect, useRef } from "react";

export function FoodLogger() {
  const canvasRef = useRef(null);

  const data = { //Example Data
    foods: {
      1: { name: "Egg", calories: 78, carbs: 0.6, fat: 5, protein: 6 },
      2: { name: "Rice", calories: 206, carbs: 45, fat: 0.4, protein: 4 },
      3: { name: "Chicken Breast", calories: 165, carbs: 0, fat: 3.6, protein: 31 },
      4: { name: "Apple", calories: 95, carbs: 25, fat: 0.3, protein: 0.5 }
    },
    logs: [
      { foodId: 1, mealType: "Breakfast" },
      { foodId: 1, mealType: "Breakfast" },
      { foodId: 2, mealType: "Lunch" },
      { foodId: 3, mealType: "Lunch" },
      { foodId: 3, mealType: "Lunch" },
      { foodId: 4, mealType: "Dinner" },
      { foodId: 4, mealType: "Breakfast" },
      { foodId: 4, mealType: "Lunch" },
      { foodId: 3, mealType: "Dinner" },
      { foodId: 2, mealType: "Dinner" },
      { foodId: 1, mealType: "Dinner" },
    ]
  };

  const { foods, logs } = data;

  const meals = {
    Breakfast: [],
    Lunch: [],
    Dinner: []
  };

  logs.forEach(({ foodId, mealType }) => {
    const food = foods[foodId];
    if (food && meals[mealType]) {
      meals[mealType].push(food);
    }
  });

  const totalNutrition = logs.reduce(
    (acc, { foodId }) => {
      const food = foods[foodId];
      if (food) {
        acc.calories += food.calories || 0;
        acc.carbs += food.carbs || 0;
        acc.fat += food.fat || 0;
        acc.protein += food.protein || 0;
      }
      return acc;
    },
    { calories: 0, carbs: 0, fat: 0, protein: 0 }
  );

  const format = (num) => parseFloat(num.toFixed(1));
  //Graph
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
    let startAngle = 0;

    values.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(100, 100);
      ctx.arc(100, 100, 80, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[index];
      ctx.fill();
      startAngle += sliceAngle;
    }); 
  }, [totalNutrition]);

  return (
    <div style={{ maxWidth: "900px", margin: "auto", fontFamily: "sans-serif" , marginLeft: "220px"}}>
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
          <canvas ref={canvasRef} width={200} height={200} />
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

      {["Breakfast", "Lunch", "Dinner"].map((mealType) => (
        <div key={mealType} style={{ marginBottom: "2em" }}>
          <h2 style={{ borderBottom: "1px solid #ccc", paddingBottom: "4px" }}>{mealType}</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {meals[mealType].map((food, idx) => (
              <li
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: "1px dashed #ddd"
                }}
              >
                <span>{food.name}</span>
                <span>{food.calories} kcal</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
