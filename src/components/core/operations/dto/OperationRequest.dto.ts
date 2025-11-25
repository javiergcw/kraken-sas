/**
 * DTOs para requests de operations (operaciones diarias)
 */

export interface OperationCreateRequestDto {
  operation_date: string; // YYYY-MM-DD
  marina_id?: string;
  vessel_id?: string;
  captain_id?: string;
  first_officer_id?: string;
  weather?: string;
  general_notes?: string;
  status?: 'DRAFT' | 'CONFIRMED' | 'CLOSED';
}

export interface OperationUpdateRequestDto {
  operation_date?: string; // YYYY-MM-DD
  marina_id?: string;
  vessel_id?: string;
  captain_id?: string;
  first_officer_id?: string;
  weather?: string;
  general_notes?: string;
  status?: 'DRAFT' | 'CONFIRMED' | 'CLOSED';
}

export interface OperationPublishRequestDto {
  target_status: 'CONFIRMED' | 'CLOSED';
  publish_notes?: string;
}

