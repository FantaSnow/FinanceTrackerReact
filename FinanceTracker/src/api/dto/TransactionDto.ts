import { UserDto } from "./UserDto";
import { CategoryDto } from "./CategoryDto";

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
  category?: CategoryDto;
}

export interface TransactionUpdateDto {
  sum: number;
  categoryId: string;
  category?: CategoryDto;
}
