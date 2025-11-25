/**
 * Caso de uso para crear un nuevo buque
 */

import { vesselService } from '../services';
import { VesselCreateRequestDto, VesselResponseDto } from '../dto';

export class CreateVesselUseCase {
  constructor(
    private readonly service = vesselService
  ) {}

  async execute(vesselData: VesselCreateRequestDto): Promise<VesselResponseDto> {
    try {
      const response = await this.service.create(vesselData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en CreateVesselUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const createVesselUseCase = new CreateVesselUseCase();

