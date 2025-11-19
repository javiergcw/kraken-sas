/**
 * DTOs para responses de productos
 */

export interface ProductDto {
  id: string;
  company_id: string;
  category_id: string;
  subcategory_id: string;
  sku: string;
  name: string;
  short_description: string;
  long_description: string;
  photo: string;
  price: number;
  dives_only: number;
  days_course: number;
  created_at: string;
}

export interface ProductsResponseDto {
  success: boolean;
  data: ProductDto[];
}

export interface ProductResponseDto {
  success: boolean;
  message?: string;
  data: ProductDto;
}

export interface ProductDeleteResponseDto {
  success: boolean;
  message: string;
}

