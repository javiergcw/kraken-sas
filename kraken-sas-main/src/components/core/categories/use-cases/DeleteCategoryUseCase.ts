/**
 * Caso de uso para eliminar una categoría
 */

import { categoryService } from '../services/CategoryService';
import { CategoryDeleteResponseDto } from '../dto';

export class DeleteCategoryUseCase {
  /**
   * Ejecuta la eliminación de una categoría
   * @param id ID de la categoría a eliminar
   * @returns Promise con la confirmación de eliminación
   */
  async execute(id: string): Promise<CategoryDeleteResponseDto> {
    try {
      const response = await categoryService.delete(id);
      return response;
    } catch (error) {
      throw new Error(
        `Error en DeleteCategoryUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton
export const deleteCategoryUseCase = new DeleteCategoryUseCase();

