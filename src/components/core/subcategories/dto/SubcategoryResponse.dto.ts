/**
 * DTOs para responses de subcategorías
 */

export interface SubcategoryDto {
  id: string;
  category_id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface SubcategoriesResponseDto {
  success: boolean;
  data: SubcategoryDto[];
}

export interface SubcategoryResponseDto {
  success: boolean;
  message?: string;
  data: SubcategoryDto;
}

export interface SubcategoryDeleteResponseDto {
  success: boolean;
  message: string;
}

