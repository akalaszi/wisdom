import { traverseFiles } from "../etl/LocalFileSystemCrawler";
import { SearchableDocument } from "./SearchableDocument";
import { logger } from "../Logger";
import { fetchMovie, toUri } from "../etl/OMDBclient";
import { PriorityDocumentStore } from "./PriorityDocumentStore";
import { DocumentStore } from "./DocumentStore";

export class SearchEngine {
  wordToPriorityStore: Map<string, PriorityDocumentStore>;
  documentStore: DocumentStore;

  constructor(documentStore: DocumentStore) {
    this.wordToPriorityStore = new Map();
    this.documentStore = documentStore;
  }

  addDocument(document: SearchableDocument) {
    logger.info(`Adding document ${document.uri}`);
    this.documentStore.setDocument(document);

    for (const word of document.yieldWords()) {
      let priorityStore = this.wordToPriorityStore.get(word);

      if (!priorityStore) {
        priorityStore = new PriorityDocumentStore();
        this.wordToPriorityStore.set(word, priorityStore);
      }
      priorityStore.addDocument(document);
    }
    logger.info(
      `Document is assigned to ${document.uniqeWordCount()} unique words.`
    );
  }

  upVote(document: SearchableDocument) {
    logger.info(`Upvoting ${document.uri}`);
    const previoiusPriority = document.clickCount;
    document.incrementClickCount();
    logger.info(`Increased priority:${document.clickCount}`);

    for (const word of document.yieldWords()) {
      const priorityStore = this.wordToPriorityStore.get(word);
      if (!priorityStore) {
        throw new Error("Document not found in the store.");
      }
      priorityStore.move(previoiusPriority, document);
    }
  }

  private async ingestMovieDocument(title: string) {
    if (this.documentStore.hasDocument(toUri(title))) {
      logger.info(`Movie ${title} has been ingested before.`);
      return;
    }
    const movies = await fetchMovie(title);
    movies.forEach((movie) => {
      this.addDocument(movie.toSearchableDocument());
    });
  }

  async search(
    searchTerm: string,
    retrieveCount: number
  ): Promise<SearchableDocument[]> {
    await this.ingestMovieDocument(searchTerm);
    const priorityStore = this.wordToPriorityStore.get(searchTerm);
    if (!priorityStore) {
      return [];
    }
    return priorityStore.retrieveTopN(retrieveCount);
  }

  getDocumentCount(searchTerm: string): number {
    const priorityStore = this.wordToPriorityStore.get(searchTerm);
    if (!priorityStore) {
      return 0;
    }
    return priorityStore.getDocumentCount();
  }
}

export function buildSearchEngine(documentStore:DocumentStore): SearchEngine {
  logger.info("Building search engine");
  const wordSearch = new SearchEngine(documentStore);
  const fileIterator = traverseFiles();
  let fileCount = 0;
  for (const file of fileIterator) {
    wordSearch.addDocument(file.toSearchableDocument());
    fileCount++;
  }
  logger.info(`Indexed ${fileCount} files`);
  return wordSearch;
}
