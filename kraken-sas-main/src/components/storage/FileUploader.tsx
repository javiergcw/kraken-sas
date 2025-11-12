/**
 * Componente de ejemplo para subir archivos a S3
 */

'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useStorage } from '@/hooks/useStorage';

interface FileUploaderProps {
  folderPath: string;
  onUploadSuccess?: (url: string, data: any) => void;
  onUploadError?: (error: string) => void;
  acceptedFileTypes?: string;
  maxSizeMB?: number;
}

export function FileUploader({
  folderPath,
  onUploadSuccess,
  onUploadError,
  acceptedFileTypes = '*',
  maxSizeMB = 10,
}: FileUploaderProps) {
  const { uploadFile, isUploading, uploadError } = useStorage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validar tamaño del archivo
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      alert(`El archivo es muy grande. Tamaño máximo: ${maxSizeMB}MB`);
      return;
    }

    setSelectedFile(file);

    // Crear preview si es imagen
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Por favor selecciona un archivo');
      return;
    }

    try {
      const response = await uploadFile(folderPath, selectedFile);
      
      if (response.success) {
        alert(`¡Archivo subido exitosamente! URL: ${response.data.url}`);
        
        // Llamar al callback si existe
        if (onUploadSuccess) {
          onUploadSuccess(response.data.url, response.data);
        }

        // Limpiar el formulario
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(response.message || 'Error al subir archivo');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      
      if (onUploadError) {
        onUploadError(errorMessage);
      } else {
        alert(`Error: ${errorMessage}`);
      }
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Subir Archivo</h3>
      
      {/* Input de archivo */}
      <div className="mb-4">
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes}
          onChange={handleFileChange}
          disabled={isUploading}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <p className="mt-1 text-xs text-gray-500">
          Tamaño máximo: {maxSizeMB}MB
        </p>
      </div>

      {/* Preview de imagen */}
      {previewUrl && (
        <div className="mb-4">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-full h-auto rounded-lg border border-gray-300"
            style={{ maxHeight: '200px' }}
          />
        </div>
      )}

      {/* Información del archivo seleccionado */}
      {selectedFile && (
        <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
          <p className="text-sm text-gray-700">
            <strong>Archivo:</strong> {selectedFile.name}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Tamaño:</strong>{' '}
            {(selectedFile.size / 1024).toFixed(2)} KB
          </p>
          <p className="text-sm text-gray-700">
            <strong>Tipo:</strong> {selectedFile.type || 'Desconocido'}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Carpeta destino:</strong> {folderPath}
          </p>
        </div>
      )}

      {/* Mensajes de error */}
      {uploadError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-700">{uploadError}</p>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-2">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? 'Subiendo...' : 'Subir Archivo'}
        </button>
        
        <button
          onClick={handleClear}
          disabled={!selectedFile || isUploading}
          className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}


