/**
 * DTOs relacionados con el usuario autenticado
 */

export interface UserDataDto {
  id: string;
  email: string;
  role: string;
  company_id: string;
}

export interface GetMeResponseDto {
  success: boolean;
  data: UserDataDto;
}

