import { SearchableDocument } from "./SearchableDocument";

export namespace SearchEngine {
  class DocumentStore {
    documents: Set<SearchableDocument>;

    constructor() {
      this.documents = new Set<SearchableDocument>();
    }

    addDocument(document: SearchableDocument) {
      this.documents.add(document);
    }

    removeDocument(document: SearchableDocument) {
      this.documents.delete(document);
    }

    retrieve(retrieveCount: number): SearchableDocument[] {
      return Array.from(this.documents).slice(0, retrieveCount);
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

    upVote(document: SearchableDocument) {
      const previousStore = this.priorityStores[document.clickCount - 1];
      previousStore.removeDocument(document);
      this.addDocument(document);
    }
  }

  export class WordSearch {
    documents: Map<string, PriorityDocumentStore>;

    constructor() {
      this.documents = new Map();
    }

    addDocument(document: SearchableDocument) {
      for (const word of document.yieldWords()) {
        let priorityStore = this.documents.get(word);

        if (!priorityStore) {
          priorityStore = new PriorityDocumentStore();
          this.documents.set(word, priorityStore);
        }
        priorityStore.addDocument(document);
      }
    }

    upVote(document: SearchableDocument) {
      for (const word of document.yieldWords()) {
        const priorityStore = this.documents.get(word);
        if (!priorityStore) {
          throw new Error("Document not found in the store.");
        }
        priorityStore.upVote(document);
      }
    }

    search(searchTerm: string, retrieveCount: number): SearchableDocument[] {
      const priorityStore = this.documents.get(searchTerm);
      if (!priorityStore) {
        return [];
      }
      return priorityStore.retrieveTopN(retrieveCount);
    }
  }
}