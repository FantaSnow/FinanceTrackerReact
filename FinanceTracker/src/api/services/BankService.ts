import { HttpClient } from "../HttpClient";
import AuthService from "./AuthService";
import {
  BankDto,
  BankCreateDto,
  BankUpdateDto,
  BankAddBalanceDto,
} from "../dto/BankDto";

class BankService {
  private httpClient = new HttpClient({
    baseURL: "http://localhost:5131/banks",
  });

  async getAllBanks(): Promise<BankDto[]> {
    return await this.httpClient.get<BankDto[]>("/getAll");
  }

  async getAllBanksByUser(): Promise<BankDto[]> {
    const userId = AuthService.getUserIdFromToken();
    if (!userId) throw new Error("User is not authenticated");

    return await this.httpClient.get<BankDto[]>(`/getAllByUser/${userId}`);
  }

  async getBankById(bankId: string): Promise<BankDto> {
    return await this.httpClient.get<BankDto>(`/getById/${bankId}`);
  }

  async createBank(data: BankCreateDto): Promise<BankDto> {
    const userId = AuthService.getUserIdFromToken();
    if (!userId) throw new Error("User is not authenticated");

    return await this.httpClient.post<BankDto>(`/create/${userId}`, data);
  }

  async updateBank(bankId: string, data: BankUpdateDto): Promise<BankDto> {
    return await this.httpClient.put<BankDto>(`/update/${bankId}`, data);
  }

  async deleteBank(bankId: string): Promise<void> {
    await this.httpClient.delete(`/delete/${bankId}`);
  }
}

export default new BankService();
