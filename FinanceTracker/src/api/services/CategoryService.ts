import { HttpClient } from "../HttpClient";
import {
  CategoryDto,
  CategoryCreateDto,
  CategoryUpdateDto,
} from "../dto/CategoryDto";

class CategoryService {
  private httpClient = new HttpClient({
    baseURL: "http://localhost:5131/categorys",
  });

  async getAllCategories(): Promise<CategoryDto[]> {
    return await this.httpClient.get<CategoryDto[]>("/getAll");
  }

  async getCategoryById(categoryId: string): Promise<CategoryDto> {
    return await this.httpClient.get<CategoryDto>(`/getById/${categoryId}`);
  }

  async createCategory(data: CategoryCreateDto): Promise<CategoryDto> {
    return await this.httpClient.post<CategoryDto>("/create/", data);
  }

  async updateCategory(
    categoryId: string,
    data: CategoryUpdateDto
  ): Promise<CategoryDto> {
    return await this.httpClient.put<CategoryDto>(
      `/update/${categoryId}`,
      data
    );
  }

  async deleteCategory(categoryId: string): Promise<void> {
    await this.httpClient.delete(`/delete/${categoryId}`);
  }
}

export default new CategoryService();
