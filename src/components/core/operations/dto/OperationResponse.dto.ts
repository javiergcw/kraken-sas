/**
 * DTOs para responses de operations (operaciones diarias)
 */

export interface OperationDto {
  id: string;
  company_id: string;
  operation_date: string;
  status: 'DRAFT' | 'CONFIRMED' | 'CLOSED';
  marina_id?: string;
  vessel_id?: string;
  captain_id?: string;
  first_officer_id?: string;
  weather?: string;
  general_notes?: string;
  expires_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface OperationResponseDto {
  success: boolean;
  message?: string;
  data: OperationDto;
}

export interface OperationListResponseDto {
  success: boolean;
  data: OperationDto[];
}

