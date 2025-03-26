import { BaseStorageService } from "./BaseStorageService";

export class SessionStorageService extends BaseStorageService {
  async saveData(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  async getData(key: string) {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  async deleteData(key: string) {
    sessionStorage.removeItem(key);
  }

  async clearAll() {
    sessionStorage.clear();
  }
}
