/**
 * DTOs para las respuestas de Storage
 */

/**
 * Información de un archivo subido
 */
export interface UploadedFileData {
  filename: string;
  original_name: string;
  path: string;
  unique_code: string;
  url: string;
}

/**
 * Respuesta al subir un archivo
 */
export interface UploadFileResponseDto {
  success: boolean;
  message: string;
  data: UploadedFileData;
}

/**
 * Información de un archivo en el storage
 */
export interface StorageFileInfo {
  name: string;
  path: string;
  size: number;
  last_modified: string;
  url: string;
}

/**
 * Información de una carpeta en el storage
 */
export interface StorageFolderInfo {
  name: string;
  path: string;
  files: StorageFileInfo[];
}

/**
 * Respuesta al obtener carpetas y archivos
 */
export interface GetFoldersResponseDto {
  success: boolean;
  data: StorageFolderInfo[];
}


