export abstract class BaseStorageService {
  abstract saveData<T>(key: string, value: T): Promise<void>;
  abstract getData<T>(key: string): Promise<T | null>;
  abstract deleteData(key: string): Promise<void>;
  abstract clearAll(): Promise<void>;
}
