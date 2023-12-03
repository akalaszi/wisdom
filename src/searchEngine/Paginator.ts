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

const run = async () => {
  const wordSearch = SearchEngine.build();
  const paginator = new Paginator(wordSearch);
  const result = await paginator.paginatedSearch("the", 0);
  console.log(result);
  //    const result2 = await paginator.paginatedSearch("the", 1);
  //    console.log(result2);
  // const results = await wordSearch.search("the", 10);
  // logger.info(results.map((result) => result.uri));

  // results[3].incrementClickCount();
  // wordSearch.upVote(results[3]);

  // const results2 = await wordSearch.search("the", 10);
  // logger.info(results2.map((result) => result.uri));
};

run();
