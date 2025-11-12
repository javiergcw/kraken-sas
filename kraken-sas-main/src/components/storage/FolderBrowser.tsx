/**
 * Componente para explorar carpetas y archivos del storage
 */

'use client';

import { useState, useEffect } from 'react';
import { useStorage } from '@/hooks/useStorage';
import type { StorageFolderInfo } from '@/components/core/storage/dto';

interface FolderBrowserProps {
  onFileSelect?: (fileUrl: string, fileName: string) => void;
  refreshTrigger?: number;
}

export function FolderBrowser({
  onFileSelect,
  refreshTrigger = 0,
}: FolderBrowserProps) {
  const { getFolders, isLoadingFolders, foldersError } = useStorage();
  const [folders, setFolders] = useState<StorageFolderInfo[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );

  const loadFolders = async () => {
    try {
      const response = await getFolders();
      if (response.success) {
        setFolders(response.data);
      }
    } catch (error) {
      console.error('Error al cargar carpetas:', error);
    }
  };

  useEffect(() => {
    loadFolders();
  }, [refreshTrigger]);

  const toggleFolder = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleFileClick = (url: string, name: string) => {
    if (onFileSelect) {
      onFileSelect(url, name);
    } else {
      window.open(url, '_blank');
    }
  };

  if (isLoadingFolders) {
    return (
      <div className="w-full p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando carpetas...</span>
        </div>
      </div>
    );
  }

  if (foldersError) {
    return (
      <div className="w-full p-6 bg-white rounded-lg shadow-md">
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700">{foldersError}</p>
        </div>
        <button
          onClick={loadFolders}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Explorador de Archivos</h3>
        <button
          onClick={loadFolders}
          disabled={isLoadingFolders}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
        >
          🔄 Actualizar
        </button>
      </div>

      {folders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay carpetas disponibles
        </div>
      ) : (
        <div className="space-y-2">
          {folders.map((folder) => (
            <div key={folder.path} className="border rounded-lg overflow-hidden">
              {/* Encabezado de la carpeta */}
              <button
                onClick={() => toggleFolder(folder.path)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">📁</span>
                  <span className="font-medium">{folder.name}</span>
                  <span className="text-sm text-gray-500">
                    ({folder.files.length}{' '}
                    {folder.files.length === 1 ? 'archivo' : 'archivos'})
                  </span>
                </div>
                <span className="text-gray-400">
                  {expandedFolders.has(folder.path) ? '▼' : '▶'}
                </span>
              </button>

              {/* Lista de archivos */}
              {expandedFolders.has(folder.path) && (
                <div className="bg-white">
                  {folder.files.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      Carpeta vacía
                    </div>
                  ) : (
                    <div className="divide-y">
                      {folder.files.map((file) => (
                        <div
                          key={file.path}
                          className="p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => handleFileClick(file.url, file.name)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">
                                  {file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                                    ? '🖼️'
                                    : file.name.match(/\.(svg)$/i)
                                    ? '🎨'
                                    : file.name.match(/\.(mp4|mov|avi)$/i)
                                    ? '🎬'
                                    : file.name.match(/\.(pdf)$/i)
                                    ? '📄'
                                    : '📎'}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {file.name}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                    <span>{formatFileSize(file.size)}</span>
                                    <span>•</span>
                                    <span>{formatDate(file.last_modified)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(file.url);
                                alert('URL copiada al portapapeles');
                              }}
                              className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            >
                              Copiar URL
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


