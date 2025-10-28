/**
 * DTOs para el sistema de autenticación
 */

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface UserDto {
  id: string;
  email: string;
  role: string;
  company_id: string | null;
}

export interface LoginResponseDto {
  success: boolean;
  message: string;
  data: {
    token: string;
    User: UserDto;
  };
}

