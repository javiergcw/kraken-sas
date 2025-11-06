/**
 * Servicio para realizar operaciones de Storage/S3
 */

import { tokenService } from '@/utils/token.service';
import { EXTERNAL_ROUTES } from '@/routes/api.config';
import {
  UploadFileResponseDto,
  GetFoldersResponseDto,
} from '../dto';

export class StorageService {
  /**
   * Sube un archivo a una carpeta específica
   */
  async uploadFile(
    folderPath: string,
    file: File
  ): Promise<UploadFileResponseDto> {
    try {
      const formData = new FormData();
      formData.append('folder_path', folderPath);
      formData.append('file', file);

      const token = tokenService.getToken();
      const headers: HeadersInit = {
        'Accept': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(EXTERNAL_ROUTES.STORAGE.UPLOAD_FILE, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error al subir archivo: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al subir archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  /**
   * Obtiene todas las carpetas y sus archivos
   */
  async getFolders(): Promise<GetFoldersResponseDto> {
    try {
      const token = tokenService.getToken();
      const headers: HeadersInit = {
        'Accept': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(EXTERNAL_ROUTES.STORAGE.GET_FOLDERS, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Error al obtener carpetas: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        `Error al obtener carpetas: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

export const storageService = new StorageService();


