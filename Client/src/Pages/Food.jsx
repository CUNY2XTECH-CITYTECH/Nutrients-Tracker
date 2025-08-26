import { useState, useContext } from "react";
import "../searchBox.css";
import axios from "axios";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
} from "@headlessui/react";
import AuthContext from "../context/authProvider";


// Nutrient mapping for display names
const nutrientMap = {
  Energy: "Calories",
  Protein: "Protein",
  "Carbohydrate, by difference": "Carbs",
  "Total lipid (fat)": "Fats",
  "Fiber, total dietary": "Fiber",
  "Sugars, total including NLEA": "Sugar",
  "Vitamin A, RAE": "Vitamin A",
  Thiamin: "Vitamin B1",
  Riboflavin: "Vitamin B2",
  Niacin: "Vitamin B3",
  "Pantothenic acid": "Vitamin B5",
  "Vitamin B-6": "Vitamin B6",
  Biotin: "Vitamin B7",
  "Folate, total": "Vitamin B9",
  "Vitamin B-12": "Vitamin B12",
  "Vitamin C, total ascorbic acid": "Vitamin C",
  "Vitamin D (D2 + D3)": "Vitamin D",
  "Vitamin E (alpha-tocopherol)": "Vitamin E",
  "Vitamin K (phylloquinone)": "Vitamin K",
  "Calcium, Ca": "Calcium",
  "Copper, Cu": "Copper",
  "Iodine, I": "Iodine",
  "Iron, Fe": "Iron",
  "Manganese, Mn": "Manganese",
  "Phosphorus, P": "Phosphorus",
  "Potassium, K": "Potassium",
  "Selenium, Se": "Selenium",
  "Sodium, Na": "Sodium",
  "Zinc, Zn": "Zinc",
};

const suggestedFoods = [
  {
    title: "Avocado",
    calories: 160,
    nutrients: { protein: "2g", carbs: "9g", fat: "15g" },
  },
  {
    title: "Chicken Breast",
    calories: 165,
    nutrients: { protein: "31g", carbs: "0g", fat: "3.6g" },
  },
  {
    title: "Apple",
    calories: 95,
    nutrients: { protein: "0.5g", carbs: "25g", fat: "0.3g" },
  },
];

