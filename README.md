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
The `init.sh` should start up the server+frontend and open up the default browser pointing to the `http://localhost:3000/`.
Type `uranus` in the search field: it should return 15 results. If any result is clicked, the full content should be opened automatically in a new tab, at the same time the current result priority is increased. 

## Tokenization
All the docs are converted to lower case and the tokens are split by non English letter characters. 
This means that the only valid input is a string consisting of characters [a-z,A-Z].

## OMDB search
During every search an OMDB query is executed and the whole resulting document is indexed and added to the collection. This means that this document will be returned in any subsequent searche if its content matches the search query. 

## Known issues - due to the time constraint
- Junit tests should have been added. -> it was not required
- Paging performance could have been optimized. e.g.: for page=n, the backend fetches all the n*pageSize docs and returs the last n. 
- API key is exposed. OMDB uses http and query param for the apikey, so if someone who wants my key, can snuff it anyhow. This should have been injected from env variable.








