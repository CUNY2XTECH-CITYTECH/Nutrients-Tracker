import "../searchBox.css";



const foodData = [
  { title: "Avocado", calories: 160, nutrients: { protein: "2g", carbs: "9g", fat: "15g" } },
  { title: "Chicken Breast", calories: 165, nutrients: { protein: "31g", carbs: "0g", fat: "3.6g" } },
  { title: "Apple", calories: 95, nutrients: { protein: "0.5g", carbs: "25g", fat: "0.3g" } },
];

export function Food() {
  return (
    
    <div className="food-page">
      
      <form class="search-box">
        <input type="text" placeholder=" " />
        <button type="reset"></button>
      </form>
      <button id="searchButton"> Search
      </button>
      <div id="search-results"></div>

      <div>Suggested foods of the day </div>
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
    //add footer 
  );
}