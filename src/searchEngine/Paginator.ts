import { SearchEngine } from "./SearchEngine";
import { SearchableDocument } from "./SearchableDocument";
import { logger } from "../Logger";

const PAGE_SIZE = 10;

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
    const nextPageSize = Math.max(Math.min(PAGE_SIZE, totalResultCount - topN),0);
    return Promise.resolve(
      new Page(pageNumber, lastNResults, nextPageSize, totalResultCount)
    );
  }
}

export class Page {
  pageNumber: number;
  results: PageItem[];
  nextPageSize: number;
  totalResults: number;
  constructor(
    pageNumber: number,
    results: SearchableDocument[],
    nextPageSize: number,
    totalResults: number
  ) {
    this.pageNumber = pageNumber;
    this.results = results.map((result) => {
      return new PageItem(result.uri, result.summary);
    });
    this.nextPageSize = nextPageSize;
    this.totalResults = totalResults;
  }
}
class PageItem {
  uri: string;
  summary: string;
  constructor(uri: string, summary: string) {
    this.uri = uri;
    this.summary = summary;
  }
}
