/**
 * Caso de uso para actualizar una persona existente
 */

import { peopleService } from '../services';
import { PeopleUpdateRequestDto, PeopleResponseDto } from '../dto';

export class UpdatePeopleUseCase {
  constructor(
    private readonly service = peopleService
  ) {}

  async execute(id: string, peopleData: PeopleUpdateRequestDto): Promise<PeopleResponseDto> {
    try {
      const response = await this.service.update(id, peopleData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en UpdatePeopleUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const updatePeopleUseCase = new UpdatePeopleUseCase();

