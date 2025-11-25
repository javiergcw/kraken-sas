/**
 * Caso de uso para actualizar una marina existente
 */

import { marinaService } from '../services';
import { MarinaUpdateRequestDto, MarinaResponseDto } from '../dto';

export class UpdateMarinaUseCase {
  constructor(
    private readonly service = marinaService
  ) {}

  async execute(id: string, marinaData: MarinaUpdateRequestDto): Promise<MarinaResponseDto> {
    try {
      const response = await this.service.update(id, marinaData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en UpdateMarinaUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const updateMarinaUseCase = new UpdateMarinaUseCase();

