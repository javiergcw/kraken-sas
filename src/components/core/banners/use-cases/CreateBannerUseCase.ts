import { bannerService } from '../services/BannerService';
import { BannerCreateRequestDto, BannerResponseDto } from '../dto';

export class CreateBannerUseCase {
  async execute(bannerData: BannerCreateRequestDto): Promise<BannerResponseDto> {
    try {
      const response = await bannerService.create(bannerData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en CreateBannerUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const createBannerUseCase = new CreateBannerUseCase();

