/**
 * Caso de uso para eliminar un producto
 */

import { productService } from '../services';
import { ProductDeleteResponseDto } from '../dto';

export class DeleteProductUseCase {
  constructor(
    private readonly service = productService
  ) {}

  async execute(id: string): Promise<ProductDeleteResponseDto> {
    try {
      const response = await this.service.delete(id);
      return response;
    } catch (error) {
      throw new Error(
        `Error en DeleteProductUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const deleteProductUseCase = new DeleteProductUseCase();

