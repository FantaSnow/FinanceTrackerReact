import apiClient from "../config/axiosConfig";
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

  async getById(userId: string): Promise<UserDto> {
    const response = await apiClient.get<UserDto>(`/users/getById/${userId}`);
    return response.data;
  }

  async getBalanceById(userId: string): Promise<UserBalanceDto> {
    const response = await apiClient.get<UserBalanceDto>(
      `/users/getBalanceById/${userId}`
    );
    return response.data;
  }

  async create(data: UserCreateDto): Promise<UserDto> {
    const response = await apiClient.post<UserDto>(`/users/create/`, data);
    return response.data;
  }

  async update(userId: string, data: UserUpdateDto): Promise<UserDto> {
    const response = await apiClient.put<UserDto>(
      `/users/update/${userId}`,
      data
    );
    return response.data;
  }

  async delete(userId: string): Promise<void> {
    await apiClient.delete(`/users/delete/${userId}`);
  }
}

export default new UserService();
