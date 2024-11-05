import apiClient from "../config/axiosConfig";
import {
  CategoryDto,
  CategoryCreateDto,
  CategoryUpdateDto,
} from "../dto/CategoryDto";

class CategoryService {
  async getAllCategories(): Promise<CategoryDto[]> {
    const response = await apiClient.get<CategoryDto[]>("/categorys/getAll");
    return response.data;
  }

  async getCategoryById(categoryId: string): Promise<CategoryDto> {
    const response = await apiClient.get<CategoryDto>(
      `/categorys/getById/${categoryId}`
    );
    return response.data;
  }

  async createCategory(data: CategoryCreateDto): Promise<CategoryDto> {
    const response = await apiClient.post<CategoryDto>(
      `/categorys/create/`,
      data
    );
    return response.data;
  }

  async updateCategory(
    categoryId: string,
    data: CategoryUpdateDto
  ): Promise<CategoryDto> {
    const response = await apiClient.put<CategoryDto>(
      `/categorys/update/${categoryId}`,
      data
    );
    return response.data;
  }

  async deleteCategory(categoryId: string): Promise<void> {
    await apiClient.delete(`/categorys/delete/${categoryId}`);
  }
}

export default new CategoryService();
