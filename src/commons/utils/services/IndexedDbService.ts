import { BaseStorageService } from "./BaseStorageService";

export class IndexedDbService implements BaseStorageService {
  private dbName = "formulaDb";
  private storeName = "Formula Skincare";
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      // Ensure this runs only in the browser
      this.dbPromise = this.openDB();
    }
  }

  // Open IndexedDB connection
  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request: IDBOpenDBRequest = indexedDB.open(this.dbName, 1);

      // Handle database version upgrades
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: "id" });
        }
      };

      // Resolve the promise when the database is opened successfully
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };

      // Reject the promise if there's an error
      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  // Ensure that all methods check if dbPromise is available (i.e., running in the browser)
  async saveData<T>(key: string, value: T): Promise<void> {
    if (!this.dbPromise)
      throw new Error("IndexedDB is not supported in this environment.");
    const db = await this.dbPromise;
    const tx = db.transaction(this.storeName, "readwrite");
    const store = tx.objectStore(this.storeName);
    store.put({ id: key, value });

    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getData<T>(key: string): Promise<T | null> {
    if (!this.dbPromise) return null;
    const db = await this.dbPromise;
    const tx = db.transaction(this.storeName, "readonly");
    const store = tx.objectStore(this.storeName);
    const request: IDBRequest = store.get(key);

    return new Promise<T | null>((resolve, reject) => {
      request.onsuccess = () => {
        const result = request.result ? (request.result.value as T) : null;
        resolve(result);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteData(key: string): Promise<void> {
    if (!this.dbPromise)
      throw new Error("IndexedDB is not supported in this environment.");
    const db = await this.dbPromise;
    const tx = db.transaction(this.storeName, "readwrite");
    const store = tx.objectStore(this.storeName);
    store.delete(key);

    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async clearAll(): Promise<void> {
    if (!this.dbPromise)
      throw new Error("IndexedDB is not supported in this environment.");
    const db = await this.dbPromise;
    const tx = db.transaction(this.storeName, "readwrite");
    const store = tx.objectStore(this.storeName);
    store.clear();

    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}
