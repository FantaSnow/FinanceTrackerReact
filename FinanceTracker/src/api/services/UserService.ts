import { HttpClient } from "../HttpClient";
import AuthService from "./AuthService";
import {
  UserDto,
  UserCreateDto,
  UserUpdateDto,
  UserBalanceDto,
} from "../dto/UserDto";

class UserService {
  private httpClient = new HttpClient({
    baseURL: "http://localhost:5131/users",
  });

  async getAll(): Promise<UserDto[]> {
    return await this.httpClient.get<UserDto[]>("/getAll/");
  }

  async getById(): Promise<UserDto> {
    const userId = AuthService.getUserIdFromToken();
    if (!userId) throw new Error("User is not authenticated");

    return await this.httpClient.get<UserDto>(`/getById/${userId}`);
  }

  async getBalanceById(): Promise<UserBalanceDto> {
    const userId = AuthService.getUserIdFromToken();
    if (!userId) throw new Error("User is not authenticated");

    return await this.httpClient.get<UserBalanceDto>(
      `/getBalanceById/${userId}`
    );
  }

  async create(data: UserCreateDto): Promise<UserDto> {
    return await this.httpClient.post<UserDto>("/create/", data);
  }

  async update(data: UserUpdateDto): Promise<UserDto> {
    const userId = AuthService.getUserIdFromToken();
    if (!userId) throw new Error("User is not authenticated");

    return await this.httpClient.put<UserDto>(`/update/${userId}`, data);
  }

  async delete(): Promise<void> {
    const userId = AuthService.getUserIdFromToken();
    if (!userId) throw new Error("User is not authenticated");

    await this.httpClient.delete(`/delete/${userId}`);
  }
}

export default new UserService();
