/**
 * Caso de uso para crear la configuración de la compañía
 */

import { companySettingsService } from '../services';
import { CompanySettingsUpdateRequestDto, CompanySettingsResponseDto } from '../dto';

export class CreateCompanySettingsUseCase {
  constructor(
    private readonly service = companySettingsService
  ) {}

  async execute(settingsData: CompanySettingsUpdateRequestDto): Promise<CompanySettingsResponseDto> {
    try {
      const response = await this.service.create(settingsData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en CreateCompanySettingsUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const createCompanySettingsUseCase = new CreateCompanySettingsUseCase();

