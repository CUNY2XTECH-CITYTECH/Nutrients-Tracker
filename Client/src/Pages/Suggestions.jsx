import "../../src/App.css";
import { Searchbar } from "../Componets/Searchbar";
import { Result_card } from "../Componets/Result_card";
import React, { useState } from "react";

export function Suggestions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  const handleCardClick = (index) => {
    setSelectedResult(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedResult(null);
  };

  return (
    <div className="suggestions-container">
      {/* Search Section */}
      <h1>Find Meals For Your Ingredients</h1>
      <Searchbar />

      {/* Results Section */}
      <div className="results-container">
        <Result_card onClick={() => handleCardClick(1)} />
        <Result_card onClick={() => handleCardClick(2)} />
        <Result_card onClick={() => handleCardClick(3)} />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Details for Result {selectedResult}</h2>
            <p>This is more detailed information about the result card.</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
