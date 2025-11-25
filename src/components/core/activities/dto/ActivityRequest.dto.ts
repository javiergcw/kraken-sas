/**
 * DTOs para requests de activities
 */

export interface ActivityCreateRequestDto {
  code: string;
  description?: string;
  color?: string;
  is_active?: boolean;
}

export interface ActivityUpdateRequestDto {
  code?: string;
  description?: string;
  color?: string;
  is_active?: boolean;
}

