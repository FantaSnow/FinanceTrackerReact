import { HttpClient } from "../HttpClient";
import AuthService from "./AuthService";
import {
  TransactionDto,
  TransactionCreateDto,
  TransactionUpdateDto,
} from "../dto/TransactionDto";

class TransactionService {
  private httpClient = new HttpClient({
    baseURL: "http://localhost:5131/transactions",
  });

  async getAll(): Promise<TransactionDto[]> {
    return await this.httpClient.get<TransactionDto[]>("/getAll/");
  }

  async getAllByUser(
    page: number = 1,
    pageSize: number = 9
  ): Promise<TransactionDto[]> {
    const userId = AuthService.getUserIdFromToken();
    if (!userId) throw new Error("User is not authenticated");

    return await this.httpClient.get<TransactionDto[]>(
      `/getAllByUser/${userId}?page=${page}&pageSize=${pageSize}`
    );
  }

  async getById(transactionId: string): Promise<TransactionDto> {
    return await this.httpClient.get<TransactionDto>(
      `/getById/${transactionId}`
    );
  }

  async create(data: TransactionCreateDto): Promise<TransactionDto> {
    const userId = AuthService.getUserIdFromToken();
    if (!userId) throw new Error("User is not authenticated");

    return await this.httpClient.post<TransactionDto>(
      `/create/${userId}`,
      data
    );
  }

  async update(
    transactionId: string,
    data: TransactionUpdateDto
  ): Promise<TransactionDto> {
    return await this.httpClient.put<TransactionDto>(
      `/update/${transactionId}`,
      data
    );
  }

  async delete(transactionId: string): Promise<void> {
    await this.httpClient.delete(`/delete/${transactionId}`);
  }
}

export default new TransactionService();
