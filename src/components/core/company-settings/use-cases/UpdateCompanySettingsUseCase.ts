/**
 * Caso de uso para actualizar la configuración de la compañía
 */

import { companySettingsService } from '../services';
import { CompanySettingsUpdateRequestDto, CompanySettingsResponseDto } from '../dto';

export class UpdateCompanySettingsUseCase {
  constructor(
    private readonly service = companySettingsService
  ) {}

  async execute(settingsData: CompanySettingsUpdateRequestDto): Promise<CompanySettingsResponseDto> {
    try {
      const response = await this.service.update(settingsData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en UpdateCompanySettingsUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const updateCompanySettingsUseCase = new UpdateCompanySettingsUseCase();

