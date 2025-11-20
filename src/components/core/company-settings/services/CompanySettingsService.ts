/**
 * Servicio para realizar operaciones de company settings
 */

import { httpService } from '@/utils/http.service';
import { API_ENDPOINTS } from '@/routes/api.config';
import {
  CompanySettingsResponseDto,
  CompanySettingsUpdateRequestDto,
} from '../dto';

export class CompanySettingsService {
  /**
   * Obtiene la configuración de la compañía
   * @returns Promise con la configuración de la compañía
   */
  async get(): Promise<CompanySettingsResponseDto> {
    try {
      const response = await httpService.get<CompanySettingsResponseDto>(
        API_ENDPOINTS.COMPANY_SETTINGS.BASE
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener configuración de compañía: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Crea la configuración de la compañía
   * @param settingsData Datos de la configuración a crear
   * @returns Promise con la configuración creada
   */
  async create(
    settingsData: CompanySettingsUpdateRequestDto
  ): Promise<CompanySettingsResponseDto> {
    try {
      const response = await httpService.post<CompanySettingsResponseDto>(
        API_ENDPOINTS.COMPANY_SETTINGS.BASE,
        settingsData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al crear configuración de compañía: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Actualiza la configuración de la compañía
   * @param settingsData Datos actualizados de la configuración
   * @returns Promise con la configuración actualizada
   */
  async update(
    settingsData: CompanySettingsUpdateRequestDto
  ): Promise<CompanySettingsResponseDto> {
    try {
      const response = await httpService.put<CompanySettingsResponseDto>(
        API_ENDPOINTS.COMPANY_SETTINGS.BASE,
        settingsData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al actualizar configuración de compañía: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton del servicio
export const companySettingsService = new CompanySettingsService();

