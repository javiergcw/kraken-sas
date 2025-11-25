/**
 * DTOs para requests de people (maestros/instructores)
 */

export interface PeopleCreateRequestDto {
  full_name: string;
  default_role: 'DIVER' | 'INSTRUCTOR' | 'CREW';
  document_number?: string;
  phone?: string;
  email?: string;
  default_note_color?: string;
  default_highlight?: string;
  notes?: string;
}

export interface PeopleUpdateRequestDto {
  full_name?: string;
  default_role?: 'DIVER' | 'INSTRUCTOR' | 'CREW';
  document_number?: string;
  phone?: string;
  email?: string;
  default_note_color?: string;
  default_highlight?: string;
  notes?: string;
}

