/**
 * Caso de uso para crear una nueva marina
 */

import { marinaService } from '../services';
import { MarinaCreateRequestDto, MarinaResponseDto } from '../dto';

export class CreateMarinaUseCase {
  constructor(
    private readonly service = marinaService
  ) {}

  async execute(marinaData: MarinaCreateRequestDto): Promise<MarinaResponseDto> {
    try {
      const response = await this.service.create(marinaData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en CreateMarinaUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const createMarinaUseCase = new CreateMarinaUseCase();

