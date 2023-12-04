import { SearchableDocument } from "./SearchableDocument";

export class DocumentStore {
  uriToDocument: Map<string, SearchableDocument> = new Map();
  setDocument(document: SearchableDocument) {
    this.uriToDocument.set(document.uri, document);
  }
  getDocument(uri: string) {
    return this.uriToDocument.get(uri);
  }
  hasDocument(uri: string) {
    return this.uriToDocument.has(uri);
  }
}
