/**
 * Controlador para manejar las operaciones de Storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { uploadFileUseCase, getFoldersUseCase } from '../use-cases';

export class StorageController {
  /**
   * Sube un archivo al storage
   */
  async uploadFile(request: NextRequest): Promise<NextResponse> {
    try {
      const formData = await request.formData();
      const folderPath = formData.get('folder_path') as string;
      const file = formData.get('file') as File;

      if (!folderPath) {
        return NextResponse.json(
          {
            success: false,
            message: 'El path de la carpeta es requerido',
          },
          { status: 400 }
        );
      }

      if (!file) {
        return NextResponse.json(
          {
            success: false,
            message: 'El archivo es requerido',
          },
          { status: 400 }
        );
      }

      const response = await uploadFileUseCase.execute(folderPath, file);

      return NextResponse.json(response, { status: 201 });
    } catch (error) {
      console.error('Error en uploadFile:', error);
      return NextResponse.json(
        {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : 'Error al subir el archivo',
        },
        { status: 500 }
      );
    }
  }

  /**
   * Obtiene todas las carpetas y archivos
   */
  async getFolders(request: NextRequest): Promise<NextResponse> {
    try {
      const response = await getFoldersUseCase.execute();

      return NextResponse.json(response, { status: 200 });
    } catch (error) {
      console.error('Error en getFolders:', error);
      return NextResponse.json(
        {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : 'Error al obtener las carpetas',
        },
        { status: 500 }
      );
    }
  }
}

export const storageController = new StorageController();


