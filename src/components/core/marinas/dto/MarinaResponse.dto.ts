/**
 * DTOs para responses de marinas
 */

export interface MarinaDto {
  id: string;
  company_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MarinaResponseDto {
  success: boolean;
  message?: string;
  data: MarinaDto;
}

export interface MarinaListResponseDto {
  success: boolean;
  data: MarinaDto[];
}

