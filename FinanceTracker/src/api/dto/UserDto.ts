export interface UserDto {
  id?: string;
  login: string;
  password: string;
  balance: number;
  createdAt?: Date;
  isAdmin: boolean;
}

export interface UserCreateDto {
  login: string;
  password: string;
}

export interface UserUpdateDto {
  login: string;
  password: string;
  balance: number;
}
export interface UserBalanceDto {
  balance: number;
}
