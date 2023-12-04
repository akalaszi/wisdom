import { SearchableDocument } from "./SearchableDocument";
import { SearchableDocumentSet } from "./SearchableDocumentSet";

export class PriorityDocumentStore {
  priorityStores: SearchableDocumentSet[] = [];

  addDocument(document: SearchableDocument) {
    if (!this.priorityStores[document.clickCount]) {
      this.priorityStores[document.clickCount] = new SearchableDocumentSet();
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
