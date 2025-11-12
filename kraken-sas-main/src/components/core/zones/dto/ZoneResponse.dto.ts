/**
 * DTOs para responses de zonas
 */

export interface ZoneDto {
  id: string;
  company_id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface ZonesResponseDto {
  success: boolean;
  data: ZoneDto[];
}

export interface ZoneResponseDto {
  success: boolean;
  message?: string;
  data: ZoneDto;
}

