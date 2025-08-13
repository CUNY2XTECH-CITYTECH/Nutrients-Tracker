import { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import "../App.css";

const suggestedFoods = [
  { title: "Avocado", calories: 160, nutrients: { protein: "2g", carbs: "9g", fat: "15g" } },
  { title: "Chicken Breast", calories: 165, nutrients: { protein: "31g", carbs: "0g", fat: "3.6g" } },
];

export function Food() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [extendedFoodData, setExtendedFoodData] = useState(null);
  const [error, setError] = useState(null);

  const debounce = (func, delay = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const fetchExtendedFoodData = async (fdcId) => {
    try {
      setError(null);
      const response = await axios.get(
        `http://localhost:3000/api/food/details`,
        { params: { fdcId } }
      );
      
      const data = response.data;
      console.log("API Response:", data); // Debug log
      
      if (!data.nutrients || data.nutrients.length === 0) {
        throw new Error("No nutrient data available");
      }
      
      setExtendedFoodData(data);
      setIsOpen(true);
    } catch (err) {
      console.error("Error fetching extended food data:", err);
      setError(err.message);
      setExtendedFoodData({
        food_id: fdcId,
        food_name: selectedFood?.description || "Nutrition Data",
        nutrients: []
      });
      setIsOpen(true);
    }
  };

  const searchUSDA = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/food/search",
        { food: term },
        { headers: { "Content-Type": "application/json" } }
      );
      setSearchResults(response.data);
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = debounce(searchUSDA);

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleDetailsClick = (food) => {
    setSelectedFood(food);
    fetchExtendedFoodData(food.fdcId);
  };

  const formatNutrientName = (name) => {
    return name
      .replace("Carbohydrate, by difference", "Carbs")
      .replace("Total lipid (fat)", "Fat")
      .replace("Energy", "Calories")
      .replace(/, total$/, '')
      .replace("total ", '')
      .replace("Vitamin ", "Vit. ");
  };

  return (
    <div className="food-page">
      <form className="search-box">
        <input
          type="text"
          placeholder="Search for foods..."
          value={searchTerm}
          onChange={handleInputChange}
        />
        {searchTerm && (
          <button type="reset" onClick={handleReset} className="clear-button">
            ×
          </button>
        )}
      </form>

      <div id="search-results">
        {isSearching && <div className="search-loading">Searching...</div>}
        {!isSearching && searchResults.length > 0 && (
          <div className="suggested-food-items-container">
            {searchResults.slice(0, 5).map((food, index) => (
              <div key={index} className="food-item">
                <div className="food-item-header">
                  <h3 className="food-title">{food.description}</h3>
                  <button
                    className="details-button"
                    onClick={() => handleDetailsClick(food)}
                  >
                    View Details
                  </button>
                </div>
                {food.foodNutrients && (
                  <div className="nutrient-facts">
                    {food.foodNutrients
                      .filter(
                        (nutrient) =>
                          nutrient.nutrientName === "Protein" ||
                          nutrient.nutrientName === "Carbohydrate, by difference" ||
                          nutrient.nutrientName === "Total lipid (fat)" ||
                          nutrient.nutrientName === "Energy"
                      )
                      .map((nutrient, i) => (
                        <p key={i}>
                          {formatNutrientName(nutrient.nutrientName)}: {nutrient.value} {nutrient.unitName.toLowerCase()}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="dialog-container">
        <div className="dialog-overlay" aria-hidden="true" />
        <div className="dialog-content">
          <DialogPanel className="dialog-panel">
            <DialogTitle className="dialog-title">
              Nutrition Facts - {extendedFoodData?.food_name || selectedFood?.description || "Nutrition Details"}
            </DialogTitle>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="nutrient-details">
              {extendedFoodData?.nutrients?.length > 0 ? (
                <div className="nutrition-facts-panel">
                  <div className="serving-info">
                    <p><strong>Nutrition Facts</strong></p>
                    <p>Per 100g serving</p>
                  </div>
                  
                  <div className="calories-section">
                    {extendedFoodData.nutrients
                      .filter(nutrient => nutrient.nutrientName === 'Energy')
                      .map((nutrient, i) => (
                        <div key={i} className="calories-display">
                          <strong>Calories: {nutrient.value}</strong>
                        </div>
                      ))}
                  </div>

                  <div className="macros-section">
                    <h4>Macronutrients</h4>
                    <div className="nutrient-list">
                      {extendedFoodData.nutrients
                        .filter(nutrient => 
                          ['Protein', 'Carbohydrate, by difference', 'Total lipid (fat)'].includes(nutrient.nutrientName))
                        .map((nutrient, i) => (
                          <div key={i} className="nutrient-row">
                            <span className="nutrient-name">
                              {formatNutrientName(nutrient.nutrientName)}
                            </span>
                            <span className="nutrient-value">
                              {nutrient.value}g
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {extendedFoodData.nutrients.some(nutrient => 
                    ['Sugars, total', 'Fiber, total dietary', 'Cholesterol'].includes(nutrient.nutrientName)) && (
                    <div className="additional-macros">
                      <h4>Additional Information</h4>
                      <div className="nutrient-list">
                        {extendedFoodData.nutrients
                          .filter(nutrient => 
                            ['Sugars, total', 'Fiber, total dietary', 'Cholesterol'].includes(nutrient.nutrientName))
                          .map((nutrient, i) => (
                            <div key={i} className="nutrient-row">
                              <span className="nutrient-name">
                                {formatNutrientName(nutrient.nutrientName)}
                              </span>
                              <span className="nutrient-value">
                                {nutrient.value} {nutrient.unitName.toLowerCase()}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {extendedFoodData.nutrients.some(nutrient => 
                    ['Calcium, Ca', 'Iron, Fe', 'Potassium, K', 'Sodium, Na'].includes(nutrient.nutrientName)) && (
                    <div className="minerals-section">
                      <h4>Minerals</h4>
                      <div className="nutrient-list">
                        {extendedFoodData.nutrients
                          .filter(nutrient => 
                            ['Calcium, Ca', 'Iron, Fe', 'Potassium, K', 'Sodium, Na'].includes(nutrient.nutrientName))
                          .map((nutrient, i) => (
                            <div key={i} className="nutrient-row">
                              <span className="nutrient-name">
                                {formatNutrientName(nutrient.nutrientName)}
                              </span>
                              <span className="nutrient-value">
                                {nutrient.value} {nutrient.unitName.toLowerCase()}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {extendedFoodData.nutrients.some(nutrient => 
                    ['Vitamin C, total ascorbic acid', 'Vitamin A, RAE', 'Vitamin D (D2 + D3)'].includes(nutrient.nutrientName)) && (
                    <div className="vitamins-section">
                      <h4>Vitamins</h4>
                      <div className="nutrient-list">
                        {extendedFoodData.nutrients
                          .filter(nutrient => 
                            ['Vitamin C, total ascorbic acid', 'Vitamin A, RAE', 'Vitamin D (D2 + D3)'].includes(nutrient.nutrientName))
                          .map((nutrient, i) => (
                            <div key={i} className="nutrient-row">
                              <span className="nutrient-name">
                                {formatNutrientName(nutrient.nutrientName)}
                              </span>
                              <span className="nutrient-value">
                                {nutrient.value} {nutrient.unitName.toLowerCase()}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-nutrients">No detailed nutrition information available</div>
              )}
            </div>

            <div className="dialog-buttons">
              <button
                onClick={() => {
                  // Handle save functionality here
                  console.log("Save food:", extendedFoodData);
                  // You can add your save logic here
                }}
                className="dialog-button save-button"
              >
                Save
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="dialog-button close-button"
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <h2 className="section-title">Suggested foods of the day</h2>
      <div className="suggested-food-items-container">
        {suggestedFoods.map((food, index) => (
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