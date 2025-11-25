/**
 * DTOs para responses de vessels (buques)
 */

export interface VesselDto {
  id: string;
  company_id: string;
  name: string;
  capacity?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VesselResponseDto {
  success: boolean;
  message?: string;
  data: VesselDto;
}

export interface VesselListResponseDto {
  success: boolean;
  data: VesselDto[];
}

