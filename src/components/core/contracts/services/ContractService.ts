/**
 * Servicio para realizar operaciones de contratos emitidos
 */

import { httpService } from '@/utils/http.service';
import { tokenService } from '@/utils/token.service';
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
      // Obtener token usando el servicio centralizado
      const token = tokenService.getToken();
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const headers: HeadersInit = {
        'Accept': 'text/html',
        'Authorization': `Bearer ${token}`,
      };

      console.log('[ContractService] Downloading HTML for contract:', id);

      // Usar /api como prefijo para pasar por el proxy de Next.js
      const response = await fetch(
        `/api${API_ENDPOINTS.CONTRACTS.PDF(id)}`,
        { 
          method: 'GET',
          headers 
        }
      );

      console.log('[ContractService] Response status:', response.status);
      console.log('[ContractService] Response content-type:', response.headers.get('content-type'));

      // Verificar si la respuesta es JSON (puede ser un error)
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const jsonData = await response.json();
        console.log('[ContractService] JSON response:', jsonData);
        
        // Cualquier error
        throw new Error(jsonData.message || jsonData.error || 'Error al obtener HTML del contrato');
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[ContractService] Error response:', errorText);
        throw new Error(`Error al obtener HTML: ${errorText || response.statusText}`);
      }

      const htmlContent = await response.text();
      console.log('[ContractService] HTML downloaded, length:', htmlContent.length);

      // Validar que no esté vacío
      if (!htmlContent || htmlContent.trim().length === 0) {
        console.error('[ContractService] Response is empty');
        throw new Error('La respuesta está vacía');
      }

      return htmlContent;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al descargar HTML: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  async generatePDF(
    id: string,
    generateData: ContractGeneratePDFRequestDto
  ): Promise<ContractPDFResponseDto> {
    try {
      console.log('[ContractService] Generating PDF for contract:', id);
      console.log('[ContractService] Generate data:', generateData);
      
      const response = await httpService.post<ContractPDFResponseDto>(
        API_ENDPOINTS.CONTRACTS.PDF(id),
        generateData
      );
      
      console.log('[ContractService] PDF generation response:', response);
      return response;
    } catch (error) {
      console.error('[ContractService] Error generating PDF:', error);
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

