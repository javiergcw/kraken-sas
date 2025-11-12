/**
 * DTOs para responses de categorías
 */

export interface CategoryDto {
  id: string;
  company_id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface CategoriesResponseDto {
  success: boolean;
  data: CategoryDto[];
}

export interface CategoryResponseDto {
  success: boolean;
  message?: string;
  data: CategoryDto;
}

export interface CategoryDeleteResponseDto {
  success: boolean;
  message: string;
}

