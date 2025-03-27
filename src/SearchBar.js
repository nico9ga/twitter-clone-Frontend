import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ tweets, setFilteredTweets }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setQuery(searchTerm);
    
    if (!searchTerm.trim()) {
      setFilteredTweets(tweets); // Mostrar todos los tweets si la búsqueda está vacía
      return;
    }
    
    const filtered = tweets.filter((tweet) =>
      tweet.content.toLowerCase().includes(searchTerm) ||
      tweet.user.fullName.toLowerCase().includes(searchTerm)
    );
    
    setFilteredTweets(filtered);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Buscar tweets o usuarios..."
        value={query}
        onChange={handleSearch}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
