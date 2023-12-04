import React, { useState } from 'react';
import Page from './Page';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const search = async () => {
    const newResults = await fetch(`/api/search?q=${query}`).then(res => res.json());
    setResults(newResults);
  };

  return (
    <div>
      <input type="text" value={query} onChange={e => setQuery(e.target.value)} />
      <button onClick={search}>Search</button>
      {
        <Page result={results} query={query} /> 
      }
    </div>
  );
}

export default SearchPage;