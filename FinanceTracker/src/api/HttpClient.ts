import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import AuthService from "./services/AuthService";

export class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(configs: AxiosRequestConfig) {
    this.axiosInstance = axios.create({
      baseURL: configs.baseURL || "http://localhost:5131",
      timeout: configs.timeout || 5000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...configs.headers,
      },
    });
    this.initInterceptors();
  }

  private initInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }

        const userId = AuthService.getUserIdFromToken();
        if (userId) {
          config.headers["X-User-Id"] = userId;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error instanceof AxiosError && error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // Запит GET
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance
      .get(url, config)
      .then((response) => response.data);
  }

  // Запит POST
  public async post<T, D = unknown>(
    url: string,
    data: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.axiosInstance
      .post(url, data, config)
      .then((response) => response.data);
  }

  // Запит PUT
  public async put<T, D = unknown>(
    url: string,
    data: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.axiosInstance
      .put(url, data, config)
      .then((response) => response.data);
  }

  // Запит DELETE
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance
      .delete(url, config)
      .then((response) => response.data);
  }
}
