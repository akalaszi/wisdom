# Wisdom Searcher

## Requirements
- Node.JS. Tested with `v20.7.0`
- Optional: osx/linux for the startup script 
## How to start
First time startup:
```
./init.sh
```
On Windows follow the steps as per the `init.sh` above.
For subsequent launches, use `npm start` from the project root.

## How to use
The `init.sh`` script is designed to launch both the server and frontend, and it should automatically open the default browser, directing it to http://localhost:3000/. Upon entering "uranus" in the search field, the system is expected to yield 15 results. Clicking on any result should show the full content in a new tab, simultaneously increasing the priority of the current result.

## Tokenization
The documents have been transformed to lowercase, and the tokens are separated by non-English letter characters. Therefore, the only acceptable input is a string composed of characters from the range [a-z, A-Z].

## OMDB search
In each search, an OMDB query is performed, and the entire resulting document is indexed and included in the collection. Consequently, this document will be retrieved in any subsequent search if its content aligns with the search query.

## Known issues - due to the time constraint
- The addition of JUnit tests was not a requirement.
- Paging performance could have been enhanced; for instance, for page n, the backend retrieves all n*pageSize documents and returns the last n.
- The API key is exposed. OMDB utilizes HTTP and query parameters for the API key, making it susceptible to interception. Ideally, the key should have been injected from an environment variable for added security.

## Credits
Used ChatGPT to make this doc nicer in English and used GitHub CoPilot for the React.JS part.








