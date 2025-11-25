/**
 * Servicio para realizar operaciones de people (maestros/instructores)
 */

import { httpService } from '@/utils/http.service';
import { API_ENDPOINTS } from '@/utils/constants';
import {
  PeopleListResponseDto,
  PeopleCreateRequestDto,
  PeopleUpdateRequestDto,
  PeopleResponseDto,
} from '../dto';

export class PeopleService {
  /**
   * Obtiene todas las personas
   * @returns Promise con la lista de personas
   */
  async getAll(): Promise<PeopleListResponseDto> {
    try {
      const response = await httpService.get<PeopleListResponseDto>(
        API_ENDPOINTS.PEOPLE.BASE
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener personas: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Obtiene una persona por ID
   * @param id ID de la persona
   * @returns Promise con la persona
   */
  async getById(id: string): Promise<PeopleResponseDto> {
    try {
      const response = await httpService.get<PeopleResponseDto>(
        API_ENDPOINTS.PEOPLE.BY_ID(id)
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener persona: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Crea una nueva persona
   * @param peopleData Datos de la persona a crear
   * @returns Promise con la persona creada
   */
  async create(peopleData: PeopleCreateRequestDto): Promise<PeopleResponseDto> {
    try {
      const response = await httpService.post<PeopleResponseDto>(
        API_ENDPOINTS.PEOPLE.BASE,
        peopleData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al crear persona: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Actualiza una persona existente
   * @param id ID de la persona a actualizar
   * @param peopleData Datos actualizados de la persona
   * @returns Promise con la persona actualizada
   */
  async update(
    id: string,
    peopleData: PeopleUpdateRequestDto
  ): Promise<PeopleResponseDto> {
    try {
      const response = await httpService.put<PeopleResponseDto>(
        API_ENDPOINTS.PEOPLE.BY_ID(id),
        peopleData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al actualizar persona: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// Exportar una instancia singleton del servicio
export const peopleService = new PeopleService();

