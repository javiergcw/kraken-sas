/**
 * Caso de uso para eliminar una subcategoría
 */

import { subcategoryService } from '../services/SubcategoryService';
import { SubcategoryDeleteResponseDto } from '../dto';

export class DeleteSubcategoryUseCase {
  /**
   * Ejecuta la eliminación de una subcategoría
   * @param id ID de la subcategoría a eliminar
   * @returns Promise con la confirmación de eliminación
   */
  async execute(id: string): Promise<SubcategoryDeleteResponseDto> {
    try {
      const response = await subcategoryService.delete(id);
      return response;
    } catch (error) {
      throw new Error(
        `Error en DeleteSubcategoryUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton
export const deleteSubcategoryUseCase = new DeleteSubcategoryUseCase();

