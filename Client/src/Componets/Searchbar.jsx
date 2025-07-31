import { FaSearch } from "react-icons/fa";

export function Searchbar() {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Enter an ingredient"
        className="search-input"
      />
      <button className="search-button">
        <FaSearch />
      </button>
    </div>
  );
};
