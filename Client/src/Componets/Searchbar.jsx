import { FaSearch } from "react-icons/fa";
import React, { useState } from "react";


export function Searchbar({ onSearch }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const ingredients = input.split(",").map((item) => item.trim());
    onSearch(ingredients);
  };
   

  return (
    <form onSubmit={handleSubmit} className="search-bar-container">
      <input
        type="text"
        placeholder="Enter ingredients (e.g., chicken, rice)"
        value={input}
        className="search-input"
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="search-button" type="submit"><FaSearch/></button>
    </form>
  );
}

