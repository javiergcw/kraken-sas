import { zoneService } from '../services/ZoneService';
import { ZonesResponseDto } from '../dto';

export class GetAllZonesUseCase {
  async execute(): Promise<ZonesResponseDto> {
    try {
      const response = await zoneService.getAll();
      return response;
    } catch (error) {
      throw new Error(
        `Error en GetAllZonesUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const getAllZonesUseCase = new GetAllZonesUseCase();

