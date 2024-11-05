import apiClient from "../config/axiosConfig";
import { StatisticDto, StatisticCategoryDto } from "../dto/StatisticDto";

class StatisticService {
  async getByTimeAndCategory(
    userId: string,
    startDate: Date,
    endDate: Date,
    categoryId: string
  ): Promise<StatisticDto> {
    const response = await apiClient.get<StatisticDto>(
      `/statistics/getByTimeAndCategory/${startDate.toISOString()}/${endDate.toISOString()}/${categoryId}/user=/${userId}`
    );
    return response.data;
  }

  async getForAllCategories(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<StatisticCategoryDto[]> {
    const response = await apiClient.get<StatisticCategoryDto[]>(
      `/statistics/getForAllCategorys/${startDate.toISOString()}/${endDate.toISOString()}/user=/${userId}`
    );
    return response.data;
  }
}

export default new StatisticService();
