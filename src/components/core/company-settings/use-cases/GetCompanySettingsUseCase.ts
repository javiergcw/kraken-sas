/**
 * Caso de uso para obtener la configuración de la compañía
 */

import { companySettingsService } from '../services';
import { CompanySettingsResponseDto } from '../dto';

export class GetCompanySettingsUseCase {
  constructor(
    private readonly service = companySettingsService
  ) {}

  async execute(): Promise<CompanySettingsResponseDto> {
    try {
      const response = await this.service.get();
      return response;
    } catch (error) {
      throw new Error(
        `Error en GetCompanySettingsUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const getCompanySettingsUseCase = new GetCompanySettingsUseCase();

