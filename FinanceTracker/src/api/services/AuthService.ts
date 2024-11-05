import { jwtDecode } from "jwt-decode";
import apiClient from "../config/axiosConfig";

class AuthService {
  private static tokenKey = "token";

  static async login(login: string, password: string): Promise<boolean> {
    try {
      const response = await apiClient.post<string>("/identity/token", {
        login,
        password,
      });
      localStorage.setItem(AuthService.tokenKey, response.data);
      return true;
    } catch {
      return false;
    }
  }

  static logout(): void {
    localStorage.removeItem(AuthService.tokenKey);
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem(AuthService.tokenKey);
  }

  static getToken(): string | null {
    return localStorage.getItem(AuthService.tokenKey);
  }

  static getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decodedToken: { userid: string } = jwtDecode(token);
    return decodedToken.userid;
  }
}

export default AuthService;
