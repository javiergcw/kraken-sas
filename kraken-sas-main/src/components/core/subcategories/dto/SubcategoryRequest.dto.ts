/**
 * DTOs para requests de subcategorías
 */

export interface SubcategoryCreateRequestDto {
  category_id: string;
  name: string;
  description: string;
}

export interface SubcategoryUpdateRequestDto {
  category_id: string;
  name: string;
  description: string;
}

