import {
  getAllContractsUseCase,
  getContractByIdUseCase,
  createContractUseCase,
  signContractUseCase,
  invalidateContractUseCase,
  deleteContractUseCase,
} from '../use-cases';
import {
  ContractsResponseDto,
  ContractResponseDto,
  ContractCreateRequestDto,
  ContractDeleteResponseDto,
  ContractSignRequestDto,
  ContractSignResponseDto,
  ContractInvalidateRequestDto,
  ContractInvalidateResponseDto,
} from '../dto';
import { contractService } from '../services/ContractService';

export class ContractController {
  async getAll(): Promise<ContractsResponseDto | null> {
    try {
      return await getAllContractsUseCase.execute();
    } catch (error) {
      console.error('Error al obtener contratos:', error);
      return null;
    }
  }

  async getById(id: string): Promise<ContractResponseDto | null> {
    try {
      return await getContractByIdUseCase.execute(id);
    } catch (error) {
      console.error('Error al obtener contrato:', error);
      return null;
    }
  }

  async create(contractData: ContractCreateRequestDto): Promise<ContractResponseDto | null> {
    try {
      return await createContractUseCase.execute(contractData);
    } catch (error) {
      console.error('Error al crear contrato:', error);
      return null;
    }
  }

  async sign(id: string, signData: ContractSignRequestDto): Promise<ContractSignResponseDto | null> {
    try {
      return await signContractUseCase.execute(id, signData);
    } catch (error) {
      console.error('Error al firmar contrato:', error);
      return null;
    }
  }

  async invalidate(id: string, invalidateData: ContractInvalidateRequestDto): Promise<ContractInvalidateResponseDto | null> {
    try {
      return await invalidateContractUseCase.execute(id, invalidateData);
    } catch (error) {
      console.error('Error al invalidar contrato:', error);
      return null;
    }
  }

  async delete(id: string): Promise<ContractDeleteResponseDto | null> {
    try {
      return await deleteContractUseCase.execute(id);
    } catch (error) {
      console.error('Error al eliminar contrato:', error);
      return null;
    }
  }

  async downloadPDF(id: string): Promise<Blob | null> {
    try {
      return await contractService.downloadPDF(id);
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      return null;
    }
  }
}

export const contractController = new ContractController();

