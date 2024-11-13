export interface BankDto {
  bankId: string;
  name: string;
  balance: number;
  balanceGoal: number;
  userId: string;
}

export interface BankUpdateDto {
  name: string;
  balanceGoal: number;
}

export interface BankCreateDto {
  name: string;
  balanceGoal: number;
}

export interface BankAddBalanceDto {
  balance: number;
}
