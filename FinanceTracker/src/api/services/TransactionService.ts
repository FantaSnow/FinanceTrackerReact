import apiClient from "../config/axiosConfig";
import {
  TransactionDto,
  TransactionCreateDto,
  TransactionUpdateDto,
} from "../dto/TransactionDto";

class TransactionService {
  async getAll(): Promise<TransactionDto[]> {
    const response = await apiClient.get<TransactionDto[]>(
      "/transactions/getAll/"
    );
    return response.data;
  }

  async getAllByUser(userId: string): Promise<TransactionDto[]> {
    const response = await apiClient.get<TransactionDto[]>(
      `/transactions/getAllByUser/${userId}`
    );
    return response.data;
  }

  async getById(transactionId: string): Promise<TransactionDto> {
    const response = await apiClient.get<TransactionDto>(
      `/transactions/getById/${transactionId}`
    );
    return response.data;
  }

  async create(
    userId: string,
    data: TransactionCreateDto
  ): Promise<TransactionDto> {
    const response = await apiClient.post<TransactionDto>(
      `/transactions/create/${userId}`,
      data
    );
    return response.data;
  }

  async update(
    transactionId: string,
    data: TransactionUpdateDto
  ): Promise<TransactionDto> {
    const response = await apiClient.put<TransactionDto>(
      `/transactions/update/${transactionId}`,
      data
    );
    return response.data;
  }

  async delete(transactionId: string): Promise<void> {
    await apiClient.delete(`/transactions/delete/${transactionId}`);
  }
}

export default new TransactionService();
