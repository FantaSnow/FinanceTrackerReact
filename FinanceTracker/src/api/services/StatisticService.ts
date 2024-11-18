import { HttpClient } from "../HttpClient";
import { StatisticDto, StatisticCategoryDto } from "../dto/StatisticDto";
import AuthService from "./AuthService";

class StatisticService {
  private httpClient = new HttpClient({
    baseURL: "http://localhost:5131/statistics",
  });

  async getByTimeAndCategory(
    startDate: string,
    endDate: string,
    categoryId: string
  ): Promise<StatisticDto> {
    const userId = AuthService.getUserIdFromToken();
    if (!userId) throw new Error("User is not authenticated");

    return await this.httpClient.get<StatisticDto>(
      `/getByTimeAndCategory/${startDate}/${endDate}/${categoryId}/user=/${userId}`
    );
  }

  async getByTimeAndCategoryForAll(
    startDate: string,
    endDate: string
  ): Promise<StatisticDto> {
    const userId = AuthService.getUserIdFromToken();
    if (!userId) throw new Error("User is not authenticated");

    return await this.httpClient.get<StatisticDto>(
      `/getByTimeAndCategory/${startDate}/${endDate}/user=/${userId}`
    );
  }

  async getForAllCategories(
    startDate: string,
    endDate: string
  ): Promise<StatisticCategoryDto[]> {
    const userId = AuthService.getUserIdFromToken();
    if (!userId) throw new Error("User is not authenticated");

    return await this.httpClient.get<StatisticCategoryDto[]>(
      `/getForAllCategorys/${startDate}/${endDate}/user=/${userId}`
    );
  }
}

export default new StatisticService();
