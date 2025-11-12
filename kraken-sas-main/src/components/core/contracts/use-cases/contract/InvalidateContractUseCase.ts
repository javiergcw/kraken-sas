import { contractService } from '../../services/ContractService';
import { ContractInvalidateRequestDto, ContractInvalidateResponseDto } from '../../dto';

export class InvalidateContractUseCase {
  async execute(id: string, invalidateData: ContractInvalidateRequestDto): Promise<ContractInvalidateResponseDto> {
    try {
      const response = await contractService.invalidate(id, invalidateData);
      return response;
    } catch (error) {
      throw new Error(
        `Error en InvalidateContractUseCase: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const invalidateContractUseCase = new InvalidateContractUseCase();

