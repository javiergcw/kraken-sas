/**
 * Controlador para company settings
 * Expone los métodos de company settings a los componentes
 */

import {
  getCompanySettingsUseCase,
  createCompanySettingsUseCase,
  updateCompanySettingsUseCase,
} from '../use-cases';
import {
  CompanySettingsResponseDto,
  CompanySettingsUpdateRequestDto,
} from '../dto';

export class CompanySettingsController {
  /**
   * Obtiene la configuración de la compañía
   */
  async get(): Promise<CompanySettingsResponseDto | null> {
    try {
      return await getCompanySettingsUseCase.execute();
    } catch (error) {
      console.error('Error al obtener configuración de compañía:', error);
      return null;
    }
  }

  /**
   * Crea la configuración de la compañía
   */
  async create(
    settingsData: CompanySettingsUpdateRequestDto
  ): Promise<CompanySettingsResponseDto | null> {
    try {
      return await createCompanySettingsUseCase.execute(settingsData);
    } catch (error) {
      console.error('Error al crear configuración de compañía:', error);
      return null;
    }
  }

  /**
   * Actualiza la configuración de la compañía
   */
  async update(
    settingsData: CompanySettingsUpdateRequestDto
  ): Promise<CompanySettingsResponseDto | null> {
    try {
      return await updateCompanySettingsUseCase.execute(settingsData);
    } catch (error) {
      console.error('Error al actualizar configuración de compañía:', error);
      return null;
    }
  }
}

// Exportar una instancia singleton del controlador
export const companySettingsController = new CompanySettingsController();

