import { jwtDecode } from "jwt-decode";
import { HttpClient } from "../HttpClient";

class AuthService {
  private static tokenKey = "token";
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient({ baseURL: "http://localhost:5131" });
  }

  async login(login: string, password: string): Promise<boolean> {
    try {
      const token = await this.httpClient.post<string>("/identity/token", {
        login,
        password,
      });
      localStorage.setItem(AuthService.tokenKey, token);
      return true;
    } catch {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(AuthService.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(AuthService.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(AuthService.tokenKey);
  }

  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken: { userid: string } = jwtDecode(token);
    return decodedToken.userid;
  }
}

export default new AuthService();
