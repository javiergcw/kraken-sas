/**
 * DTOs para requests de vessels (buques)
 */

export interface VesselCreateRequestDto {
  name: string;
  capacity?: number;
  is_active?: boolean;
}

export interface VesselUpdateRequestDto {
  name?: string;
  capacity?: number;
  is_active?: boolean;
}

