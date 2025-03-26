import { BaseStorageService } from "./BaseStorageService";
import { SessionStorageService } from "./SessionStorageService";

// Wrapper class to provide flexibility
export class LocalStorageService {
  // The 'storageService' variable follows the Liskov Substitution Principle (LSP),
  // meaning that any class implementing the 'BaseStorageService' interface (e.g., IndexedDbService)
  // can be substituted here without affecting the behavior of this class.
  //
  // Liskov Substitution Principle ensures that this service can easily switch between different
  // storage mechanisms (e.g., localStorage, sessionStorage, or IndexedDB)
  // without affecting the rest of the application.
  private storageService: BaseStorageService;

  constructor() {
    // Liskov Substitution Principle (LSP):
    // We're instantiating 'IndexedDbService', but because it implements 'BaseStorageService',
    // this can easily be replaced with another storage service, such as a localStorage-based implementation.
    //
    // This provides flexibility, allowing us to change the storage mechanism without modifying
    // the rest of the 'LocalStorageService' class or its consumers.
    this.storageService = new SessionStorageService();
  }

  // Save data to the underlying storage
  saveData<T>(key: string, value: T): Promise<void> {
    return this.storageService.saveData(key, value);
  }

  // Retrieve data from the underlying storage
  getData<T>(key: string): Promise<T | null> {
    return this.storageService.getData(key);
  }

  // Delete data from the underlying storage
  deleteData(key: string): Promise<void> {
    return this.storageService.deleteData(key);
  }

  // Clear all data from the underlying storage
  clearAll(): Promise<void> {
    return this.storageService.clearAll();
  }
}
