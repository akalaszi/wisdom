import { SearchableDocument } from "./SearchableDocument";

export class SearchableDocumentSet {
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