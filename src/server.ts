import express from "express";
import { SearchEngine } from "./searchEngine/SearchEngine";
import { Paginator } from "./searchEngine/Paginator";
import { logger } from "./Logger";

const wordSearch = SearchEngine.build();
const paginator = new Paginator(wordSearch);

let app = express();
const port = 3000;

app.get("/search", async (req, res) => {
  const query = req.query.q;
  let pageNumber: number;
  if (req.query.pageNumber) {
    pageNumber = parseInt(req.query.pageNumber as string);
  } else {
    pageNumber = 0;
  }
  logger.info(`Searching for ${query} at page ${pageNumber}`);
  const result = await paginator.paginatedSearch("the", pageNumber);
  logger.info(`Found ${result.totalResults} results`);
  res.send(result);
});

app.patch("/upvote", (req, res) => {
  const document = wordSearch.getDocument(req.query.uri as string);
  if (!document) {
    res.status(404).send("Not found");
    return;
  }
  wordSearch.upVote(document);
  res.send("OK");
});

app.use("/datasets", express.static(`${__dirname}/../datasets`));

app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
});
