/**
 * Controlador para people (maestros/instructores)
 * Expone los métodos de people a los componentes
 */

import {
  getAllPeopleUseCase,
  getPeopleByIdUseCase,
  createPeopleUseCase,
  updatePeopleUseCase,
} from '../use-cases';
import {
  PeopleListResponseDto,
  PeopleResponseDto,
  PeopleCreateRequestDto,
  PeopleUpdateRequestDto,
} from '../dto';

export class PeopleController {
  /**
   * Obtiene todas las personas
   */
  async getAll(): Promise<PeopleListResponseDto | null> {
    try {
      return await getAllPeopleUseCase.execute();
    } catch (error) {
      console.error('Error al obtener personas:', error);
      return null;
    }
  }

  /**
   * Obtiene una persona por ID
   */
  async getById(id: string): Promise<PeopleResponseDto | null> {
    try {
      return await getPeopleByIdUseCase.execute(id);
    } catch (error) {
      console.error('Error al obtener persona:', error);
      return null;
    }
  }

  /**
   * Crea una nueva persona
   */
  async create(peopleData: PeopleCreateRequestDto): Promise<PeopleResponseDto | null> {
    try {
      return await createPeopleUseCase.execute(peopleData);
    } catch (error) {
      console.error('Error al crear persona:', error);
      return null;
    }
  }

  /**
   * Actualiza una persona existente
   */
  async update(
    id: string,
    peopleData: PeopleUpdateRequestDto
  ): Promise<PeopleResponseDto | null> {
    try {
      return await updatePeopleUseCase.execute(id, peopleData);
    } catch (error) {
      console.error('Error al actualizar persona:', error);
      return null;
    }
  }
}

// Exportar una instancia singleton del controlador
export const peopleController = new PeopleController();

