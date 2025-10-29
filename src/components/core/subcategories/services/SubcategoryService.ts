/**
 * Servicio para realizar operaciones de subcategorías
 */

import { httpService } from '@/utils/http.service';
import { API_ENDPOINTS } from '@/utils/constants';
import {
  SubcategoriesResponseDto,
  SubcategoryCreateRequestDto,
  SubcategoryUpdateRequestDto,
  SubcategoryResponseDto,
  SubcategoryDeleteResponseDto,
} from '../dto';

export class SubcategoryService {
  /**
   * Obtiene todas las subcategorías
   * @returns Promise con la lista de subcategorías
   */
  async getAll(): Promise<SubcategoriesResponseDto> {
    try {
      const response = await httpService.get<SubcategoriesResponseDto>(
        API_ENDPOINTS.SUBCATEGORIES.BASE
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener subcategorías: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Crea una nueva subcategoría
   * @param subcategoryData Datos de la subcategoría a crear
   * @returns Promise con la subcategoría creada
   */
  async create(subcategoryData: SubcategoryCreateRequestDto): Promise<SubcategoryResponseDto> {
    try {
      const response = await httpService.post<SubcategoryResponseDto>(
        API_ENDPOINTS.SUBCATEGORIES.BASE,
        subcategoryData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al crear subcategoría: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Actualiza una subcategoría existente
   * @param id ID de la subcategoría a actualizar
   * @param subcategoryData Datos actualizados de la subcategoría
   * @returns Promise con la subcategoría actualizada
   */
  async update(
    id: string,
    subcategoryData: SubcategoryUpdateRequestDto
  ): Promise<SubcategoryResponseDto> {
    try {
      const response = await httpService.put<SubcategoryResponseDto>(
        API_ENDPOINTS.SUBCATEGORIES.BY_ID(id),
        subcategoryData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al actualizar subcategoría: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Elimina una subcategoría
   * @param id ID de la subcategoría a eliminar
   * @returns Promise con la confirmación de eliminación
   */
  async delete(id: string): Promise<SubcategoryDeleteResponseDto> {
    try {
      const response = await httpService.delete<SubcategoryDeleteResponseDto>(
        API_ENDPOINTS.SUBCATEGORIES.BY_ID(id)
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al eliminar subcategoría: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton del servicio
export const subcategoryService = new SubcategoryService();

