import {
  getAllTemplatesUseCase,
  getTemplateByIdUseCase,
  createTemplateUseCase,
  updateTemplateUseCase,
  deleteTemplateUseCase,
} from '../use-cases';
import {
  ContractTemplatesResponseDto,
  ContractTemplateResponseDto,
  ContractTemplateCreateRequestDto,
  ContractTemplateUpdateRequestDto,
  ContractTemplateDeleteResponseDto,
} from '../dto';

export class ContractTemplateController {
  async getAll(): Promise<ContractTemplatesResponseDto | null> {
    try {
      return await getAllTemplatesUseCase.execute();
    } catch (error) {
      console.error('Error al obtener plantillas:', error);
      return null;
    }
  }

  async getById(id: string): Promise<ContractTemplateResponseDto | null> {
    try {
      return await getTemplateByIdUseCase.execute(id);
    } catch (error) {
      console.error('Error al obtener plantilla:', error);
      return null;
    }
  }

  async create(templateData: ContractTemplateCreateRequestDto): Promise<ContractTemplateResponseDto | null> {
    try {
      return await createTemplateUseCase.execute(templateData);
    } catch (error) {
      console.error('Error al crear plantilla:', error);
      return null;
    }
  }

  async update(id: string, templateData: ContractTemplateUpdateRequestDto): Promise<ContractTemplateResponseDto | null> {
    try {
      return await updateTemplateUseCase.execute(id, templateData);
    } catch (error) {
      console.error('Error al actualizar plantilla:', error);
      return null;
    }
  }

  async delete(id: string): Promise<ContractTemplateDeleteResponseDto | null> {
    try {
      return await deleteTemplateUseCase.execute(id);
    } catch (error) {
      console.error('Error al eliminar plantilla:', error);
      return null;
    }
  }
}

export const contractTemplateController = new ContractTemplateController();

