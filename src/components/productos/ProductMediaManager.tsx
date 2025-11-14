/**
 * Componente para gestionar multimedia de productos usando S3
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  ArrowUpwardOutlined as ArrowUpwardIcon,
  ArrowDownwardOutlined as ArrowDownwardIcon,
  ViewModule as GridIcon,
  ViewList as ListIcon,
} from '@mui/icons-material';
import { useStorage } from '@/hooks/useStorage';
import type { StorageFileInfo, StorageFolderInfo } from '@/components/core/storage/dto';

interface ProductMediaManagerProps {
  currentImage: string;
  onImageSelect: (imageUrl: string) => void;
  onImageRemove: () => void;
}

const ProductMediaManager: React.FC<ProductMediaManagerProps> = ({
  currentImage,
  onImageSelect,
  onImageRemove,
}) => {
  const { uploadFile, getFolders, isUploading, isLoadingFolders, uploadError } = useStorage();
  
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>('productos');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [productImages, setProductImages] = useState<StorageFileInfo[]>([]);
  const [allFolders, setAllFolders] = useState<StorageFolderInfo[]>([]);

  // Cargar carpetas e imágenes
  const loadFoldersAndImages = async () => {
    try {
      const response = await getFolders();
      if (response.success) {
        setAllFolders(response.data);
        const selectedFolderData = response.data.find(folder => folder.name === selectedFolder);
        if (selectedFolderData) {
          setProductImages(selectedFolderData.files);
        } else {
          setProductImages([]);
        }
      }
    } catch (error) {
      console.error('Error al cargar carpetas e imágenes:', error);
    }
  };

  useEffect(() => {
    if (mediaModalOpen) {
      loadFoldersAndImages();
    }
  }, [mediaModalOpen]);

  useEffect(() => {
    if (mediaModalOpen && allFolders.length > 0) {
      const selectedFolderData = allFolders.find(folder => folder.name === selectedFolder);
      if (selectedFolderData) {
        setProductImages(selectedFolderData.files);
      } else {
        setProductImages([]);
      }
    }
  }, [selectedFolder, allFolders, mediaModalOpen]);

  const handleOpenMediaModal = () => {
    setMediaModalOpen(true);
  };

  const handleCloseMediaModal = () => {
    setMediaModalOpen(false);
    setSelectedFolder('productos');
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.match(/^image\/(jpeg|jpg|png|svg\+xml)$/)) {
      console.warn('Solo se permiten imágenes en formato JPG, JPEG, PNG o SVG');
      event.target.value = ''; // Reset input
      return;
    }

    // Validar tamaño (máximo 10MB)
    const maxSizeMB = 10;
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      console.warn(`El archivo es muy grande. Tamaño máximo: ${maxSizeMB}MB`);
      event.target.value = ''; // Reset input
      return;
    }

    // Subir automáticamente al seleccionar
    try {
      const response = await uploadFile(selectedFolder, file);
      if (response.success) {
        // Recargar las imágenes para mostrar la nueva
        await loadFoldersAndImages();
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
    } finally {
      // Reset input para permitir subir el mismo archivo de nuevo
      event.target.value = '';
    }
  };

  const handleImageClick = (imageUrl: string) => {
    onImageSelect(imageUrl);
    handleCloseMediaModal();
  };

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const toggleViewType = () => {
    setViewType(prev => prev === 'grid' ? 'list' : 'grid');
  };

  // Ordenar imágenes
  const sortedImages = productImages.sort((a, b) => {
    const dateA = new Date(a.last_modified).getTime();
    const dateB = new Date(b.last_modified).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

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

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <>
      {/* Preview de la imagen seleccionada */}
      {currentImage ? (
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Box
            component="img"
            src={currentImage}
            alt="Producto"
            sx={{
              width: '100%',
              maxHeight: 300,
              borderRadius: 1,
              objectFit: 'cover',
              border: '1px solid #e0e0e0',
            }}
          />
          <IconButton
            size="small"
            onClick={onImageRemove}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: '#f44336',
              color: 'white',
              '&:hover': {
                backgroundColor: '#d32f2f',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      ) : (
        <Box
          sx={{
            p: 2,
            border: '2px dashed #e0e0e0',
            borderRadius: 2,
            textAlign: 'center',
            backgroundColor: 'white',
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: '#bdbdbd', mb: 1.5 }} />

          <Typography variant="body2" sx={{ color: '#757575', mb: 1.5, fontSize: '12px' }}>
            Acepta imágenes con extensiones jpg, jpeg, png, svg
          </Typography>

          <Button
            variant="contained"
            size="small"
            fullWidth
            onClick={handleOpenMediaModal}
            sx={{
              backgroundColor: '#424242',
              fontSize: '12px',
              py: 0.5,
              textTransform: 'capitalize',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#303030' },
            }}
          >
            Gestionar imágenes
          </Button>
        </Box>
      )}

      {/* Modal de gestión de multimedia */}
      <Dialog
        open={mediaModalOpen}
        onClose={handleCloseMediaModal}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            maxWidth: '700px',
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1,
          px: 3,
          pt: 3,
        }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#424242' }}>
              Gestionar imágenes del producto
            </Typography>
            <Typography variant="body2" sx={{ color: '#757575', mt: 0.5 }}>
              Sube nuevas imágenes o selecciona una existente de la carpeta productos.
            </Typography>
          </Box>
          <IconButton onClick={handleCloseMediaModal} size="small" sx={{ color: '#757575' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pb: 3 }}>
          {/* Área de subida de archivos */}
          <Box
            sx={{
              p: 3,
              border: '2px dashed #e0e0e0',
              borderRadius: 2,
              textAlign: 'center',
              backgroundColor: 'white',
              mb: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 40, color: '#bdbdbd', mb: 1.5 }} />
            
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/svg+xml"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="file-input-product"
              disabled={isUploading}
            />
            <label htmlFor="file-input-product" style={{ width: '100%', maxWidth: '200px' }}>
              <Button
                variant="contained"
                component="span"
                size="small"
                fullWidth
                disabled={isUploading}
                sx={{
                  backgroundColor: '#424242',
                  textTransform: 'capitalize',
                  fontSize: '12px',
                  mb: 1,
                  px: 3,
                  py: 0.75,
                  boxShadow: 'none',
                  '&:hover': { 
                    backgroundColor: '#303030',
                    boxShadow: 'none',
                  },
                  '&:disabled': {
                    backgroundColor: '#9e9e9e',
                  }
                }}
              >
                {isUploading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} sx={{ color: 'white' }} />
                    <span>Subiendo...</span>
                  </Box>
                ) : (
                  'Seleccionar archivo'
                )}
              </Button>
            </label>
            <Typography variant="caption" sx={{ display: 'block', color: '#9e9e9e', fontSize: '11px' }}>
              Formatos permitidos: jpg, jpeg, png, svg (máx. 10MB)
            </Typography>
          </Box>

          {/* Mensajes de error */}
          {uploadError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {uploadError}
            </Alert>
          )}

          {/* Selector de carpetas y controles */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
              <InputLabel 
                id="folder-select-label"
                sx={{
                  fontSize: '14px',
                }}
              >
                Seleccionar carpeta
              </InputLabel>
              <Select
                labelId="folder-select-label"
                id="folder-select"
                value={selectedFolder}
                label="Seleccionar carpeta"
                onChange={(e) => setSelectedFolder(e.target.value)}
                sx={{
                  borderRadius: 1,
                  fontSize: '14px',
                  height: '32px',
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#bdbdbd',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#424242',
                    borderWidth: '1px',
                  },
                  '& .MuiSelect-select': {
                    padding: '6px 14px',
                    fontSize: '14px',
                  },
                }}
              >
                {allFolders.map((folder) => (
                  <MenuItem key={folder.path} value={folder.name} sx={{ fontSize: '14px' }}>
                    {folder.name} ({folder.files.length} {folder.files.length === 1 ? 'archivo' : 'archivos'})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton
              size="small"
              onClick={handleSortToggle}
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                '&:hover': { backgroundColor: '#f5f5f5' },
              }}
            >
              {sortOrder === 'asc' ? 
                <ArrowUpwardIcon sx={{ fontSize: 18 }} /> : 
                <ArrowDownwardIcon sx={{ fontSize: 18 }} />
              }
            </IconButton>
            <IconButton
              size="small"
              onClick={toggleViewType}
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                '&:hover': { backgroundColor: '#f5f5f5' },
              }}
            >
              {viewType === 'grid' ? 
                <GridIcon sx={{ fontSize: 18 }} /> : 
                <ListIcon sx={{ fontSize: 18 }} />
              }
            </IconButton>
          </Box>

          {/* Lista de imágenes */}
          {isLoadingFolders ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : sortedImages.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" sx={{ color: '#757575' }}>
                No hay imágenes en la carpeta {selectedFolder}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                maxHeight: '400px',
                overflowY: 'auto',
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                p: 2,
                '&::-webkit-scrollbar': {
                  width: 8,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#f1f1f1',
                  borderRadius: 4,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#c1c1c1',
                  borderRadius: 4,
                  '&:hover': {
                    backgroundColor: '#a8a8a8',
                  },
                },
              }}
            >
              {viewType === 'grid' ? (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: 1.5,
                  }}
                >
                  {sortedImages.map((image) => (
                    <Box
                      key={image.path}
                      onClick={() => handleImageClick(image.url)}
                      sx={{
                        position: 'relative',
                        paddingTop: '100%',
                        borderRadius: 1,
                        overflow: 'hidden',
                        border: '2px solid',
                        borderColor: currentImage === image.url ? '#1976d2' : '#e0e0e0',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: '#1976d2',
                          transform: 'scale(1.05)',
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={image.url}
                        alt={image.name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {sortedImages.map((image) => (
                    <Box
                      key={image.path}
                      onClick={() => handleImageClick(image.url)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 1.5,
                        border: '1px solid',
                        borderColor: currentImage === image.url ? '#1976d2' : '#e0e0e0',
                        borderRadius: 1,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: '#1976d2',
                          backgroundColor: '#f5f5f5',
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={image.url}
                        alt={image.name}
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 1,
                          objectFit: 'cover',
                        }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 'medium',
                            fontSize: '13px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {image.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#757575', fontSize: '11px' }}>
                          {formatFileSize(image.size)} • {formatDate(image.last_modified)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductMediaManager;


