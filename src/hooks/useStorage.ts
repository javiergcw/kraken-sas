/**
 * Hook personalizado para manejar operaciones de Storage/S3
 */

import { useState, useCallback } from 'react';
import { httpService } from '@/utils/http.service';
import { API_ENDPOINTS } from '@/routes/api.config';
import type {
  UploadFileResponseDto,
  GetFoldersResponseDto,
} from '@/components/core/storage/dto';

interface UseStorageReturn {
  uploadFile: (
    folderPath: string,
    file: File
  ) => Promise<UploadFileResponseDto>;
  getFolders: () => Promise<GetFoldersResponseDto>;
  isUploading: boolean;
  isLoadingFolders: boolean;
  uploadError: string | null;
  foldersError: string | null;
}

export function useStorage(): UseStorageReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [foldersError, setFoldersError] = useState<string | null>(null);

  /**
   * Sube un archivo a una carpeta específica
   */
  const uploadFile = useCallback(
    async (
      folderPath: string,
      file: File
    ): Promise<UploadFileResponseDto> => {
      setIsUploading(true);
      setUploadError(null);

      try {
        const formData = new FormData();
        formData.append('folder_path', folderPath);
        formData.append('file', file);

        // Realizar la petición directamente con fetch para manejar FormData
        const token = localStorage.getItem('auth_token');
        const headers: HeadersInit = {
          Accept: 'application/json',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(
          `/api${API_ENDPOINTS.STORAGE.UPLOAD_FILE}`,
          {
            method: 'POST',
            headers,
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              errorData.error ||
              `Error al subir archivo: ${response.statusText}`
          );
        }

        const data = await response.json();
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Error desconocido al subir archivo';
        setUploadError(errorMessage);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  /**
   * Obtiene todas las carpetas y sus archivos
   */
  const getFolders = useCallback(async (): Promise<GetFoldersResponseDto> => {
    setIsLoadingFolders(true);
    setFoldersError(null);

    try {
      const response = await httpService.get<GetFoldersResponseDto>(
        API_ENDPOINTS.STORAGE.GET_FOLDERS
      );
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error desconocido al obtener carpetas';
      setFoldersError(errorMessage);
      throw error;
    } finally {
      setIsLoadingFolders(false);
    }
  }, []);

  return {
    uploadFile,
    getFolders,
    isUploading,
    isLoadingFolders,
    uploadError,
    foldersError,
  };
}


