/**
 * Servicio para realizar operaciones de categorías
 */

import { httpService } from '@/utils/http.service';
import { API_ENDPOINTS } from '@/utils/constants';
import {
  CategoriesResponseDto,
  CategoryCreateRequestDto,
  CategoryUpdateRequestDto,
  CategoryResponseDto,
  CategoryDeleteResponseDto,
} from '../dto';

export class CategoryService {
  /**
   * Obtiene todas las categorías
   * @returns Promise con la lista de categorías
   */
  async getAll(): Promise<CategoriesResponseDto> {
    try {
      const response = await httpService.get<CategoriesResponseDto>(
        API_ENDPOINTS.CATEGORIES.BASE
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener categorías: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Crea una nueva categoría
   * @param categoryData Datos de la categoría a crear
   * @returns Promise con la categoría creada
   */
  async create(categoryData: CategoryCreateRequestDto): Promise<CategoryResponseDto> {
    try {
      const response = await httpService.post<CategoryResponseDto>(
        API_ENDPOINTS.CATEGORIES.BASE,
        categoryData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al crear categoría: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Actualiza una categoría existente
   * @param id ID de la categoría a actualizar
   * @param categoryData Datos actualizados de la categoría
   * @returns Promise con la categoría actualizada
   */
  async update(
    id: string,
    categoryData: CategoryUpdateRequestDto
  ): Promise<CategoryResponseDto> {
    try {
      const response = await httpService.put<CategoryResponseDto>(
        API_ENDPOINTS.CATEGORIES.BY_ID(id),
        categoryData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al actualizar categoría: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Elimina una categoría
   * @param id ID de la categoría a eliminar
   * @returns Promise con la confirmación de eliminación
   */
  async delete(id: string): Promise<CategoryDeleteResponseDto> {
    try {
      const response = await httpService.delete<CategoryDeleteResponseDto>(
        API_ENDPOINTS.CATEGORIES.BY_ID(id)
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al eliminar categoría: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton del servicio
export const categoryService = new CategoryService();

