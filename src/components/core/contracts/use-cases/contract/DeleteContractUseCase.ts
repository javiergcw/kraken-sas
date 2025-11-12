import { contractService } from '../../services/ContractService';
import { ContractDeleteResponseDto } from '../../dto';

export class DeleteContractUseCase {
  async execute(id: string): Promise<ContractDeleteResponseDto> {
    try {
      const response = await contractService.delete(id);
      return response;
    } catch (error) {
      throw new Error(
        `Error en DeleteContractUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const deleteContractUseCase = new DeleteContractUseCase();

