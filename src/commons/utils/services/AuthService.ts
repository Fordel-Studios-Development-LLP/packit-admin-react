import { LocalStorageService } from "./LocalStorageService";

// Define the storage keys at the top for future reuse or extraction to a constants file.
const AUTH_TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export class AuthService {
  private localStorageService: LocalStorageService;

  constructor() {
    // Inject the LocalStorageService to manage the tokens
    this.localStorageService = new LocalStorageService();
  }

  // Fetch the token from the LocalStorageService asynchronously
  async getToken(): Promise<string | null> {
    return await this.localStorageService.getData<string>(AUTH_TOKEN_KEY);
  }

  // Store the token using LocalStorageService
  setToken(token: string): void {
    this.localStorageService.saveData(AUTH_TOKEN_KEY, token);
  }

  // Clear the token from LocalStorageService
  clearToken(): void {
    this.localStorageService.deleteData(AUTH_TOKEN_KEY);
    this.localStorageService.deleteData(REFRESH_TOKEN_KEY);
  }

  // Fetch the refresh token using LocalStorageService asynchronously
  async getRefreshToken(): Promise<string | null> {
    return await this.localStorageService.getData<string>(REFRESH_TOKEN_KEY);
  }

  // Store the refresh token using LocalStorageService
  setRefreshToken(refreshToken: string): void {
    this.localStorageService.saveData(REFRESH_TOKEN_KEY, refreshToken);
  }
}
