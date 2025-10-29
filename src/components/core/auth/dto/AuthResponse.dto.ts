/**
 * DTOs para responses de autenticación
 */

import { UserDataDto } from '../../user/dto';

export interface LoginResponseDto {
  success: boolean;
  message: string;
  data: {
    token: string;
    User: UserDataDto;
  };
}

// Re-exportar para compatibilidad
export type { UserDataDto as UserDto } from '../../user/dto';

