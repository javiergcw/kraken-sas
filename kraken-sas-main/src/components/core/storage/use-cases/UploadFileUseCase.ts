/**
 * Use Case para subir un archivo a S3
 */

import { storageService } from '../services';
import { UploadFileResponseDto } from '../dto';

export class UploadFileUseCase {
  async execute(
    folderPath: string,
    file: File
  ): Promise<UploadFileResponseDto> {
    if (!folderPath || !folderPath.trim()) {
      throw new Error('El path de la carpeta es requerido');
    }

    if (!file) {
      throw new Error('El archivo es requerido');
    }

    return await storageService.uploadFile(folderPath, file);
  }
}

export const uploadFileUseCase = new UploadFileUseCase();


