import apiClient from "../config/axiosConfig";
import AuthService from "./AuthService";
import {
  UserDto,
  UserCreateDto,
  UserUpdateDto,
  UserBalanceDto,
} from "../dto/UserDto";

class UserService {
  async getAll(): Promise<UserDto[]> {
    const response = await apiClient.get<UserDto[]>("/users/getAll/");
    return response.data;
  }

  async getById(): Promise<UserDto> {
    const userId = AuthService.getUserIdFromToken();
    if (!userId) throw new Error("User is not authenticated");

    const response = await apiClient.get<UserDto>(`/users/getById/${userId}`);
    return response.data;
  }

  async getBalanceById(): Promise<UserBalanceDto> {
    const userId = AuthService.getUserIdFromToken();
    if (!userId) throw new Error("User is not authenticated");

    const response = await apiClient.get<UserBalanceDto>(
      `/users/getBalanceById/${userId}`
    );
    return response.data;
  }

  async create(data: UserCreateDto): Promise<UserDto> {
    const response = await apiClient.post<UserDto>(`/users/create/`, data);
    return response.data;
  }

  async update(data: UserUpdateDto): Promise<UserDto> {
    const userId = AuthService.getUserIdFromToken();
    if (!userId) throw new Error("User is not authenticated");

    const response = await apiClient.put<UserDto>(
      `/users/update/${userId}`,
      data
    );
    return response.data;
  }

  async delete(): Promise<void> {
    const userId = AuthService.getUserIdFromToken();
    if (!userId) throw new Error("User is not authenticated");

    await apiClient.delete(`/users/delete/${userId}`);
  }
}

export default new UserService();
