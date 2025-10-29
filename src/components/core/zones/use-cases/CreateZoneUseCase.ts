import { zoneService } from '../services/ZoneService';
import { ZoneCreateRequestDto, ZoneResponseDto } from '../dto';

export class CreateZoneUseCase {
  async execute(zoneData: ZoneCreateRequestDto): Promise<ZoneResponseDto> {
    try {
      const response = await zoneService.create(zoneData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en CreateZoneUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const createZoneUseCase = new CreateZoneUseCase();
