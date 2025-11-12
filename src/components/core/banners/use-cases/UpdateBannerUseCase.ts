import { bannerService } from '../services/BannerService';
import { BannerUpdateRequestDto, BannerResponseDto } from '../dto';

export class UpdateBannerUseCase {
  async execute(id: string, bannerData: BannerUpdateRequestDto): Promise<BannerResponseDto> {
    try {
      const response = await bannerService.update(id, bannerData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en UpdateBannerUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const updateBannerUseCase = new UpdateBannerUseCase();

