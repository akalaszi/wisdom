import { SearchEngine } from "./SearchEngine";
import { SearchableDocument } from "./SearchableDocument";
import { logger } from "../Logger";

const PAGE_SIZE = 3;

export class Paginator {
  wordSearch: SearchEngine.WordSearch;
  constructor(wordSearch: SearchEngine.WordSearch) {
    this.wordSearch = wordSearch;
  }

  async paginatedSearch(searchTerm: string, pageNumber: number): Promise<Page> {
    const topN = (pageNumber + 1) * PAGE_SIZE;
    const topNReults: SearchableDocument[] = await this.wordSearch.search(
      searchTerm,
      topN
    );
    const lastNResults = topNReults.slice(-PAGE_SIZE);
    const totalResultCount: number =
      this.wordSearch.getDocumentCount(searchTerm);
    const nextPageSize = Math.min(PAGE_SIZE, totalResultCount - topN);
    return Promise.resolve(
      new Page(pageNumber, lastNResults, nextPageSize, totalResultCount)
    );
  }
}

export class Page {
  pageNumber: number;
  results: SearchableDocument[];
  nextPageSize: number;
  totalResults: number;
  constructor(
    pageNumber: number,
    results: SearchableDocument[],
    nextPageSize: number,
    totalResults: number
  ) {
    this.pageNumber = pageNumber;
    this.results = results;
    this.nextPageSize = nextPageSize;
    this.totalResults = totalResults;
  }
}