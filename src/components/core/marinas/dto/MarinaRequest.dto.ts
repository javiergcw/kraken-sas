/**
 * DTOs para requests de marinas
 */

export interface MarinaCreateRequestDto {
  name: string;
  is_active?: boolean;
}

export interface MarinaUpdateRequestDto {
  name?: string;
  is_active?: boolean;
}

