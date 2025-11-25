/**
 * Caso de uso para crear una nueva persona
 */

import { peopleService } from '../services';
import { PeopleCreateRequestDto, PeopleResponseDto } from '../dto';

export class CreatePeopleUseCase {
  constructor(
    private readonly service = peopleService
  ) {}

  async execute(peopleData: PeopleCreateRequestDto): Promise<PeopleResponseDto> {
    try {
      const response = await this.service.create(peopleData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en CreatePeopleUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const createPeopleUseCase = new CreatePeopleUseCase();

