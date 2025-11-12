/**
 * Caso de uso para crear un producto
 */

import { productService } from '../services';
import { ProductCreateRequestDto, ProductResponseDto } from '../dto';

export class CreateProductUseCase {
  constructor(
    private readonly service = productService
  ) {}

  async execute(productData: ProductCreateRequestDto): Promise<ProductResponseDto> {
    try {
      const response = await this.service.create(productData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en CreateProductUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const createProductUseCase = new CreateProductUseCase();

