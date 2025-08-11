import { useState, useEffect } from "react";
import "../searchBox.css";
import axios from "axios";

const suggestedFoods = [
  { title: "Avocado", calories: 160, nutrients: { protein: "2g", carbs: "9g", fat: "15g" } },
  { title: "Chicken Breast", calories: 165, nutrients: { protein: "31g", carbs: "0g", fat: "3.6g" } },
];

export function Food() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
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

  return (
    <div className="food-page">
      {/* Search Box - unchanged from your original */}
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
                <h3 className="food-title">{food.description}</h3>
                {food.foodNutrients && (
                  <div className="nutrient-facts">
                    {food.foodNutrients
                      .filter(nutrient => 
                        nutrient.nutrientName === "Protein" || 
                        nutrient.nutrientName === "Carbohydrate, by difference" || 
                        nutrient.nutrientName === "Total lipid (fat)"
                      )
                      .map((nutrient, i) => (
                        <p key={i}>
                          {nutrient.nutrientName === "Carbohydrate, by difference" 
                            ? "Carbs" 
                            : nutrient.nutrientName === "Total lipid (fat)" 
                              ? "Fat" 
                              : nutrient.nutrientName}: {nutrient.value}{nutrient.unitName.toLowerCase()}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    
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
