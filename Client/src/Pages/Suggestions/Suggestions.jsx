import "../Suggestions/suggestions.css";
import { Searchbar } from "../../Componets/Searchbar";
import { Result_card } from "../../Componets/Result_card";
import { useState } from "react";
import { getMealSuggestions } from "../../API/recipes";

// export function Suggestions() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedResult, setSelectedResult] = useState(null);
//   const [results, setResults] = useState([]);
//   const [searchedIngredients, setSearchedIngredients] = useState("");

//   const handleCardClick = (index) => {
//     setSelectedResult(results[index]);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedResult(null);
//   };

//   const handleSearch = async (ingredients) => {
//     try {
//       setSearchedIngredients(ingredients);
//       const data = await getMealSuggestions(ingredients);
//       setResults(data);
//     } catch (err) {
//       console.error("API call failed:", err);
//     }
//   };

//   return (
//     <div className="suggestions-container">
//       <h1>Find Meals For Your Ingredients</h1>

//       <Searchbar onSearch={handleSearch} />

//       <div className="results-container">
//         {results.map((result, index) => (
//               <Result_card
//             key={result.id || index}
//             title={result.title}
//             ingredients={searchedIngredients}
//             onClick={() => handleCardClick(index)}
//           />
//         ))}
//       </div>

//       {isModalOpen && selectedResult && (
//         <div className="modal-backdrop" onClick={closeModal}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//     <h2>{selectedResult.title}</h2>

//             <div>
//               <strong>Ingredients:</strong>
//               <ul>
//                 {selectedResult.ingredients?.map((ingredient, i) => (
//                   <li key={i}>{ingredient}</li>
//                 ))}
//               </ul>
//             </div>

//             <div>
//               <strong>Instructions:</strong>
//               <ul>
//                 {selectedResult.instructions
//                   ?.split(".")
//                   .filter((s) => s.trim() !== "")
//                   .map((s, i) => (
//                     <li key={i}>{s.trim()}.</li>
//                   ))}
//               </ul>
//             </div>

//             <button className="xout" onClick={closeModal}>
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

export function Suggestions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [results, setResults] = useState([]);
  const [searchedIngredients, setSearchedIngredients] = useState("");

  const handleCardClick = (index) => {
    setSelectedResult(results[index]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedResult(null);
  };

  const handleSearch = async (ingredients) => {
    if (!ingredients.length || ingredients.every((i) => i.trim() === "")) {
      setResults([]); // Clear results if all items are empty
      return;
    }

    try {
      setSearchedIngredients(ingredients.join(", "));
      const data = await getMealSuggestions(ingredients);
      setResults(data);
    } catch (err) {
      console.error("API call failed:", err);
    }
  };

  return (
    <div className="suggestions-container">
      <h1>Find Meals For Your Ingredients</h1>

      <Searchbar onSearch={handleSearch} />

      <div className="results-container">
        {results.map((result, index) => (
          <Result_card
            key={result.id || index}
            title={result.title}
            ingredients={searchedIngredients}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>

      {isModalOpen && selectedResult && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedResult.title}</h2>

            <div>
              <strong>Ingredients:</strong>
              {/* <ul>
                {selectedResult.ingredients
                  ?.split(",")
                  .map((ingredient, i) => (
                    <li key={i}>{ingredient.trim()}</li>
                  ))}
              </ul> */}
              <ul>
                {(Array.isArray(selectedResult.ingredients)
                  ? selectedResult.ingredients
                  : [selectedResult.ingredients]
                ) // fallback if it's a single string
                  .flatMap(
                    (ingredient) =>
                      ingredient
                        ?.split("|") // Split string into separate options
                        .map((item) => item.trim()) // Remove whitespace
                  )
                  .filter((item) => item !== "") // Remove empty strings
                  .map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
              </ul>
            </div>

            <div>
              <strong>Instructions:</strong>
              <ul>
                {selectedResult.instructions
                  ?.split(".")
                  .filter((s) => s.trim() !== "")
                  .map((s, i) => (
                    <li key={i}>{s.trim()}.</li>
                  ))}
              </ul>
            </div>

            <button className="xout" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
