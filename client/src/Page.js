function Page({ result, onIncrement, onDecrement }) {
  if (!result.results) {
    return null;
  }

  async function  handleLinkClick(uri) {
    console.log(`Link clicked: ${uri}`);
    await fetch(`/upvote?uri=${uri}`, {
      method: 'PATCH'});
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

      {result.pageNumber > 0 && <button onClick={onDecrement}>Previous</button>}
      <div>total hits: {result.totalResults}</div>
      <div>current page: {result.pageNumber}</div>
      {result.nextPageSize > 0 && <button onClick={onIncrement}>Next</button>}
    </div>
  );
}
export default Page;
