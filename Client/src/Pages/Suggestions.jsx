import "../../src/App.css";
import { Searchbar } from "../Components/Searchbar";
import { Result_card } from "../Components/Result_card";

export function Suggestions() {
  return (
    <div className="suggestions-container">
      {/* Search Section */}
      <h1>Find Meals For Your Ingredients</h1>
      <Searchbar/>

      {/* Results Section */}
      <div className="results-container">
        <Result_card/>
        <Result_card/>
        <Result_card/>
      </div>
    </div>
  );
}
