/**
 * Servicio para realizar operaciones de plantillas de contratos
 */

import { httpService, HttpError } from '@/utils/http.service';
import { API_ENDPOINTS } from '@/utils/constants';
import {
  ContractTemplatesResponseDto,
  ContractTemplateResponseDto,
  ContractTemplateCreateRequestDto,
  ContractTemplateUpdateRequestDto,
  ContractTemplateDeleteResponseDto,
  TemplateVariableCreateRequestDto,
  TemplateVariableResponseDto,
  TemplateVariableUpdateRequestDto,
  TemplateVariableDeleteResponseDto,
} from '../dto';

export class ContractTemplateService {
  // Operaciones de plantillas
  async getAll(): Promise<ContractTemplatesResponseDto> {
    try {
      const response = await httpService.get<ContractTemplatesResponseDto>(
        API_ENDPOINTS.CONTRACTS.TEMPLATES.BASE
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener plantillas: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  async getById(id: string): Promise<ContractTemplateResponseDto> {
    try {
      const response = await httpService.get<ContractTemplateResponseDto>(
        API_ENDPOINTS.CONTRACTS.TEMPLATES.BY_ID(id)
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener plantilla: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  async create(templateData: ContractTemplateCreateRequestDto): Promise<ContractTemplateResponseDto> {
    try {
      const response = await httpService.post<ContractTemplateResponseDto>(
        API_ENDPOINTS.CONTRACTS.TEMPLATES.BASE,
        templateData
      );
      return response;
    } catch (error) {
      // Extraer el mensaje de error de la API si está disponible
      if (error instanceof HttpError && error.data) {
        const errorMessage = error.data?.message || error.data?.error || error.message;
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al crear plantilla: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  async update(
    id: string,
    templateData: ContractTemplateUpdateRequestDto
  ): Promise<ContractTemplateResponseDto> {
    try {
      const response = await httpService.put<ContractTemplateResponseDto>(
        API_ENDPOINTS.CONTRACTS.TEMPLATES.BY_ID(id),
        templateData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al actualizar plantilla: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  async delete(id: string): Promise<ContractTemplateDeleteResponseDto> {
    try {
      const response = await httpService.delete<ContractTemplateDeleteResponseDto>(
        API_ENDPOINTS.CONTRACTS.TEMPLATES.BY_ID(id)
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al eliminar plantilla: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  // Operaciones de variables de plantilla
  async createVariable(
    templateId: string,
    variableData: TemplateVariableCreateRequestDto
  ): Promise<TemplateVariableResponseDto> {
    try {
      const response = await httpService.post<TemplateVariableResponseDto>(
        API_ENDPOINTS.CONTRACTS.TEMPLATES.VARIABLES(templateId),
        variableData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al crear variable: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  async updateVariable(
    variableId: string,
    variableData: TemplateVariableUpdateRequestDto
  ): Promise<TemplateVariableResponseDto> {
    try {
      const response = await httpService.put<TemplateVariableResponseDto>(
        API_ENDPOINTS.CONTRACTS.VARIABLES.BY_ID(variableId),
        variableData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al actualizar variable: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  async deleteVariable(variableId: string): Promise<TemplateVariableDeleteResponseDto> {
    try {
      const response = await httpService.delete<TemplateVariableDeleteResponseDto>(
        API_ENDPOINTS.CONTRACTS.VARIABLES.BY_ID(variableId)
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al eliminar variable: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const contractTemplateService = new ContractTemplateService();

