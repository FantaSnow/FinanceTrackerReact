import { HttpClient } from "../HttpClient";
import { StatisticDto, StatisticCategoryDto } from "../dto/StatisticDto";

class StatisticService {
  private httpClient = new HttpClient({
    baseURL: "http://localhost:5131/statistics",
  });

  async getByTimeAndCategory(
    userId: string,
    startDate: Date,
    endDate: Date,
    categoryId: string
  ): Promise<StatisticDto> {
    return await this.httpClient.get<StatisticDto>(
      `/getByTimeAndCategory/${startDate.toISOString()}/${endDate.toISOString()}/${categoryId}/user=/${userId}`
    );
  }

  async getForAllCategories(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<StatisticCategoryDto[]> {
    return await this.httpClient.get<StatisticCategoryDto[]>(
      `/getForAllCategorys/${startDate.toISOString()}/${endDate.toISOString()}/user=/${userId}`
    );
  }
}

export default new StatisticService();
