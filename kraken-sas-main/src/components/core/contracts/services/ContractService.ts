/**
 * Servicio para realizar operaciones de contratos emitidos
 */

import { httpService } from '@/utils/http.service';
import { API_ENDPOINTS } from '@/utils/constants';
import {
  ContractsResponseDto,
  ContractResponseDto,
  ContractCreateRequestDto,
  ContractDeleteResponseDto,
  ContractSignRequestDto,
  ContractSignResponseDto,
  ContractInvalidateRequestDto,
  ContractInvalidateResponseDto,
  ContractGeneratePDFRequestDto,
  ContractPDFResponseDto,
  PublicContractResponseDto,
  PublicContractStatusResponseDto,
} from '../dto';

export class ContractService {
  // Operaciones de contratos (autenticadas)
  async getAll(): Promise<ContractsResponseDto> {
    try {
      const response = await httpService.get<ContractsResponseDto>(
        API_ENDPOINTS.CONTRACTS.BASE
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener contratos: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  async getById(id: string): Promise<ContractResponseDto> {
    try {
      const response = await httpService.get<ContractResponseDto>(
        API_ENDPOINTS.CONTRACTS.BY_ID(id)
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener contrato: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  async create(contractData: ContractCreateRequestDto): Promise<ContractResponseDto> {
    try {
      const response = await httpService.post<ContractResponseDto>(
        API_ENDPOINTS.CONTRACTS.BASE,
        contractData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al crear contrato: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  async delete(id: string): Promise<ContractDeleteResponseDto> {
    try {
      const response = await httpService.delete<ContractDeleteResponseDto>(
        API_ENDPOINTS.CONTRACTS.BY_ID(id)
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al eliminar contrato: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  async sign(id: string, signData: ContractSignRequestDto): Promise<ContractSignResponseDto> {
    try {
      const response = await httpService.post<ContractSignResponseDto>(
        API_ENDPOINTS.CONTRACTS.SIGN(id),
        signData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al firmar contrato: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  async invalidate(
    id: string,
    invalidateData: ContractInvalidateRequestDto
  ): Promise<ContractInvalidateResponseDto> {
    try {
      const response = await httpService.post<ContractInvalidateResponseDto>(
        API_ENDPOINTS.CONTRACTS.INVALIDATE(id),
        invalidateData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al invalidar contrato: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  async downloadPDF(id: string): Promise<string> {
    try {
      // Para descargas de archivos, usar fetch directamente
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: HeadersInit = {
        'Accept': 'text/html',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_ENDPOINTS.CONTRACTS.PDF(id)}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error('Error al obtener HTML del contrato');
      }

      const htmlContent = await response.text();
      
      // Validar que no esté vacío
      if (!htmlContent || htmlContent.trim().length === 0) {
        throw new Error('La respuesta está vacía');
      }

      return htmlContent;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener HTML: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  async generatePDF(
    id: string,
    generateData: ContractGeneratePDFRequestDto
  ): Promise<ContractPDFResponseDto> {
    try {
      const response = await httpService.post<ContractPDFResponseDto>(
        API_ENDPOINTS.CONTRACTS.PDF(id),
        generateData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al generar PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  // Operaciones públicas (sin autenticación)
  async getByToken(token: string): Promise<PublicContractResponseDto> {
    try {
      const response = await httpService.get<PublicContractResponseDto>(
        API_ENDPOINTS.CONTRACTS.PUBLIC.BY_TOKEN(token)
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener contrato público: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  async signByToken(
    token: string,
    signData: ContractSignRequestDto
  ): Promise<ContractSignResponseDto> {
    try {
      const response = await httpService.post<ContractSignResponseDto>(
        API_ENDPOINTS.CONTRACTS.PUBLIC.SIGN(token),
        signData
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al firmar contrato público: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  async getStatusByToken(token: string): Promise<PublicContractStatusResponseDto> {
    try {
      const response = await httpService.get<PublicContractStatusResponseDto>(
        API_ENDPOINTS.CONTRACTS.PUBLIC.STATUS(token)
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener estado del contrato: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const contractService = new ContractService();

