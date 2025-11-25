/**
 * DTOs para responses de people (maestros/instructores)
 */

export interface PeopleDto {
  id: string;
  company_id: string;
  full_name: string;
  default_role: 'DIVER' | 'INSTRUCTOR' | 'CREW';
  is_active: boolean;
  document_number?: string;
  phone?: string;
  email?: string;
  default_note_color?: string;
  default_highlight?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PeopleResponseDto {
  success: boolean;
  message?: string;
  data: PeopleDto;
}

export interface PeopleListResponseDto {
  success: boolean;
  data: PeopleDto[];
}

