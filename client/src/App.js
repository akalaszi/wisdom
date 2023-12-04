import React, { useState, useEffect } from "react";
import Page from "./Page";
import {
  BrowserRouter as Router,
  useNavigate,
  useLocation,
} from "react-router-dom";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) {
      setQuery(decodeURIComponent(q));
    }
  }, [location]);

  const search = async (event) => {
    event.preventDefault();
    const newResults = await fetch(`/search?q=${query}`).then((res) =>
      res.json()
    );
    setResults(newResults);
    navigate(`/?q=${encodeURIComponent(query)}`);
  };

  return (
    <Router>
      <div>
        <form onSubmit={search}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        {<Page result={results} query={query} />}
      </div>
    </Router>
  );
}

export default SearchPage;
