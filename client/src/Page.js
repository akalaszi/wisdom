function Page({ result, query }) {
  if (!result.results) {
    return null;
  }
  const handlePrevious = () => {
    console.log(query);
  };
  const handleNext = () => {
    console.log(query);
  };
  return (
    <div>
      <p></p>
      {result.results.map((r, index) => (
        <div key={index}>
          <div>{r.summary}</div>
          <a href={r.uri}>{r.uri}</a>
          <p></p>
        </div>
      ))}

      {result.pageNumber > 0 && (
        <button onClick={handlePrevious}>Previous</button>
      )}
      <div>total hits: {result.totalResults}</div>
      {result.nextPageSize > 0 && <button onClick={handleNext}>Next</button>}
    </div>
  );
}
export default Page;
