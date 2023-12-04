function Page({ result, onIncrement, onDecrement }) {
  if (!result.results) {
    return null;
  }

  async function handleLinkClick(uri) {
    console.log(`Link clicked: ${uri}`);
    const encodedUri = btoa(uri)

    await fetch(`/upvote?uri=${encodedUri}`, {
      method: "PATCH",
    });
    console.log(`Upvoted: ${uri}`);
  }

  return (
    <div>
      <p></p>
      {result.results.map((r, index) => (
        <div key={index}>
          <div>{r.summary}</div>
          <a
            href={r.uri}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick(r.uri)}
          >
            {r.uri}
          </a>
          <p></p>
        </div>
      ))}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        {result.pageNumber > 0 && (
          <button onClick={onDecrement}>Previous</button>
        )}
        <div style={{margin:"10px"}}> total hits: {result.totalResults} current page: {result.pageNumber} </div>
        {result.nextPageSize > 0 && <button onClick={onIncrement}>Next</button>}
      </div>
    </div>
  );
}
export default Page;
