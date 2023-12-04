import React, { useState } from "react";
import Page from "./Page";
let pageNumber = 0;

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const  handlePageIncrement = async () => {
    console.log("before increment :" + pageNumber)
    pageNumber = pageNumber + 1;
    console.log("after increment :" + pageNumber)
    await search()
  };

  const handlePageDecrement = async () => {
    console.log("before deccrement :" + pageNumber)
    pageNumber = pageNumber - 1;
    console.log("after decrement :" + pageNumber)
    await search()
  };

  const search = async (event) => {
    if (event) {
      event.preventDefault();
    }
    console.log("before search :" + pageNumber)
    const newResults = await fetch(`/search?q=${query}&pageNumber=${pageNumber}`).then((res) =>
      res.json()
    );
    setResults(newResults);
  };

  return (
    <div>
      <form onSubmit={search}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {<Page result={results} onIncrement={handlePageIncrement} onDecrement={handlePageDecrement} />}
    </div>
  );
}

export default SearchPage;
