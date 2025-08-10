import "../searchBox.css";
import { useState } from "react";
import axios from "axios";

const foodData = [
  { title: "Avocado", calories: 160, nutrients: { protein: "2g", carbs: "9g", fat: "15g" } },
  { title: "Chicken Breast", calories: 165, nutrients: { protein: "31g", carbs: "0g", fat: "3.6g" } },
];

export function Food() {
  const [foodValue, setFoodValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedFood, setSelectedFood] = useState("");
  const [selectedFoodData, setSelectedFoodData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  async function handleSubmit() {
    if (!foodValue.trim()) return;
    setLoading(true);
    try {
      console.log("Searching for:", foodValue);
      const response = await axios.post(
        "http://localhost:3000/api/food/usda-search",
        { foodValue: foodValue },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Search results:", response.data);
      const foods = response.data || [];
      setSuggestions(foods);
    } catch (error) {
      console.error("Error searching food:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }

  function handleFoodSelect(e) {
    const selectedFoodId = e.target.value;
    setSelectedFood(selectedFoodId);

    const foodDetails = suggestions.find((food) => food.foodID === selectedFoodId);
    if (foodDetails) {
      console.log("Selected food details:", foodDetails);
      setSelectedFoodData(foodDetails);
    } else {
      setSelectedFoodData(null);
    }
  }

  async function handleSaveFood(mealType) {
    if (!selectedFoodData) {
      setSaveMessage("Please select a food first!");
      return;
    }

    setSaveLoading(true);
    setSaveMessage("");

    try {
      const foodToSave = {
        foodName: selectedFoodData.name,
        mealType: mealType,
        foodID: selectedFoodData.foodID,
        serving: 100,
        units: "grams",
        calories: selectedFoodData.calories,
        carbs: selectedFoodData.carbs,
        fats: selectedFoodData.fats,
        proteins: selectedFoodData.proteins,
      };

      console.log("Saving food data:", foodToSave);

      const response = await axios.post("http://localhost:3000/api/food/save", foodToSave, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      console.log("Save response:", response.data);
      setSaveMessage(`${selectedFoodData.name} saved successfully to ${mealType}!`);
    } catch (error) {
      console.error("Error saving food:", error);
      setSaveMessage(`Failed to save food: ${error.response?.data?.message || error.message}`);
    } finally {
      setSaveLoading(false);
    }
  }

  return (
    <div className="food-page">
      <form
        className="search-box"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          value={foodValue}
          onChange={(e) => setFoodValue(e.target.value)}
          placeholder="Search for food"
        />
        <button
          type="button"
          className="clear-btn"
          onClick={() => {
            setFoodValue("");
            setSuggestions([]);
            setSelectedFood("");
            setSelectedFoodData(null);
            setSaveMessage("");
          }}
        >
          Clear
        </button>
      </form>

      <button id="searchButton" onClick={handleSubmit} disabled={loading || !foodValue.trim()}>
        {loading ? "Searching..." : "Search"}
      </button>

      {suggestions.length > 0 && (
        <div className="search-results">
          <h3>Search Results:</h3>
          <select value={selectedFood} onChange={handleFoodSelect}>
            <option value="">Select a food</option>
            {suggestions.map((food, index) => (
              <option key={food.foodID || index} value={food.foodID}>
                {food.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {foodValue && suggestions.length === 0 && !loading && (
        <div className="no-results">
          No foods found for "{foodValue}". Try a different search term.
        </div>
      )}

      {selectedFoodData && (
        <div className="selected-food-details">
          <h3>Selected Food:</h3>
          <div className="food-item selected-food">
            <h4 className="food-title">{selectedFoodData.name}</h4>
            <div className="cal-num">{selectedFoodData.calories} kcal (per 100g)</div>
            <div className="nutrient-facts">
              <p>Protein: {selectedFoodData.proteins}g</p>
              <p>Carbs: {selectedFoodData.carbs}g</p>
              <p>Fat: {selectedFoodData.fats}g</p>
            </div>

            <div className="save-buttons">
              <h4>Save to:</h4>
              <button
                onClick={() => handleSaveFood("Breakfast")}
                disabled={saveLoading}
                className="meal-save-btn"
              >
                {saveLoading ? "Saving..." : "Breakfast"}
              </button>
              <button
                onClick={() => handleSaveFood("Lunch")}
                disabled={saveLoading}
                className="meal-save-btn"
              >
                {saveLoading ? "Saving..." : "Lunch"}
              </button>
              <button
                onClick={() => handleSaveFood("Dinner")}
                disabled={saveLoading}
                className="meal-save-btn"
              >
                {saveLoading ? "Saving..." : "Dinner"}
              </button>
            </div>

            {saveMessage && (
              <div
                className="save-message"
                style={{
                  margin: "10px 0",
                  padding: "5px",
                  backgroundColor: saveMessage.includes("✅") ? "#d4edda" : "#f8d7da",
                  color: saveMessage.includes("✅") ? "#155724" : "#721c24",
                  borderRadius: "4px",
                }}
              >
                {saveMessage}
              </div>
            )}
          </div>
        </div>
      )}

      <div>Suggested foods of the day</div>
      <div className="suggested-food-items-container">
        {foodData.map((food, index) => (
          <div key={index} className="food-item">
            <h3 className="food-title">{food.title}</h3>
            <div className="cal-num">{food.calories} kcal</div>
            <div className="nutrient-facts">
              <p>Protein: {food.nutrients.protein}</p>
              <p>Carbs: {food.nutrients.carbs}</p>
              <p>Fat: {food.nutrients.fat}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
