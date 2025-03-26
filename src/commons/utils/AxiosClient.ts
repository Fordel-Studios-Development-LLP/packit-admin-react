import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { headers } from "../constants/headers";
import { AuthService } from "./services/AuthService";

// Extend AxiosRequestConfig to include custom properties like _retry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export class AxiosClient {
  private client: AxiosInstance;
  private authService: AuthService;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
    config: CustomAxiosRequestConfig;
  }> = [];

  constructor(authService: AuthService) {
    this.authService = authService;
    this.client = axios.create({
      baseURL: "http://192.168.1.3:5173",
      timeout: 10000,
      withCredentials: false,
    });

    this.initializeRequestInterceptor();
    this.initializeResponseInterceptor();
  }

  private initializeRequestInterceptor() {
    this.client.interceptors.request.use(
      async (config: AxiosRequestConfig) => {
        const token = await this.authService.getToken();

        // Ensure headers is defined
        if (!config.headers) {
          config.headers = {};
        }

        // Set common headers like content-type and accept
        config.headers["Content-Type"] = headers.contentType;
        config.headers["Accept"] = headers.accept;

        // Add additional headers if needed
        // config.headers["App-Name"] = headers.appName;
        // config.headers["Secret-Key"] = headers.secretKey;

        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }

        // Ensure withCredentials is set to false on each request
        config.withCredentials = false;

        return config as InternalAxiosRequestConfig;
      },
      (error) => Promise.reject(error)
    );
  }

  private initializeResponseInterceptor() {
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;
        const status = error.response?.status;

        // Handle authentication errors (401 Unauthorized, 403 Forbidden)
        if ((status === 401 || status === 403) && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If a token refresh is already in progress, queue this request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({
                resolve,
                reject,
                config: originalRequest,
              });
            });
          }

          // Start token refresh process
          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = await this.authService.getRefreshToken();

            if (!refreshToken) {
              // No refresh token available, redirect to login
              this.handleAuthFailure();
              return Promise.reject(error);
            }

            // Here you would implement your token refresh logic
            // This is a placeholder for the actual API call
            const newToken = await this.refreshAccessToken(refreshToken);

            if (newToken) {
              // Update the token in storage
              this.authService.setToken(newToken);

              // Update authorization header for the original request
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

              // Process any requests that were queued during the refresh
              this.processQueue(null, newToken);

              // Retry the original request with the new token
              return this.client(originalRequest);
            } else {
              // Token refresh failed
              this.handleAuthFailure();
              return Promise.reject(error);
            }
          } catch (refreshError) {
            // Token refresh encountered an error
            this.processQueue(refreshError as Error, null);
            this.handleAuthFailure();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle other error status codes
        switch (status) {
          case 400:
            console.error(
              "Bad request. Please check your data:",
              error.response?.data
            );
            break;
          case 404:
            console.error("Resource not found:", error.response?.data);
            break;
          case 422:
            console.error("Validation error:", error.response?.data);
            break;
          case 500:
          case 501:
          case 502:
          case 503:
            console.error(
              "Server error. Please try again later:",
              error.response?.data
            );
            break;
          default:
            if (error.response) {
              console.error(
                `Request failed with status ${status}:`,
                error.response.data
              );
            } else if (error.request) {
              console.error("No response received from server:", error.request);
            } else {
              console.error("Error setting up request:", error.message);
            }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshAccessToken(
    refreshToken: string
  ): Promise<string | null> {
    // Implement your token refresh logic here
    // This would typically be an API call to your auth server
    try {
      // Example implementation - replace with your actual token refresh endpoint
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
        { refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.token;
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      return null;
    }
  }

  private processQueue(error: Error | null, token: string | null) {
    this.failedQueue.forEach((request) => {
      if (error) {
        request.reject(error);
      } else if (token) {
        // Update the authorization header and retry
        request.config.headers["Authorization"] = `Bearer ${token}`;
        request.resolve(this.client(request.config));
      }
    });

    // Clear the queue
    this.failedQueue = [];
  }

  private handleAuthFailure() {
    // Clear tokens
    this.authService.clearToken();

    // Dispatch an event that can be listened to for redirecting
    window.dispatchEvent(new CustomEvent("auth:logout"));

    // Alternatively, you could directly redirect to the login page
    // if your app's architecture supports it
    // window.location.href = '/auth/login';
  }

  // Public methods for HTTP requests
  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  // Get the axios instance (in case you need direct access)
  public getInstance(): AxiosInstance {
    return this.client;
  }
}
