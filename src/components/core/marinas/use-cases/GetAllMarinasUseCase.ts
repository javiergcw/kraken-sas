/**
 * Caso de uso para obtener todas las marinas
 */

import { marinaService } from '../services';
import { MarinaListResponseDto } from '../dto';

export class GetAllMarinasUseCase {
  constructor(
    private readonly service = marinaService
  ) {}

  async execute(active?: boolean): Promise<MarinaListResponseDto> {
    try {
      const response = await this.service.getAll(active);
      return response;
    } catch (error) {
      throw new Error(
        `Error en GetAllMarinasUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const getAllMarinasUseCase = new GetAllMarinasUseCase();

