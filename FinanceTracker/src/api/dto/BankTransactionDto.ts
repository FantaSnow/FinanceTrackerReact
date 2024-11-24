import { UserDto } from "./UserDto";

export interface BankTransactionDto {
  id: string;
  createdAt: Date;
  amount: number;
  userId: string;
  user?: UserDto;
  bankId: string;
  bank?: UserDto;
}

export interface BankTransactionCreateDto {
  amount: number;
}

export interface BankTransactionUpdateDto {
  amount: number;
}
