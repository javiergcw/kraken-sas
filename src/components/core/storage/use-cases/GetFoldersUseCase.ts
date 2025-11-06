/**
 * Use Case para obtener todas las carpetas y archivos del storage
 */

import { storageService } from '../services';
import { GetFoldersResponseDto } from '../dto';

export class GetFoldersUseCase {
  async execute(): Promise<GetFoldersResponseDto> {
    return await storageService.getFolders();
  }
}

export const getFoldersUseCase = new GetFoldersUseCase();


