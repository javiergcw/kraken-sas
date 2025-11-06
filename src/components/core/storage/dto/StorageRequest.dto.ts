/**
 * DTOs para las peticiones de Storage
 */

/**
 * DTO para subir un archivo
 */
export interface UploadFileRequestDto {
  folder_path: string;
  file: File;
}


