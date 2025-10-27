'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardMedia,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  ViewList as ViewListIcon,
  GridView as GridViewIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';

interface ImagePickerDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  uploadedImages?: string[];
  onUploadImage?: (imageUrl: string) => void;
}

const ImagePickerDialog: React.FC<ImagePickerDialogProps> = ({ 
  open, 
  onClose, 
  onSelect, 
  uploadedImages = [],
  onUploadImage 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleImageSelect = (imageUrl: string) => {
    onSelect(imageUrl);
    onClose();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        if (onUploadImage) {
          onUploadImage(imageUrl);
          // Mostrar mensaje de éxito
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 3000);
        }
        // NO cerramos el modal ni seleccionamos automáticamente
        // Solo agregamos la imagen a la galería
      };
      reader.readAsDataURL(file);
    }
    // Limpiar el input para permitir subir la misma imagen de nuevo si es necesario
    event.target.value = '';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          maxWidth: '550px',
          minHeight: '500px',
        },
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1.5,
        px: 3,
        pt: 2.5,
        fontWeight: 'bold',
        color: '#424242',
        fontSize: '18px',
      }}>
        Añadir nueva imagen
      </DialogTitle>
      <IconButton
        onClick={onClose}
        size="small"
        sx={{
          position: 'absolute',
          right: 24,
          top: 20,
          color: '#757575',
          '&:hover': {
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        <CloseIcon sx={{ fontSize: 20 }} />
      </IconButton>

      <DialogContent sx={{ px: 3, pb: 3 }}>
        <Box>
          <Typography variant="body2" sx={{ color: '#757575', mb: 2, fontSize: '13px' }}>
            Escoge una imagen de la biblioteca.
          </Typography>

          {/* Barra de búsqueda y botones de vista */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Buscar imagen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#757575', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  fontSize: '13px',
                },
              }}
            />
            <IconButton
              size="small"
              onClick={() => setViewMode('list')}
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                backgroundColor: viewMode === 'list' ? '#f5f5f5' : 'white',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              <ViewListIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setViewMode('grid')}
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                backgroundColor: viewMode === 'grid' ? '#f5f5f5' : 'white',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              <GridViewIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* Área de carga de archivos */}
          <Box
            sx={{
              border: '2px dashed #e0e0e0',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              mb: 3,
              backgroundColor: '#fafafa',
              cursor: 'pointer',
              '&:hover': {
                borderColor: '#bdbdbd',
                backgroundColor: '#f5f5f5',
              },
            }}
            onClick={() => document.getElementById('file-upload-input')?.click()}
          >
            <CloudUploadIcon sx={{ fontSize: 40, color: '#bdbdbd', mb: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: '500', color: '#424242', mb: 0.5, fontSize: '14px' }}>
              Añadir multimedia
            </Typography>
            <Typography variant="body2" sx={{ color: '#757575', fontSize: '12px' }}>
              Arrastrar y soltar archivos aquí
            </Typography>
            <Typography variant="caption" sx={{ color: '#9e9e9e', fontSize: '11px', mt: 0.5, display: 'block' }}>
              Formatos permitidos: jpg, jpeg, png, svg
            </Typography>
            <input
              id="file-upload-input"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/svg+xml"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </Box>

          {/* Grid de imágenes */}
          <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
            {uploadedImages.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" sx={{ color: '#9e9e9e', fontSize: '13px' }}>
                  No hay imágenes. Sube tu primera imagen.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={1.5}>
                {uploadedImages.map((image, index) => (
                  <Grid item xs={viewMode === 'grid' ? 4 : 12} key={index}>
                    <Box sx={{ position: 'relative' }}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: '2px solid transparent',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: '#1976d2',
                            transform: 'scale(1.02)',
                          },
                        }}
                        onClick={() => handleImageSelect(image)}
                      >
                        <CardMedia
                          component="img"
                          image={image}
                          alt={`Imagen ${index + 1}`}
                          sx={{
                            height: viewMode === 'grid' ? 100 : 80,
                            objectFit: 'cover',
                          }}
                        />
                      </Card>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          {/* Nota de ayuda */}
          {uploadedImages.length > 0 && (
            <Typography variant="caption" sx={{ color: '#757575', fontSize: '11px', mt: 2, display: 'block', textAlign: 'center' }}>
              Haz clic en una imagen para seleccionarla
            </Typography>
          )}
        </Box>
      </DialogContent>

      {/* Mensaje de éxito al subir imagen */}
      <Snackbar
        open={uploadSuccess}
        autoHideDuration={3000}
        onClose={() => setUploadSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%', fontSize: '13px' }}>
          ✓ Imagen agregada a la biblioteca. Haz clic para seleccionarla.
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default ImagePickerDialog;

