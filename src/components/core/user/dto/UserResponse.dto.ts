/**
 * DTOs para responses de usuario
 */

export interface UserDataDto {
  id: string;
  email: string;
  role: string;
  company_id: string | null;
  company_name?: string | null;
  company_logo?: string | null;
}

export interface GetMeResponseDto {
  success: boolean;
  data: UserDataDto;
}

