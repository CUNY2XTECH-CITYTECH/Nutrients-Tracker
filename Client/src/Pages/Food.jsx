import { useState } from "react";
import "../searchBox.css";
import axios from "axios";
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/react';

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

  // Debounce function
  const debounce = (func, delay = 100) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch extended food data (popup data)
  const fetchExtendedFoodData = async (fdcId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/food/details`,
        { params: { fdcId } }
      );

      setExtendedFoodData(response.data);
      setIsOpen(true);
    } catch (err) {
      console.error("Error fetching extended food data:", err);
      setExtendedFoodData({
        food_id: fdcId,
        food_name: "Nutrition Data",
        nutrients: []
      });
      setIsOpen(true);
    }
  };

  // Search USDA API
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

  const debouncedSearch = debounce(searchUSDA, 500);

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

  return (
    <div className="food-page">
      <form className="search-box">
        <input
          type="text"
          placeholder="Enter the food"
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button type="reset" onClick={handleReset}></button>
      </form>

      {/* Search Results */}
      <div id="search-results">
        {isSearching && <div>Searching...</div>}
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
                      .map((nutrient, i) => {
                        let displayName = nutrient.nutrientName;
                        if (displayName === "Carbohydrate, by difference") displayName = "Carbs";
                        if (displayName === "Total lipid (fat)") displayName = "Fat";
                        if (displayName === "Energy") displayName = "Calories";

                        return (
                          <p key={i}>
                            {displayName}: {nutrient.value} {nutrient.unitName.toLowerCase()}
                          </p>
                        );
                      })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Food Details Dialog */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="dialog-container">
        <div className="dialog-overlay" aria-hidden="true" />
        <div className="dialog-content">
          <DialogPanel className="dialog-panel">
            <DialogTitle className="dialog-title">
              {extendedFoodData?.food_name || "Nutrition Details"}
            </DialogTitle>
            <DialogDescription className="dialog-description">
              Food ID: {extendedFoodData?.food_id}
            </DialogDescription>

            {extendedFoodData && extendedFoodData.nutrients && (
              <div className="nutrient-details">
                {extendedFoodData.nutrients.map((nutrient, i) => {
                  let displayName = nutrient.nutrientName;
                  if (displayName === "Carbohydrate, by difference") displayName = "Carbs";
                  if (displayName === "Total lipid (fat)") displayName = "Fat";
                  if (displayName === "Energy") displayName = "Calories";

                  return (
                    <div key={i} className="nutrient-row">
                      <span className="nutrient-name">{displayName}</span>
                      <span className="nutrient-value">
                        {nutrient.value} {nutrient.unitName.toLowerCase()}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="dialog-buttons">
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

      {/* Suggested foods section */}
      <div>Suggested foods of the day</div>
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
