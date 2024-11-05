export interface StatisticCategoryDto {
  name: string;
  countTransaction: number;
  minusSum: number;
  plusSum: number;
}

export interface StatisticDto {
  minusSum: number;
  minusCountTransaction: number;
  minusCountCategory: number;
  plusSum: number;
  plusCountTransaction: number;
  plusCountCategory: number;
}
