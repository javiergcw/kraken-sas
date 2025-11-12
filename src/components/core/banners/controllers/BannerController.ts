import {
  getAllBannersUseCase,
  createBannerUseCase,
  updateBannerUseCase,
  deleteBannerUseCase,
} from '../use-cases';
import {
  BannersResponseDto,
  BannerResponseDto,
  BannerCreateRequestDto,
  BannerUpdateRequestDto,
  BannerDeleteResponseDto,
} from '../dto';

export class BannerController {
  async getAll(): Promise<BannersResponseDto | null> {
    try {
      return await getAllBannersUseCase.execute();
    } catch (error) {
      console.error('Error al obtener banners:', error);
      return null;
    }
  }

  async create(bannerData: BannerCreateRequestDto): Promise<BannerResponseDto | null> {
    try {
      return await createBannerUseCase.execute(bannerData);
    } catch (error) {
      console.error('Error al crear banner:', error);
      return null;
    }
  }

  async update(id: string, bannerData: BannerUpdateRequestDto): Promise<BannerResponseDto | null> {
    try {
      return await updateBannerUseCase.execute(id, bannerData);
    } catch (error) {
      console.error('Error al actualizar banner:', error);
      return null;
    }
  }

  async delete(id: string): Promise<BannerDeleteResponseDto | null> {
    try {
      return await deleteBannerUseCase.execute(id);
    } catch (error) {
      console.error('Error al eliminar banner:', error);
      return null;
    }
  }
}

export const bannerController = new BannerController();

