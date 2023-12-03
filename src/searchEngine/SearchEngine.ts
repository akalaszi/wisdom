import { traverseFiles } from "../etl/LocalFileSystemCrawler";
import { SearchableDocument } from "./SearchableDocument";
import { logger } from "../Logger";
import { fetchMovie } from "../etl/OMDBclient";

export namespace SearchEngine {
  class DocumentStore {
    documents: Set<SearchableDocument> = new Set<SearchableDocument>();

    addDocument(document: SearchableDocument) {
      this.documents.add(document);
    }

    removeDocument(document: SearchableDocument) {
      this.documents.delete(document);
    }

    retrieve(retrieveCount: number): SearchableDocument[] {
      return Array.from(this.documents).slice(0, retrieveCount);
    }

    size(): number {
      return this.documents.size;
    }
  }

  class PriorityDocumentStore {
    priorityStores: DocumentStore[] = [];

    addDocument(document: SearchableDocument) {
      if (!this.priorityStores[document.clickCount]) {
        this.priorityStores[document.clickCount] = new DocumentStore();
      }
      this.priorityStores[document.clickCount].addDocument(document);
    }

    retrieveTopN(n: number): SearchableDocument[] {
      const documents: SearchableDocument[] = [];
      let leftover = n;
      for (let i = this.priorityStores.length - 1; i >= 0; i--) {
        const documentsWithHighestPrio =
          this.priorityStores[i].retrieve(leftover);
        documents.push(...documentsWithHighestPrio);
        if (documents.length == n) {
          return documents;
        }
        leftover = n - documents.length;
      }
      return documents;
    }

    move(fromPriority: number, document: SearchableDocument) {
      const previousStore = this.priorityStores[fromPriority];
      if (!previousStore) {
        throw new Error("Document not found in the store.");
      }
      previousStore.removeDocument(document);
      this.addDocument(document);
    }

    getDocumentCount(): number {
      return this.priorityStores.reduce((acc, store) => {
        return acc + store.size();
      }, 0);
    }
  }

  export class WordSearch {

    wordToPriorityStore: Map<string, PriorityDocumentStore>;
    uriToDocument: Map<string, SearchableDocument> = new Map();

    constructor() {
      this.wordToPriorityStore = new Map();
    }

    addDocument(document: SearchableDocument) {
      logger.info(`Adding document ${document.uri}`);
      this.uriToDocument.set(document.uri, document);

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

    getDocument(uri: string) {
      logger.info(`Retrieving document ${uri}`);
      return this.uriToDocument.get(uri);
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

  export function build(): SearchEngine.WordSearch {
    logger.info("Building search engine");
    const wordSearch = new SearchEngine.WordSearch();
    const fileIterator = traverseFiles();
    let fileCount = 0;
    for (const file of fileIterator) {
      wordSearch.addDocument(file.toSearchableDocument());
      fileCount++;
    }
    logger.info(`Indexed ${fileCount} files`);
    return wordSearch;
  }
}
