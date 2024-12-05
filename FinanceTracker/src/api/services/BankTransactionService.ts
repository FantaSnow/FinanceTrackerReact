import { HttpClient } from "../HttpClient";
import AuthService from "./AuthService";
import {
  BankTransactionDto,
  BankTransactionCreateDto,
  BankTransactionUpdateDto,
} from "../dto/BankTransactionDto";

class BankTransactionService {
  private httpClient = new HttpClient({
    baseURL: "http://localhost:5131/bankTransactions",
  });

  async getAll(): Promise<BankTransactionDto[]> {
    return await this.httpClient.get<BankTransactionDto[]>("/getAll/");
  }

  async getAllByUser(
    page: number = 1,
    pageSize: number = 10
  ): Promise<BankTransactionDto[]> {
    const userId = AuthService.getUserIdFromToken();
    if (!userId) throw new Error("User is not authenticated");

    return await this.httpClient.get<BankTransactionDto[]>(
      `/getAllByUser/${userId}?page=${page}&pageSize=${pageSize}`
    );
  }

  async getById(bankTransactionId: string): Promise<BankTransactionDto> {
    return await this.httpClient.get<BankTransactionDto>(
      `/getById/${bankTransactionId}`
    );
  }

  async create(
    bankId: string,
    data: BankTransactionCreateDto
  ): Promise<BankTransactionDto> {
    const userId = AuthService.getUserIdFromToken();
    if (!userId) throw new Error("User is not authenticated");

    return await this.httpClient.post<BankTransactionDto>(
      `/create/${userId}/${bankId}`,
      data
    );
  }
  async getAllByBank(bankId: string): Promise<BankTransactionDto[]> {
    return await this.httpClient.get<BankTransactionDto[]>(
      `/getAllByBank/${bankId}`
    );
  }

  async update(
    bankTransactionId: string,
    data: BankTransactionUpdateDto
  ): Promise<BankTransactionDto> {
    return await this.httpClient.put<BankTransactionDto>(
      `/update/${bankTransactionId}`,
      data
    );
  }

  async delete(bankTransactionId: string): Promise<void> {
    await this.httpClient.delete(`/delete/${bankTransactionId}`);
  }
}

export default new BankTransactionService();
