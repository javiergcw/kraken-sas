/**
 * Caso de uso para obtener todos los buques
 */

import { vesselService } from '../services';
import { VesselListResponseDto } from '../dto';

export class GetAllVesselsUseCase {
  constructor(
    private readonly service = vesselService
  ) {}

  async execute(active?: boolean): Promise<VesselListResponseDto> {
    try {
      const response = await this.service.getAll(active);
      return response;
    } catch (error) {
      throw new Error(
        `Error en GetAllVesselsUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const getAllVesselsUseCase = new GetAllVesselsUseCase();

