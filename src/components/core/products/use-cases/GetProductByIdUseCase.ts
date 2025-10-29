/**
 * Caso de uso para obtener un producto por ID
 */

import { productService } from '../services';
import { ProductResponseDto } from '../dto';

export class GetProductByIdUseCase {
  constructor(
    private readonly service = productService
  ) {}

  async execute(id: string): Promise<ProductResponseDto> {
    try {
      const response = await this.service.getById(id);
      return response;
    } catch (error) {
      throw new Error(
        `Error en GetProductByIdUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const getProductByIdUseCase = new GetProductByIdUseCase();

