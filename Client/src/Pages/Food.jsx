import "../searchBox.css";
export function Food() {
  return (
    <div>
      <h1>This is the page that displays all of the Food options</h1>
      <form class="search-box">
        <input type="text" placeholder=" " />
        <button type="reset"></button>
      </form>
      <div id="food_items_container">
        <div className="food_item-container">
          <div className="title" > title</div>
          <div className="cal-num">cal num</div>
        </div>
        <div className="food_item-container">
          <div className="title" > title</div>
          <div className="cal-num">cal num</div>
        </div>
        <div id="nutrient_facts">this the nutrition_facts</div>
      </div>
    </div>
  );
}
