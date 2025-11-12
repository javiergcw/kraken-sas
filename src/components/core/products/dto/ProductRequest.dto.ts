/**
 * DTOs para requests de productos
 */

export interface ProductCreateRequestDto {
  category_id: string;
  subcategory_id: string;
  name: string;
  short_description: string;
  long_description: string;
  photo: string;
  price: number;
  dives_only: number;
  days_course: number;
}

export interface ProductUpdateRequestDto {
  category_id: string;
  subcategory_id: string;
  name: string;
  short_description: string;
  long_description: string;
  photo: string;
  price: number;
  dives_only: number;
  days_course: number;
}

