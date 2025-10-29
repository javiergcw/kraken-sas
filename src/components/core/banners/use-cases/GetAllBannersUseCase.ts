import { bannerService } from '../services/BannerService';
import { BannersResponseDto } from '../dto';

export class GetAllBannersUseCase {
  async execute(): Promise<BannersResponseDto> {
    try {
      const response = await bannerService.getAll();
      return response;
    } catch (error) {
      throw new Error(
        `Error en GetAllBannersUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const getAllBannersUseCase = new GetAllBannersUseCase();

