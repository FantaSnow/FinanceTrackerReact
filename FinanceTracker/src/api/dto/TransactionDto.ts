import { UserDto } from "./UserDto";

export interface TransactionDto {
  id?: string;
  sum: number;
  createdAt: Date;
  userId: string;
  user?: UserDto;
  categoryName: string;
}

export interface TransactionCreateDto {
  sum: number;
  categoryId?: number;
}

export interface TransactionUpdateDto {
  sum: number;
  categoryId: string;
}
