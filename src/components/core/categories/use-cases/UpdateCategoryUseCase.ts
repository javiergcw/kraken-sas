/**
 * Caso de uso para actualizar una categoría
 */

import { categoryService } from '../services/CategoryService';
import { CategoryUpdateRequestDto, CategoryResponseDto } from '../dto';

export class UpdateCategoryUseCase {
  /**
   * Ejecuta la actualización de una categoría
   * @param id ID de la categoría a actualizar
   * @param categoryData Datos actualizados de la categoría
   * @returns Promise con la categoría actualizada
   */
  async execute(id: string, categoryData: CategoryUpdateRequestDto): Promise<CategoryResponseDto> {
    try {
      const response = await categoryService.update(id, categoryData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en UpdateCategoryUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton
export const updateCategoryUseCase = new UpdateCategoryUseCase();

