/**
 * Caso de uso para obtener todos los productos
 */

import { productService } from '../services';
import { ProductsResponseDto } from '../dto';

export class GetAllProductsUseCase {
  constructor(
    private readonly service = productService
  ) {}

  async execute(): Promise<ProductsResponseDto> {
    try {
      const response = await this.service.getAll();
      return response;
    } catch (error) {
      throw new Error(
        `Error en GetAllProductsUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const getAllProductsUseCase = new GetAllProductsUseCase();

