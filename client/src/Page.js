function Page({ result, onIncrement, onDecrement }) {
  if (!result.results) {
    return null;
  }

  return (
    <div>
      <p></p>
      {result.results.map((r, index) => (
        <div key={index}>
          <div>{r.summary}</div>
          <a href={r.uri} target="_blank" rel="noopener noreferrer">
            {r.uri}
          </a>
          <p></p>
        </div>
      ))}

      {result.pageNumber > 0 && <button onClick={onDecrement}>Previous</button>}
      <div>total hits: {result.totalResults}</div>
      <div>current page: {result.pageNumber}</div>
      {result.nextPageSize > 0 && <button onClick={onIncrement}>Next</button>}
    </div>
  );
}
export default Page;
