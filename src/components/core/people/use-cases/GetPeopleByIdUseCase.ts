/**
 * Caso de uso para obtener una persona por ID
 */

import { peopleService } from '../services';
import { PeopleResponseDto } from '../dto';

export class GetPeopleByIdUseCase {
  constructor(
    private readonly service = peopleService
  ) {}

  async execute(id: string): Promise<PeopleResponseDto> {
    try {
      const response = await this.service.getById(id);
      return response;
    } catch (error) {
      throw new Error(
        `Error en GetPeopleByIdUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const getPeopleByIdUseCase = new GetPeopleByIdUseCase();

