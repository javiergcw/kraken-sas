/**
 * Caso de uso para actualizar un buque existente
 */

import { vesselService } from '../services';
import { VesselUpdateRequestDto, VesselResponseDto } from '../dto';

export class UpdateVesselUseCase {
  constructor(
    private readonly service = vesselService
  ) {}

  async execute(id: string, vesselData: VesselUpdateRequestDto): Promise<VesselResponseDto> {
    try {
      const response = await this.service.update(id, vesselData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en UpdateVesselUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const updateVesselUseCase = new UpdateVesselUseCase();

