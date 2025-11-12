/**
 * Servicio para realizar operaciones de banners
 */

import { httpService } from '@/utils/http.service';
import { API_ENDPOINTS } from '@/utils/constants';
import {
  BannersResponseDto,
  BannerCreateRequestDto,
  BannerUpdateRequestDto,
  BannerResponseDto,
  BannerDeleteResponseDto,
} from '../dto';

export class BannerService {
  async getAll(): Promise<BannersResponseDto> {
    try {
      const response = await httpService.get<BannersResponseDto>(
        API_ENDPOINTS.BANNERS.BASE
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener banners: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  async create(bannerData: BannerCreateRequestDto): Promise<BannerResponseDto> {
    try {
      const response = await httpService.post<BannerResponseDto>(
        API_ENDPOINTS.BANNERS.BASE,
        bannerData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al crear banner: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  async update(
    id: string,
    bannerData: BannerUpdateRequestDto
  ): Promise<BannerResponseDto> {
    try {
      const response = await httpService.put<BannerResponseDto>(
        API_ENDPOINTS.BANNERS.BY_ID(id),
        bannerData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al actualizar banner: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  async delete(id: string): Promise<BannerDeleteResponseDto> {
    try {
      const response = await httpService.delete<BannerDeleteResponseDto>(
        API_ENDPOINTS.BANNERS.BY_ID(id)
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al eliminar banner: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const bannerService = new BannerService();

