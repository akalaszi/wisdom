export class SearchableDocument {
  uri: string;
  clickCount: number = 0;
  summary: string;
  words: Set<string> = new Set();

  constructor(uri: string, summary: string) {
    this.uri = uri;
    this.summary = summary;
  }

  incrementClickCount() {
    this.clickCount++;
  }

  addWord(word: string) {
    this.words.add(word);
  }

  *yieldWords() {
    for (const word of this.words) {
      yield word;
    }
  }
}
