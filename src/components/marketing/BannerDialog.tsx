'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Close as CloseIcon,
  AddPhotoAlternateOutlined as AddPhotoIcon,
} from '@mui/icons-material';
import ImagePickerDialog from '../common/ImagePickerDialog';

interface BannerDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: BannerFormData) => void;
  zonas: { id: string; nombre: string }[];
  initialData?: BannerFormData;
  isEditing?: boolean;
}

export interface BannerFormData {
  titulo: string;
  redireccion: string;
  zonaId: string;
  estado: 'Activo' | 'Inactivo';
  urlWeb: string;
}

const BannerDialog: React.FC<BannerDialogProps> = ({ open, onClose, onSave, zonas, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState<BannerFormData>({
    titulo: '',
    redireccion: '',
    zonaId: '',
    estado: 'Activo',
    urlWeb: '',
  });

  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<'urlWeb' | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Llenar el formulario con datos iniciales cuando se está editando
  useEffect(() => {
    if (open && initialData) {
      setFormData(initialData);
    } else if (open && !initialData) {
      // Reset form cuando es nuevo
      setFormData({
        titulo: '',
        redireccion: '',
        zonaId: '',
        estado: 'Activo',
        urlWeb: '',
      });
    }
  }, [open, initialData]);

  // Detectar si hay cambios en el formulario
  const hasChanges = () => {
    if (!isEditing || !initialData) return true; // Si es nuevo, siempre habilitado
    
    return (
      formData.titulo !== initialData.titulo ||
      formData.redireccion !== initialData.redireccion ||
      formData.estado !== initialData.estado ||
      formData.urlWeb !== initialData.urlWeb ||
      formData.zonaId !== initialData.zonaId
    );
  };

  const handleChange = (field: keyof BannerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      titulo: '',
      redireccion: '',
      zonaId: '',
      estado: 'Activo',
      urlWeb: '',
    });
    onClose();
  };

  const handleImageUpload = (field: 'urlWeb') => {
    setCurrentImageField(field);
    setImagePickerOpen(true);
  };

  const handleImageSelect = (imageUrl: string) => {
    if (currentImageField) {
      handleChange(currentImageField, imageUrl);
    }
    setImagePickerOpen(false);
    setCurrentImageField(null);
  };

  const handleUploadImage = (imageUrl: string) => {
    setUploadedImages(prev => [...prev, imageUrl]);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        pb: 2,
        px: 3,
        pt: 2.5,
        fontWeight: 'bold',
        color: '#424242',
        fontSize: '18px',
      }}>
        {isEditing ? 'Editar Banner' : 'Crear Nuevo Banner'}
      </DialogTitle>
      <IconButton
        onClick={handleClose}
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

      <DialogContent sx={{ px: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Título y Redirección */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Título"
              placeholder="Título"
              value={formData.titulo}
              onChange={(e) => handleChange('titulo', e.target.value)}
              size="small"
              sx={{
                '& .MuiInputLabel-root': { fontSize: '14px' },
                '& .MuiInputBase-input': { fontSize: '14px' },
              }}
            />
            <TextField
              fullWidth
              label="Redirección"
              placeholder="Redirección"
              value={formData.redireccion}
              onChange={(e) => handleChange('redireccion', e.target.value)}
              size="small"
              sx={{
                '& .MuiInputLabel-root': { fontSize: '14px' },
                '& .MuiInputBase-input': { fontSize: '14px' },
              }}
            />
          </Box>

          {/* Zona */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: '14px' }}>Zona</InputLabel>
            <Select
              value={formData.zonaId}
              onChange={(e) => handleChange('zonaId', e.target.value)}
              label="Zona"
              disabled={isEditing}
              sx={{
                fontSize: '14px',
                backgroundColor: isEditing ? '#f5f5f5' : 'transparent',
              }}
            >
              <MenuItem value="" sx={{ fontSize: '14px' }}>
                <em>Seleccione una zona</em>
              </MenuItem>
              {zonas.map((zona) => (
                <MenuItem key={zona.id} value={zona.id} sx={{ fontSize: '14px' }}>
                  {zona.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Estado */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: '14px' }}>Estado</InputLabel>
            <Select
              value={formData.estado}
              onChange={(e) => handleChange('estado', e.target.value as 'Activo' | 'Inactivo')}
              label="Estado"
              sx={{
                fontSize: '14px',
              }}
            >
              <MenuItem value="Activo" sx={{ fontSize: '14px' }}>Activo</MenuItem>
              <MenuItem value="Inactivo" sx={{ fontSize: '14px' }}>Inactivo</MenuItem>
            </Select>
          </FormControl>

          {/* URL Web */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontSize: '13px', color: '#757575', fontWeight: '500' }}>
              URL Web
            </Typography>
            {formData.urlWeb ? (
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Box
                  component="img"
                  src={formData.urlWeb}
                  alt="Preview Web"
                  onClick={() => handleImageUpload('urlWeb')}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 1,
                    border: '2px solid #e0e0e0',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: '#1976d2',
                      transform: 'scale(1.02)',
                    },
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleChange('urlWeb', '')}
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    backgroundColor: '#f44336',
                    color: 'white',
                    width: 20,
                    height: 20,
                    '&:hover': {
                      backgroundColor: '#d32f2f',
                    },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            ) : (
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddPhotoIcon />}
                onClick={() => handleImageUpload('urlWeb')}
                sx={{
                  borderColor: '#e0e0e0',
                  color: '#757575',
                  textTransform: 'none',
                  fontSize: '13px',
                  justifyContent: 'flex-start',
                  py: 1.5,
                  borderStyle: 'dashed',
                  '&:hover': {
                    borderColor: '#bdbdbd',
                    backgroundColor: '#fafafa',
                  },
                }}
              >
                Añadir imagen
              </Button>
            )}
          </Box>

        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            borderColor: '#e0e0e0',
            color: '#424242',
            textTransform: 'none',
            boxShadow: 'none',
            fontSize: '14px',
            px: 3,
            py: 0.75,
            '&:hover': {
              borderColor: '#bdbdbd',
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isEditing && !hasChanges()}
          sx={{
            backgroundColor: hasChanges() ? '#1a1a1a' : '#bdbdbd',
            color: 'white',
            textTransform: 'none',
            boxShadow: 'none',
            fontSize: '14px',
            px: 3,
            py: 0.75,
            '&:hover': {
              backgroundColor: hasChanges() ? '#000' : '#bdbdbd',
              boxShadow: 'none',
            },
            '&.Mui-disabled': {
              backgroundColor: '#bdbdbd',
              color: 'white',
            },
          }}
        >
          {isEditing ? 'Guardar' : 'Crear'}
        </Button>
      </DialogActions>

      {/* Dialog de selección de imágenes */}
      <ImagePickerDialog
        open={imagePickerOpen}
        onClose={() => {
          setImagePickerOpen(false);
          setCurrentImageField(null);
        }}
        onSelect={handleImageSelect}
        uploadedImages={uploadedImages}
        onUploadImage={handleUploadImage}
      />
    </Dialog>
  );
};

export default BannerDialog;

