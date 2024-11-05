import apiClient from "../config/axiosConfig";
import { BankDto, BankCreateDto, BankUpdateDto } from "../dto/BankDto";
import AuthService from "./AuthService";

class BankService {
  async getAllBanks(): Promise<BankDto[]> {
    const response = await apiClient.get<BankDto[]>("/banks/getAll");
    return response.data;
  }

  async getAllBanksByUser(): Promise<BankDto[]> {
    const userId = AuthService.getUserIdFromToken();
    if (!userId) throw new Error("User is not authenticated");

    const response = await apiClient.get<BankDto[]>(
      `/banks/getAllByUser/${userId}`
    );
    return response.data;
  }

  async getBankById(bankId: string): Promise<BankDto> {
    const response = await apiClient.get<BankDto>(`/banks/getById/${bankId}`);
    return response.data;
  }

  async createBank(data: BankCreateDto): Promise<BankDto> {
    const userId = AuthService.getUserIdFromToken();
    if (!userId) throw new Error("User is not authenticated");

    const response = await apiClient.post<BankDto>(
      `/banks/create/${userId}`,
      data
    );
    return response.data;
  }

  async updateBank(bankId: string, data: BankUpdateDto): Promise<BankDto> {
    const response = await apiClient.put<BankDto>(
      `/banks/update/${bankId}`,
      data
    );
    return response.data;
  }

  async addToBalance(bankId: string, balanceToAdd: number): Promise<BankDto> {
    const response = await apiClient.put<BankDto>(
      `/banks/addToBalance/${bankId}/${balanceToAdd}`
    );
    return response.data;
  }

  async deleteBank(bankId: string): Promise<void> {
    await apiClient.delete(`/banks/delete/${bankId}`);
  }
}

export default new BankService();
