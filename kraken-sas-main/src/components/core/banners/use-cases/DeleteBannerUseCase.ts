import { bannerService } from '../services/BannerService';
import { BannerDeleteResponseDto } from '../dto';

export class DeleteBannerUseCase {
  async execute(id: string): Promise<BannerDeleteResponseDto> {
    try {
      const response = await bannerService.delete(id);
      return response;
    } catch (error) {
      throw new Error(
        `Error en DeleteBannerUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const deleteBannerUseCase = new DeleteBannerUseCase();

