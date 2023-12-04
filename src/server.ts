import express from "express";
import { Paginator } from "./searchEngine/Paginator";
import { logger } from "./Logger";
import { buildSearchEngine } from "./searchEngine/SearchEngine";
import { DocumentStore } from "./searchEngine/DocumentStore";

export const PORT = 3001;
const documentStore = new DocumentStore();
const searchEngine = buildSearchEngine(documentStore);
const paginator = new Paginator(searchEngine);

let app = express();
const port = 3000;

app.get("/search", async (req, res) => {
  const query = (req.query.q as string).trim().toLowerCase();
  let pageNumber: number;
  if (req.query.pageNumber) {
    pageNumber = parseInt(req.query.pageNumber as string);
  } else {
    pageNumber = 0;
  }
  logger.info(`Searching for ${query} at page ${pageNumber}`);
  const result = await paginator.paginatedSearch(query, pageNumber);
  logger.info(`Found ${result.totalResults} results`);
  res.send(result);
});

app.patch("/upvote", (req, res) => {
  const uri = Buffer.from(req.query.uri as string, 'base64').toString('utf8');
  logger.info(`Upvoting ${uri}`);
  const document = documentStore.getDocument(uri);
  if (!document) {
    res.status(404).send("Not found");
    return;
  }
  searchEngine.upVote(document);
  res.send("OK");
});

app.use("/datasets", express.static(`${__dirname}/../datasets`));
app.use(express.static(`${__dirname}/../client/build`));
app.get("*", (req, res) =>
  res.sendFile(`${__dirname}/../client/build/index.html`)
);

app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
});
