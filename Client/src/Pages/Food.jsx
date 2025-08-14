import { useState } from "react";
import axios from "axios";
import { FoodDetailsDialog } from "../Componets/FoodDetailsDialog.jsx";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const debounce = (func, delay = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
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
    setIsDialogOpen(true);
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
                          {nutrient.nutrientName}: {nutrient.value} {nutrient.unitName.toLowerCase()}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
       <FoodDetailsDialog
        food={selectedFood}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
      

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