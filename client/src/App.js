import React, { useState } from "react";
import Page from "./Page";
let pageNumber = 0;

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handlePageIncrement = async () => {
    pageNumber = pageNumber + 1;
    await search();
  };

  const handlePageDecrement = async () => {
    pageNumber = pageNumber - 1;
    await search();
  };

  const search = async (event) => {
    if (event) {
      pageNumber = 0;
      event.preventDefault();
    }
    console.log("before search :" + pageNumber);
    const newResults = await fetch(
      `/search?q=${query}&pageNumber=${pageNumber}`
    ).then((res) => res.json());
    setResults(newResults);
  };

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <form onSubmit={search}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ margin: "10px" }}
          />
          <button type="submit">Search</button>
        </form>
      </div>
      {
        <Page
          result={results}
          onIncrement={handlePageIncrement}
          onDecrement={handlePageDecrement}
        />
      }
    </div>
  );
}

export default SearchPage;
