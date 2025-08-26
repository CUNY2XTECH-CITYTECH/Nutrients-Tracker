import { FaSearch } from "react-icons/fa";

export function Searchbar() {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search ingredients..."
        className="search-input"
      />
      <button className="search-button">
        <FaSearch className="search-icon" />
      </button>
    </div>
  );
}
