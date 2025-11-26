/**
 * Controlador para operation groups (grupos dentro de operaciones)
 * Expone los métodos de operation groups a los componentes
 */

import {
  getAllOperationGroupsUseCase,
  createOperationGroupUseCase,
  updateOperationGroupUseCase,
} from '../use-cases';
import {
  OperationGroupListResponseDto,
  OperationGroupResponseDto,
  OperationGroupCreateRequestDto,
  OperationGroupUpdateRequestDto,
} from '../dto';
import { httpService } from '@/utils/http.service';
import { API_ENDPOINTS } from '@/routes/api.config';

export interface ParticipantDto {
  id?: string;
  person_id: string;
  role: 'DIVER' | 'INSTRUCTOR' | 'CREW';
  activity_id?: string;
  highlight_color?: string;
  tanks?: number;
  bags?: number;
  regulator?: string;
  bcd?: string;
  weightbelt?: string;
  weights_kg?: number;
  misc?: string;
  snorkel_set?: string;
  altimeter?: string;
  suit_size?: string;
  observations?: string;
  value_label?: string;
  invoice_reference?: string;
  payment_status?: string;
}

export interface ParticipantCreateDto {
  person_id: string;
  role: 'DIVER' | 'INSTRUCTOR' | 'CREW';
  activity_id?: string;
  highlight_color?: string;
  tanks?: number;
  bags?: number;
  regulator?: string;
  bcd?: string;
  weightbelt?: string;
  weights_kg?: number;
  misc?: string;
  snorkel_set?: string;
  altimeter?: string;
  suit_size?: string;
  observations?: string;
  value_label?: string;
  invoice_reference?: string;
  payment_status?: string;
}

export interface ParticipantUpdateDto {
  activity_id?: string;
  role?: 'DIVER' | 'INSTRUCTOR' | 'CREW';
  highlight_color?: string;
  tanks?: number;
  bags?: number;
  regulator?: string;
  bcd?: string;
  weightbelt?: string;
  weights_kg?: number;
  misc?: string;
  snorkel_set?: string;
  altimeter?: string;
  suit_size?: string;
  observations?: string;
  value_label?: string;
  invoice_reference?: string;
  payment_status?: string;
}

export interface ParticipantNoteDto {
  id: string;
  participant_id: string;
  person_id: string;
  note: string;
  color: string;
  created_at: string;
}

export interface ParticipantNoteCreateDto {
  note: string;
  color?: string;
  person_id: string;
}

export class OperationGroupController {
  /**
   * Obtiene todos los grupos de una operación
   */
  async getAllByOperation(operationId: string): Promise<OperationGroupListResponseDto | null> {
    try {
      return await getAllOperationGroupsUseCase.execute(operationId);
    } catch (error) {
      console.error('Error al obtener grupos de operación:', error);
      return null;
    }
  }

  /**
   * Crea un nuevo grupo en una operación
   */
  async create(
    operationId: string,
    groupData: OperationGroupCreateRequestDto
  ): Promise<OperationGroupResponseDto | null> {
    try {
      return await createOperationGroupUseCase.execute(operationId, groupData);
    } catch (error) {
      console.error('Error al crear grupo de operación:', error);
      return null;
    }
  }

  /**
   * Actualiza un grupo existente
   */
  async update(
    groupId: string,
    groupData: OperationGroupUpdateRequestDto
  ): Promise<OperationGroupResponseDto | null> {
    try {
      return await updateOperationGroupUseCase.execute(groupId, groupData);
    } catch (error) {
      console.error('Error al actualizar grupo de operación:', error);
      return null;
    }
  }

  /**
   * Obtiene todos los participantes de un grupo
   */
  async getParticipants(groupId: string): Promise<{ success: boolean; data?: ParticipantDto[]; message?: string }> {
    try {
      const url = API_ENDPOINTS.OPERATION_GROUPS.PARTICIPANTS(groupId);
      const response = await httpService.get<any>(url);
      
      // Manejar diferentes estructuras de respuesta
      let participantsArray: ParticipantDto[] = [];
      
      if (Array.isArray(response)) {
        // Si la respuesta es directamente un array
        participantsArray = response;
      } else if (response?.data && Array.isArray(response.data)) {
        // Si la respuesta tiene una propiedad data que es un array
        participantsArray = response.data;
      } else if (response?.success && Array.isArray(response.data)) {
        // Si la respuesta tiene success y data
        participantsArray = response.data;
      } else {
        console.warn('Formato de respuesta inesperado para participantes:', response);
        participantsArray = [];
      }
      
      return { success: true, data: participantsArray };
    } catch (error) {
      console.error('Error al obtener participantes:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error al obtener participantes' 
      };
    }
  }

  /**
   * Agrega un participante a un grupo
   */
  async addParticipant(groupId: string, participantData: ParticipantCreateDto): Promise<{ success: boolean; data?: ParticipantDto; message?: string }> {
    try {
      const url = API_ENDPOINTS.OPERATION_GROUPS.PARTICIPANTS(groupId);
      const response = await httpService.post<ParticipantDto>(url, participantData);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error al agregar participante:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error al agregar participante' 
      };
    }
  }

  /**
   * Actualiza un participante
   */
  async updateParticipant(participantId: string, participantData: ParticipantUpdateDto): Promise<{ success: boolean; data?: ParticipantDto; message?: string }> {
    try {
      const url = API_ENDPOINTS.OPERATION_PARTICIPANTS.BY_ID(participantId);
      const response = await httpService.put<ParticipantDto>(url, participantData);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error al actualizar participante:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error al actualizar participante' 
      };
    }
  }

  /**
   * Agrega una nota a un participante
   */
  async addParticipantNote(participantId: string, noteData: ParticipantNoteCreateDto): Promise<{ success: boolean; data?: ParticipantNoteDto; message?: string }> {
    try {
      const url = API_ENDPOINTS.OPERATION_PARTICIPANTS.NOTES(participantId);
      const response = await httpService.post<ParticipantNoteDto>(url, noteData);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error al agregar nota al participante:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error al agregar nota al participante' 
      };
    }
  }
}

// Exportar una instancia singleton del controlador
export const operationGroupController = new OperationGroupController();

