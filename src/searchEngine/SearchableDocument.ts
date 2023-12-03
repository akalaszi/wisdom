export class SearchableDocument {
  uri: string;
  clickCount: number = 0;
  summary: string;
  words: Set<string> = new Set();

  constructor(uri: string, summary: string, words: Set<string>) {
    this.uri = uri;
    this.summary = summary;
    this.words = words;
  }

  incrementClickCount() {
    this.clickCount++;
  }

  *yieldWords() {
    for (const word of this.words) {
      yield word;
    }
  }

  uniqeWordCount(): number {
    return this.words.size;
  }
}
