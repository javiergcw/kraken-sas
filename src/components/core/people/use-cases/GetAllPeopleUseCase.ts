/**
 * Caso de uso para obtener todas las personas
 */

import { peopleService } from '../services';
import { PeopleListResponseDto } from '../dto';

export class GetAllPeopleUseCase {
  constructor(
    private readonly service = peopleService
  ) {}

  async execute(): Promise<PeopleListResponseDto> {
    try {
      const response = await this.service.getAll();
      return response;
    } catch (error) {
      throw new Error(
        `Error en GetAllPeopleUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const getAllPeopleUseCase = new GetAllPeopleUseCase();

