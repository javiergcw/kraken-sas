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
import { httpService, HttpError } from '@/utils/http.service';
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
  notes_count?: number;
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
}

export interface ParticipantValidationResponseDto {
  success: boolean;
  message?: string;
  data?: {
    available_slots: number;
    can_add: boolean;
    current_participants: number;
    vessel_capacity: number;
  };
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
   * Valida si se puede agregar un participante a un grupo
   */
  async validateParticipant(groupId: string, participantData: ParticipantCreateDto): Promise<ParticipantValidationResponseDto> {
    try {
      const url = API_ENDPOINTS.OPERATION_GROUPS.VALIDATE_PARTICIPANT(groupId);
      const response = await httpService.post<ParticipantValidationResponseDto>(url, participantData);
      
      // Manejar diferentes estructuras de respuesta
      if (response?.success !== undefined) {
        return response;
      } else if (response?.data) {
        return { success: true, data: response.data };
      } else {
        return { success: true, data: response as any };
      }
    } catch (error: any) {
      console.error('Error al validar participante:', error);
      
      // Si es un HttpError, extraer el mensaje del body
      if (error instanceof HttpError && error.data) {
        const errorData = error.data;
        
        // Si tiene la estructura estándar de respuesta con success, message y data
        if (errorData.success !== undefined || (errorData.message && errorData.data)) {
          return {
            success: errorData.success || false,
            message: errorData.message || 'Error al validar participante',
            data: errorData.data
          };
        }
        
        // Si el error tiene información de capacidad directamente (vessel_capacity, can_add, etc.)
        if (errorData.vessel_capacity !== undefined || errorData.can_add !== undefined || errorData.current_participants !== undefined) {
          return {
            success: false,
            message: errorData.message || 'No se puede agregar más participantes. La embarcación ha alcanzado su capacidad máxima.',
            data: {
              vessel_capacity: errorData.vessel_capacity,
              current_participants: errorData.current_participants,
              available_slots: errorData.available_slots,
              can_add: errorData.can_add || false
            }
          };
        }
        
        // Si es un string o mensaje simple
        return {
          success: false,
          message: typeof errorData === 'string' ? errorData : errorData.message || 'Error al validar participante'
        };
      }
      
      // Si es un HttpError pero sin data estructurada
      if (error instanceof HttpError) {
        return {
          success: false,
          message: error.message || `Error HTTP ${error.status}: ${error.statusText}`
        };
      }
      
      // Error genérico
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error al validar participante' 
      };
    }
  }

  /**
   * Agrega un participante a un grupo
   */
  async addParticipant(groupId: string, participantData: ParticipantCreateDto): Promise<{ success: boolean; data?: ParticipantDto; message?: string }> {
    try {
      const url = API_ENDPOINTS.OPERATION_GROUPS.VALIDATE_PARTICIPANT(groupId);
      const response = await httpService.post<ParticipantDto>(url, participantData);
      return { success: true, data: response };
    } catch (error: any) {
      console.error('Error al agregar participante:', error);
      
      // Si es un HttpError, extraer el mensaje del body
      if (error instanceof HttpError && error.data) {
        const errorData = error.data;
        
        // Si tiene la estructura { success: false, error: "mensaje" }
        if (errorData.error) {
          return {
            success: false,
            message: errorData.error
          };
        }
        
        // Si tiene la estructura estándar de respuesta con message
        if (errorData.message) {
          return {
            success: false,
            message: errorData.message
          };
        }
        
        // Si es un string o mensaje simple
        if (typeof errorData === 'string') {
          return {
            success: false,
            message: errorData
          };
        }
      }
      
      // Error genérico
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
   * Obtiene todas las notas de un participante
   */
  async getParticipantNotes(participantId: string): Promise<{ success: boolean; data?: ParticipantNoteDto[]; message?: string }> {
    try {
      const url = API_ENDPOINTS.OPERATION_PARTICIPANTS.NOTES(participantId);
      const response = await httpService.get<any>(url);
      
      // Manejar diferentes estructuras de respuesta
      let notesArray: ParticipantNoteDto[] = [];
      
      if (Array.isArray(response)) {
        notesArray = response;
      } else if (response?.data && Array.isArray(response.data)) {
        notesArray = response.data;
      } else if (response?.success && Array.isArray(response.data)) {
        notesArray = response.data;
      } else {
        console.warn('Formato de respuesta inesperado para notas:', response);
        notesArray = [];
      }
      
      return { success: true, data: notesArray };
    } catch (error) {
      console.error('Error al obtener notas del participante:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error al obtener notas del participante' 
      };
    }
  }

  /**
   * Agrega una nota a un participante
   */
  async addParticipantNote(participantId: string, noteData: ParticipantNoteCreateDto): Promise<{ success: boolean; data?: ParticipantNoteDto; message?: string }> {
    try {
      const url = API_ENDPOINTS.OPERATION_PARTICIPANTS.NOTES(participantId);
      const response = await httpService.post<any>(url, noteData);
      
      // La respuesta del API es { success, data, message }
      if (response?.success && response?.data) {
        return { success: true, data: response.data };
      } else if (response?.data) {
        // Si la respuesta no tiene success pero tiene data, asumimos éxito
        return { success: true, data: response.data };
      } else {
        // Si la respuesta es directamente el objeto de la nota
        return { success: true, data: response };
      }
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

