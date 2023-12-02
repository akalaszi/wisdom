import { SearchableDocument } from "../searchEngine/SearchableDocument";

export class DataFile {
  DEFAULT_SUMMARY_SIZE = 3;
  filePath: string;
  content: string[];

  constructor(filePath: string, content: string[]) {
    this.filePath = filePath;
    this.content = content;
  }

  private extractUniqueTokens(): Set<string> {
    const uniqueTokens = new Set<string>();
    for (let i = 0; i < this.content.length; i++) {
      this.content[i]
        .toLowerCase()
        .split(/[^a-z]/)
        .map((token) => token.trim())
        .filter((token) => token.length > 0)
        .forEach((token) => uniqueTokens.add(token));
    }
    return uniqueTokens;
  }

  private extractSummary(): string {
    let summary = "";
    const summaryLength = Math.min(
      this.DEFAULT_SUMMARY_SIZE,
      this.content.length
    );
    for (let i = 0; i < summaryLength; i++) {
      summary += this.content[i] + "\n";
    }
    if (summary.length === 0) {
      summary += "empty file\n";
    }
    return summary;
  }

  toSearchableDocument(): SearchableDocument {
    const tokens = this.extractUniqueTokens();
    const summary = this.extractSummary();
    return new SearchableDocument(this.filePath, summary, tokens);
  }
}