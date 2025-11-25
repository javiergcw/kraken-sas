/**
 * DTOs para responses de activities
 */

export interface ActivityDto {
  id: string;
  company_id: string;
  code: string;
  description?: string;
  color?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ActivityResponseDto {
  success: boolean;
  message?: string;
  data: ActivityDto;
}

export interface ActivityListResponseDto {
  success: boolean;
  data: ActivityDto[];
}