export function Food() {
  const {auth} = useContext(AuthContext)
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [extendedFoodData, setExtendedFoodData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const debounce = (func, delay = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch extended food data (popup data)
  const fetchExtendedFoodData = async (fdcId) => {
    console.log("Attempting to fetch details for fdcId:", fdcId);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/food/details`,
        { params: { fdcId } }
      );

      console.log("Extended food data response:", response.data);

      setExtendedFoodData(response.data);
      setIsOpen(true);
    } catch (err) {
      console.error("Error fetching extended food data:", err);
      console.error("Error details:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Error message:", err.message);

      setExtendedFoodData({
        food_id: fdcId,
        food_name: selectedFood?.description || "Unknown Food",
        nutrients: [],
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

  // Function to organize nutrients into categories for better display
  const organizeNutrients = (nutrients) => {
    const categories = {
      macronutrients: [],
      vitamins: [],
      minerals: [],
    };

    // Create a map of available nutrients from API
    const nutrientData = {};
    nutrients?.forEach((nutrient) => {
      nutrientData[nutrient.nutrientName] = nutrient;
    });

    // Process ALL nutrients from our nutrientMap (show missing ones as 0)
    Object.keys(nutrientMap).forEach((originalName) => {
      const displayName = nutrientMap[originalName];
      const nutrient = nutrientData[originalName];

      const nutrientInfo = {
        displayName,
        originalName,
        value: nutrient?.value || 0,
        unit:
          nutrient?.unitName?.toLowerCase() ||
          (originalName === "Energy" ? "kcal" : "mg"),
      };

      if (
        ["Calories", "Protein", "Carbs", "Fats", "Fiber", "Sugar"].includes(
          displayName
        )
      ) {
        categories.macronutrients.push(nutrientInfo);
      } else if (displayName.includes("Vitamin") || displayName.includes("B")) {
        categories.vitamins.push(nutrientInfo);
      } else {
        categories.minerals.push(nutrientInfo);
      }
    });

    return categories;
  };

  // Save food to database (Updated for simplified FoodLog model)
  const handleSaveFood = async () => {
    if (!extendedFoodData || !selectedFood) {
      alert("No food data to save");
      return;
    }

    try {
      const mealType = prompt(
        "Enter meal type (breakfast, lunch, dinner, snack):",
        "lunch"
      )?.toLowerCase();
      const servingSize = prompt("Enter serving size (e.g., 100):", "100");
      const servingUnit = prompt("Enter serving unit (e.g., g, oz, cup):", "g");
      const username = prompt("Enter your username (optional):") || "anonymous";

      if (!mealType || !servingSize || !servingUnit) {
        alert("All fields are required");
        return;
      }

      if (isNaN(servingSize)) {
        alert("Serving size must be a number");
        return;
      }

      const validMealTypes = ["breakfast", "lunch", "dinner", "snack"];
      if (!validMealTypes.includes(mealType)) {
        alert(
          "Invalid meal type. Please choose: breakfast, lunch, dinner, or snack"
        );
        return;
      }

      setIsSaving(true);

      // Calculate calories if available in nutrients
      const caloriesNutrient = extendedFoodData.nutrients?.find(
        (n) => n.nutrientName === "Energy" || n.nutrient?.name === "Energy"
      );
      const calculatedCalories = caloriesNutrient?.value || 0;

      // Prepare data for API
      const saveData = {
        foodID: extendedFoodData.food_id || selectedFood.fdcId,
        name: extendedFoodData.food_name || selectedFood.description,
        username,
        date: new Date().toISOString(),
        mealType,
        serving: parseFloat(servingSize),
        unit: servingUnit,
        calories: calculatedCalories,
      };

      // Send to backend
      const response = await axios.post(
        "http://localhost:3000/api/food/save",
        saveData,
        {
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if using authentication
            Authorization: `Bearer ${auth?.accessToken || auth}` 
          },
        }
      );

      if (response.data.success) {
        alert(`${saveData.name} saved successfully to ${mealType}!`);
        setIsOpen(false);
      } else {
        throw new Error(response.data.message || "Failed to save food");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSaving(false);
    }
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
                  <h3 className="food-title">
                    {food.description}
                    <span
                      style={{
                        fontSize: "0.8em",
                        color: "#666",
                        fontWeight: "normal",
                        marginLeft: "8px",
                      }}
                    >
                      (ID: {food.fdcId})
                    </span>
                  </h3>
                  <button
                    className="details-button"
                    onClick={() => handleDetailsClick(food)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Food Details Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="dialog-container"
      >
        <div className="dialog-overlay" aria-hidden="true" />
        <div className="dialog-content">
          <DialogPanel className="dialog-panel">
            <DialogTitle className="dialog-title">
              {extendedFoodData?.food_name ||
                selectedFood?.description ||
                "Nutrition Details"}
            </DialogTitle>
            <DialogDescription className="dialog-description">
              Food ID: {extendedFoodData?.food_id}
            </DialogDescription>

            {extendedFoodData && extendedFoodData.nutrients && (
              <div className="nutrient-details">
                {(() => {
                  const organizedNutrients = organizeNutrients(
                    extendedFoodData.nutrients
                  );

                  return (
                    <div className="nutrient-categories">
                      {/* Macronutrients Section */}
                      <div className="nutrient-category">
                        <h4
                          className="category-title"
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#2c3e50",
                            marginBottom: "12px",
                            borderBottom: "2px solid #3498db",
                            paddingBottom: "6px",
                          }}
                        >
                          Macronutrients
                        </h4>
                        <div className="nutrient-grid">
                          {organizedNutrients.macronutrients.map(
                            (nutrient, i) => (
                              <div key={i} className="nutrient-row">
                                <span className="nutrient-name">
                                  {nutrient.displayName}
                                </span>
                                <span className="nutrient-value">
                                  {nutrient.value} {nutrient.unit}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Vitamins Section */}
                      <div className="nutrient-category">
                        <h4
                          className="category-title"
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#2c3e50",
                            marginBottom: "12px",
                            borderBottom: "2px solid #e74c3c",
                            paddingBottom: "6px",
                          }}
                        >
                          Vitamins
                        </h4>
                        <div className="nutrient-grid">
                          {organizedNutrients.vitamins.map((nutrient, i) => (
                            <div key={i} className="nutrient-row">
                              <span className="nutrient-name">
                                {nutrient.displayName}
                              </span>
                              <span className="nutrient-value">
                                {nutrient.value} {nutrient.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Minerals Section */}
                      <div className="nutrient-category">
                        <h4
                          className="category-title"
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#2c3e50",
                            marginBottom: "12px",
                            borderBottom: "2px solid #27ae60",
                            paddingBottom: "6px",
                          }}
                        >
                          Minerals
                        </h4>
                        <div className="nutrient-grid">
                          {organizedNutrients.minerals.map((nutrient, i) => (
                            <div key={i} className="nutrient-row">
                              <span className="nutrient-name">
                                {nutrient.displayName}
                              </span>
                              <span className="nutrient-value">
                                {nutrient.value} {nutrient.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="dialog-buttons">
              <button
                onClick={handleSaveFood}
                disabled={isSaving}
                className="dialog-button save-button"
                style={{
                  backgroundColor: "#27ae60",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: isSaving ? "not-allowed" : "pointer",
                  opacity: isSaving ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {isSaving ? (
                  <>
                    <span className="spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    Save Food
                  </>
                )}
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