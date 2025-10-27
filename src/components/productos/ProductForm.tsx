'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Paper,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  ViewModule as GridIcon,
  Sort as SortIcon,
  ViewList as ListIcon,
  KeyboardArrowDown as ArrowDownIcon,
  ArrowDownwardOutlined as ArrowDownwardIcon,
  ArrowUpwardOutlined as ArrowUpwardIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface ProductFormData {
  name: string;
  sku: string;
  description: string;
  category: string;
  subcategory: string;
  price: string;
  hasStock: boolean;
  quantity: number;
}

interface Characteristic {
  id: string;
  type: 'parent' | 'child';
  parentId?: string;
  select: string;
  name: string;
  value?: string;
  order: number;
}

interface ProductFormProps {
  mode: 'create' | 'edit';
  initialData?: ProductFormData;
  initialImages?: string[];
  initialCharacteristics?: Characteristic[];
  onSubmit?: (data: ProductFormData) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  mode, 
  initialData, 
  initialImages = [],
  initialCharacteristics = [],
  onSubmit 
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>(initialData || {
    name: '',
    sku: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    hasStock: false,
    quantity: 0,
  });

  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaModalTitle, setMediaModalTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMenuAnchor, setViewMenuAnchor] = useState<null | HTMLElement>(null);
  const [viewType, setViewType] = useState('grid');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedImages, setSelectedImages] = useState<string[]>(initialImages);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [characteristics, setCharacteristics] = useState<Characteristic[]>(initialCharacteristics);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [characteristicToDelete, setCharacteristicToDelete] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  
  // Estado inicial para comparar cambios
  const [initialFormState, setInitialFormState] = useState<{
    formData: ProductFormData;
    images: string[];
    characteristics: Characteristic[];
  }>({
    formData: initialData || {
      name: '',
      sku: '',
      description: '',
      category: '',
      subcategory: '',
      price: '',
      hasStock: false,
      quantity: 0,
    },
    images: initialImages,
    characteristics: initialCharacteristics,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (initialImages.length > 0) {
      setSelectedImages(initialImages);
    }
  }, [initialImages]);

  useEffect(() => {
    if (initialCharacteristics.length > 0) {
      setCharacteristics(initialCharacteristics);
    }
  }, [initialCharacteristics]);

  // Detectar cambios en el formulario
  useEffect(() => {
    if (mode === 'edit') {
      const formDataChanged = JSON.stringify(formData) !== JSON.stringify(initialFormState.formData);
      const imagesChanged = JSON.stringify(selectedImages) !== JSON.stringify(initialFormState.images);
      const characteristicsChanged = JSON.stringify(characteristics) !== JSON.stringify(initialFormState.characteristics);
      
      const hasChanges = formDataChanged || imagesChanged || characteristicsChanged;
      setHasUnsavedChanges(hasChanges);
      setShowSaveNotification(hasChanges);
    }
  }, [formData, selectedImages, characteristics, mode, initialFormState]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBack = () => {
    router.push('/dashboard/productos');
  };

  const handleOpenMediaModal = (title: string) => {
    setMediaModalTitle(title);
    setMediaModalOpen(true);
  };

  const handleCloseMediaModal = () => {
    setMediaModalOpen(false);
    setSearchTerm('');
  };

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/jpg,image/png,image/svg+xml';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        const newImages: string[] = [];
        Array.from(files).forEach((file) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              newImages.push(event.target.result as string);
              if (newImages.length === files.length) {
                setUploadedImages(prev => [...prev, ...newImages]);
              }
            }
          };
          reader.readAsDataURL(file);
        });
      }
    };
    input.click();
  };

  const handleViewMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setViewMenuAnchor(event.currentTarget);
  };

  const handleViewMenuClose = () => {
    setViewMenuAnchor(null);
  };

  const handleViewTypeChange = (type: string) => {
    setViewType(type);
    handleViewMenuClose();
  };

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleImageSelect = (imageUrl: string) => {
    // No hacer nada con click simple
  };

  const handleImageDoubleClick = (imageUrl: string) => {
    setSelectedImages([imageUrl]); // Solo una imagen permitida
    handleCloseMediaModal(); // Cerrar el modal automáticamente
  };

  const addParentCharacteristic = () => {
    const parentCount = characteristics.filter(char => char.type === 'parent').length;
    const newParent: Characteristic = {
      id: `parent_${Date.now()}`,
      type: 'parent',
      select: '',
      name: '',
      order: parentCount + 1,
    };
    setCharacteristics(prev => [...prev, newParent]);
  };

  const addChildCharacteristic = (parentId: string) => {
    const newChild: Characteristic = {
      id: `child_${Date.now()}`,
      type: 'child',
      parentId,
      select: '',
      name: '',
      value: '',
      order: 0,
    };
    
    const parentIndex = characteristics.findIndex(char => char.id === parentId);
    setCharacteristics(prev => {
      const newCharacteristics = [...prev];
      newCharacteristics.splice(parentIndex + 1, 0, newChild);
      return newCharacteristics;
    });
  };

  const updateCharacteristic = (id: string, field: string, value: any) => {
    setCharacteristics(prev => 
      prev.map(char => 
        char.id === id ? { ...char, [field]: value } : char
      )
    );
  };

  const deleteCharacteristic = (id: string) => {
    setCharacteristicToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (characteristicToDelete) {
      const charToDelete = characteristics.find(char => char.id === characteristicToDelete);
      const isParent = charToDelete?.type === 'parent';
      
      setCharacteristics(prev => {
        if (isParent) {
          return prev.filter(char => char.id !== characteristicToDelete && char.parentId !== characteristicToDelete);
        } else {
          return prev.filter(char => char.id !== characteristicToDelete);
        }
      });
    }
    setDeleteModalOpen(false);
    setCharacteristicToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setCharacteristicToDelete(null);
  };

  const handleSaveChanges = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
    // Actualizar el estado inicial después de guardar
    setInitialFormState({
      formData: formData,
      images: selectedImages,
      characteristics: characteristics,
    });
    setHasUnsavedChanges(false);
    setShowSaveNotification(false);
    
    // Redirigir a la lista de productos después de guardar
    router.push('/dashboard/productos');
  };

  const handleDiscardChanges = () => {
    // Restaurar valores iniciales
    setFormData(initialFormState.formData);
    setSelectedImages(initialFormState.images);
    setCharacteristics(initialFormState.characteristics);
    setHasUnsavedChanges(false);
    setShowSaveNotification(false);
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 2, backgroundColor: 'white', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <IconButton 
            sx={{ mr: 1, color: '#757575', p: { xs: 0.5, sm: 1 } }}
            onClick={handleBack}
          >
            <ArrowBackIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1.5 }}>
        {/* Left Column - Form Fields */}
        <Box sx={{ flex: { xs: '1', md: '0.6' }, order: { xs: 1, md: 1 } }}>
          <Box sx={{ p: { xs: 1.5, sm: 2 }, border: '1px solid #e0e0e0', borderRadius: 1, mb: 1, backgroundColor: 'white' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#424242', mb: 1, fontSize: { xs: '14px', sm: '16px' } }}>
              Datos del producto
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Nombre */}
              <Box>
                <Typography variant="caption" sx={{ color: '#424242', mb: 0.25, fontWeight: 'medium' }}>
                  Nombre
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Ingresa el nombre del producto"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 32,
                      fontSize: '12px',
                    },
                  }}
                />
              </Box>

              {/* SKU */}
              <Box>
                <Typography variant="caption" sx={{ color: '#424242', mb: 0.25, fontWeight: 'medium' }}>
                  SKU
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Ingrese un SKU para el producto"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 32,
                      fontSize: '12px',
                    },
                  }}
                />
              </Box>

              {/* Descripción */}
              <Box>
                <Typography variant="caption" sx={{ color: '#424242', mb: 0.25, fontWeight: 'medium' }}>
                  Descripción
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Ingrese una descripción para el producto"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '12px',
                    },
                  }}
                />
              </Box>

              {/* Categoría y Subcategoría */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: '#424242', mb: 0.25, fontWeight: 'medium' }}>
                    Categoría
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      displayEmpty
                      sx={{
                        height: 32,
                        fontSize: '12px',
                        '& .MuiSelect-select': {
                          padding: '6px 12px',
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Selecciona una categoría
                      </MenuItem>
                      <MenuItem value="aventuras">Aventuras</MenuItem>
                      <MenuItem value="otros-servicios">Otros servicios</MenuItem>
                      <MenuItem value="formacion">Formación</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: '#424242', mb: 0.25, fontWeight: 'medium' }}>
                    Subcategoría
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={formData.subcategory}
                      onChange={(e) => handleInputChange('subcategory', e.target.value)}
                      displayEmpty
                      sx={{
                        height: 32,
                        fontSize: '12px',
                        '& .MuiSelect-select': {
                          padding: '6px 12px',
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Selecciona una subcategoría
                      </MenuItem>
                      <MenuItem value="principales">Principales</MenuItem>
                      <MenuItem value="formacion-padi">¡Formación PADI a otro nivel!</MenuItem>
                      <MenuItem value="ya-eres-buzo">¿Ya eres buzo?</MenuItem>
                      <MenuItem value="somos-oceano">#SomosOceano</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Precio */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                <Box sx={{ flex: { xs: 1, sm: 0.2 } }}>
                  <Typography variant="caption" sx={{ color: '#424242', mb: 0.25, fontWeight: 'medium' }}>
                    Tipo de moneda
                  </Typography>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 1,
                      border: '1px solid #e0e0e0',
                      minHeight: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#757575', fontWeight: 'medium' }}>
                      COP
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ flex: { xs: 1, sm: 0.8 } }}>
                  <Typography variant="caption" sx={{ color: '#424242', mb: 0.25, fontWeight: 'medium' }}>
                    Precio unitario
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Ingresa el precio del producto"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    size="small"
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1, fontSize: '12px' }}>$</Typography>,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: 32,
                        fontSize: '12px',
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Stock */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ height: 32, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Checkbox
                      checked={formData.hasStock}
                      onChange={(e) => handleInputChange('hasStock', e.target.checked)}
                      size="small"
                      sx={{
                        color: '#424242',
                        '&.Mui-checked': {
                          color: '#424242',
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ color: '#424242', fontWeight: 'medium' }}>
                      Tiene stock
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: '#424242', mb: 0.25, fontWeight: 'medium' }}>
                    Cantidad
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                    size="small"
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        height: 32,
                        fontSize: '12px',
                      },
                    }}
                    inputProps={{ min: 0 }}
                    disabled={!formData.hasStock}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Características Section */}
          <Box sx={{ p: { xs: 1.5, sm: 2 }, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: 'white' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#424242', mb: 1.5, fontSize: { xs: '14px', sm: '16px' } }}>
              Características
            </Typography>

            {/* Characteristics List */}
            {characteristics.map((char) => (
              <Box key={char.id} sx={{ 
                mb: 1, 
                p: 1, 
                border: '1px solid #e0e0e0', 
                borderRadius: 1, 
                backgroundColor: char.type === 'parent' ? '#fafafa' : '#f0f0f0',
                ml: char.type === 'child' ? 2 : 0,
                borderLeft: char.type === 'child' ? '3px solid #1976d2' : '1px solid #e0e0e0',
              }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Select Dropdown */}
                  <Box sx={{ flex: 1, minWidth: '100px' }}>
                    <FormControl fullWidth size="small">
                      <Select
                        value={char.select}
                        onChange={(e) => updateCharacteristic(char.id, 'select', e.target.value)}
                        displayEmpty
                        sx={{
                          height: 32,
                          fontSize: '12px',
                          '& .MuiSelect-select': {
                            padding: '6px 12px',
                          },
                        }}
                      >
                        <MenuItem value="" disabled>
                          Seleccionar
                        </MenuItem>
                        <MenuItem value="talla">Talla</MenuItem>
                        <MenuItem value="color">Color</MenuItem>
                        <MenuItem value="material">Material</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Name Input */}
                  <Box sx={{ flex: 1, minWidth: '100px' }}>
                    <TextField
                      fullWidth
                      placeholder="Nombre"
                      value={char.name}
                      onChange={(e) => updateCharacteristic(char.id, 'name', e.target.value)}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: 32,
                          fontSize: '12px',
                        },
                      }}
                    />
                  </Box>

                  {/* Value Input (only for children) */}
                  {char.type === 'child' && (
                    <Box sx={{ flex: 1, minWidth: '100px' }}>
                      <TextField
                        fullWidth
                        placeholder="Valor"
                        value={char.value || ''}
                        onChange={(e) => updateCharacteristic(char.id, 'value', e.target.value)}
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: 32,
                            fontSize: '12px',
                          },
                        }}
                      />
                    </Box>
                  )}

                  {/* Order Display */}
                  <Box sx={{ flex: 0.2, minWidth: '40px' }}>
                    <Box
                      sx={{
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                        border: '1px solid #e0e0e0',
                        fontSize: '12px',
                        fontWeight: 'medium',
                        color: '#757575',
                      }}
                    >
                      {char.type === 'parent' ? char.order : '-'}
                    </Box>
                  </Box>

                  {/* Add Child Button (only for parents) */}
                  {char.type === 'parent' && (
                    <IconButton
                      size="small"
                      onClick={() => addChildCharacteristic(char.id)}
                      sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        backgroundColor: 'white',
                        width: 32,
                        height: 32,
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                        },
                      }}
                    >
                      <AddIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  )}

                  {/* Delete Button */}
                  <IconButton
                    size="small"
                    onClick={() => deleteCharacteristic(char.id)}
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      backgroundColor: '#f44336',
                      color: 'white',
                      width: 32,
                      height: 32,
                      '&:hover': {
                        backgroundColor: '#d32f2f',
                      },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              </Box>
            ))}

            {/* Add Button at Bottom */}
            <Box sx={{ mt: 1.5 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                size="small"
                onClick={addParentCharacteristic}
                sx={{
                  borderColor: '#e0e0e0',
                  color: '#424242',
                  fontSize: '14px',
                  textTransform: 'capitalize',
                  boxShadow: 'none',
                }}
              >
                Agregar
              </Button>
            </Box>
          </Box>

          {/* Footer Note - Solo en modo create */}
          {mode === 'create' && (
            <Box sx={{ mt: 1, p: 1, backgroundColor: 'white', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ color: '#757575', fontSize: '12px' }}>
                * Las variaciones del producto se pueden agregar después de crear el producto. Una vez que el producto esté guardado, podrás gestionar sus variaciones desde la página de edición.
              </Typography>
            </Box>
          )}
        </Box>

        {/* Right Column - Multimedia */}
        <Box sx={{ flex: { xs: '1', md: '0.4' }, order: { xs: 2, md: 2 } }}>
          <Box sx={{ backgroundColor: 'white', borderRadius: 1, p: { xs: 1.5, sm: 2 }, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#424242', mb: 2, fontSize: { xs: '14px', sm: '16px' } }}>
              Multimedia
            </Typography>
            
            {/* Selected Images Gallery */}
            {selectedImages.length > 0 ? (
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                overflowX: 'auto',
                pb: 1,
                '&::-webkit-scrollbar': {
                  height: 6,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#f1f1f1',
                  borderRadius: 3,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#c1c1c1',
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: '#a8a8a8',
                  },
                },
              }}>
                {selectedImages.map((imageUrl, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'relative',
                      minWidth: 80,
                      height: 80,
                      borderRadius: 1,
                      overflow: 'hidden',
                      border: '1px solid #e0e0e0',
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={`Imagen ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedImages(prev => prev.filter((_, i) => i !== index));
                      }}
                      sx={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        backgroundColor: '#f44336',
                        color: 'white',
                        width: 20,
                        height: 20,
                        '&:hover': {
                          backgroundColor: '#d32f2f',
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: 12,
                        }
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ))}
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

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    onClick={() => handleOpenMediaModal('Añade nueva imagen')}
                    sx={{
                      backgroundColor: '#424242',
                      fontSize: '12px',
                      py: 0.5,
                      textTransform: 'capitalize',
                      boxShadow: 'none',
                      '&:hover': { backgroundColor: '#303030' },
                    }}
                  >
                    Agregar nueva imagen
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => handleOpenMediaModal('Seleccionar imagen existente')}
                    sx={{
                      borderColor: '#e0e0e0',
                      color: '#424242',
                      fontSize: '12px',
                      py: 0.5,
                      textTransform: 'capitalize',
                      boxShadow: 'none',
                      '&:hover': { borderColor: '#bdbdbd' },
                    }}
                  >
                    Seleccionar existente
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>


      {/* Media Modal */}
      <Dialog
        open={mediaModalOpen}
        onClose={handleCloseMediaModal}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            maxWidth: '600px',
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
              {mediaModalTitle}
            </Typography>
            <Typography variant="body2" sx={{ color: '#757575', mt: 0.5 }}>
              Escoge una imagen de la biblioteca.
            </Typography>
          </Box>
          <IconButton onClick={handleCloseMediaModal} size="small" sx={{ color: '#757575' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pb: 2 }}>
          {/* Search Bar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
             <TextField
               fullWidth
               placeholder="Buscar imagen..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               size="small"
               sx={{
                 '& .MuiOutlinedInput-root': {
                   borderRadius: 1,
                   fontSize: '14px',
                   height: '28px',
                 },
               }}
             />
            <Button
              variant="outlined"
              size="small"
              onClick={handleSortToggle}
              sx={{
                borderColor: '#e0e0e0',
                color: '#424242',
                fontSize: '12px',
                px: 1.5,
                py: 0.5,
                textTransform: 'capitalize',
                minWidth: 'auto',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  borderColor: '#bdbdbd',
                }
              }}
            >
              {sortOrder === 'asc' ? 
                <ArrowUpwardIcon sx={{ fontSize: 16 }} /> : 
                <ArrowDownwardIcon sx={{ fontSize: 16 }} />
              }
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleViewMenuOpen}
              sx={{
                borderColor: '#e0e0e0',
                color: '#424242',
                fontSize: '12px',
                px: 1.5,
                py: 0.5,
                textTransform: 'capitalize',
                minWidth: 'auto',
                boxShadow: 'none',
              }}
            >
              {viewType === 'grid' ? <GridIcon sx={{ fontSize: 16 }} /> : <ListIcon sx={{ fontSize: 16 }} />}
            </Button>
          </Box>

          {/* Upload Area */}
          <Box
            sx={{
              p: 3,
              border: '2px dashed #e0e0e0',
              borderRadius: 2,
              textAlign: 'center',
              backgroundColor: 'white',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              '&:hover': {
                borderColor: '#bdbdbd',
                backgroundColor: '#fafafa',
              },
            }}
            onClick={handleFileSelect}
          >
            <CloudUploadIcon sx={{ fontSize: 40, color: '#bdbdbd', mb: 1 }} />
            
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: '#424242',
                textTransform: 'capitalize',
                fontSize: '12px',
                mb: 1,
                px: 2,
                py: 0.5,
                boxShadow: 'none',
                '&:hover': { 
                  backgroundColor: '#303030',
                  boxShadow: 'none',
                },
              }}
            >
              Añadir multimedia
            </Button>
            
            <Typography variant="body2" sx={{ color: '#757575', fontSize: '12px' }}>
              Arrastrar y soltar archivos aquí
            </Typography>
            
            <Typography variant="caption" sx={{ color: '#9e9e9e', fontSize: '11px' }}>
              Formatos permitidos: jpg, jpeg, png, svg
            </Typography>
          </Box>

          {/* Horizontal Box */}
          <Box sx={{ mt: 2 }}>
            <Box
              sx={{
                width: '100%',
                maxHeight: '200px',
                border: '1px solid #e0e0e0',
                borderRadius: '20px',
                backgroundColor: 'white',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                px: 2,
                py: 1,
                gap: 1,
                overflowY: 'auto',
                '&:hover': {
                  borderColor: '#bdbdbd',
                },
                '&::-webkit-scrollbar': {
                  width: 6,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#f1f1f1',
                  borderRadius: 3,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#c1c1c1',
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: '#a8a8a8',
                  },
                },
              }}
            >
              {/* Selected Images Grid - 4 per row */}
              {uploadedImages.length > 0 && (
                uploadedImages.map((imageUrl, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 'calc(25% - 8px)',
                      height: '80px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid #e0e0e0',
                      flexShrink: 0,
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: '#1976d2',
                        transform: 'scale(1.05)',
                      },
                    }}
                    onClick={() => handleImageSelect(imageUrl)}
                    onDoubleClick={() => handleImageDoubleClick(imageUrl)}
                  >
                    <img
                      src={imageUrl}
                      alt={`Imagen ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </DialogContent>

        {/* View Type Menu */}
        <Menu
          anchorEl={viewMenuAnchor}
          open={Boolean(viewMenuAnchor)}
          onClose={handleViewMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={() => handleViewTypeChange('grid')} sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <GridIcon sx={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText 
              primary="Cuadrícula" 
              sx={{ 
                '& .MuiListItemText-primary': { 
                  fontSize: '14px',
                  fontWeight: viewType === 'grid' ? 'medium' : 'normal'
                } 
              }} 
            />
          </MenuItem>
          <MenuItem onClick={() => handleViewTypeChange('list')} sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <ListIcon sx={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText 
              primary="Lista" 
              sx={{ 
                '& .MuiListItemText-primary': { 
                  fontSize: '14px',
                  fontWeight: viewType === 'list' ? 'medium' : 'normal'
                } 
              }} 
            />
          </MenuItem>
        </Menu>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={cancelDelete}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            maxWidth: '400px',
            padding: '8px',
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 0,
          px: 1.5,
          pt: 1.5,
        }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#424242' }}>
            ¿Estás seguro?
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: 1.5, pb: 0.5 }}>
          <Typography variant="body2" sx={{ color: '#424242', mb: 0.5, whiteSpace: 'nowrap' }}>
            ¿Estás seguro que quieres borrar la característica "{characteristicToDelete && characteristics.find(char => char.id === characteristicToDelete)?.name || ''}"?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 1.5, pb: 1.5, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={cancelDelete}
            sx={{
              borderColor: '#e0e0e0',
              color: '#424242',
              textTransform: 'capitalize',
              boxShadow: 'none',
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={confirmDelete}
            sx={{
              backgroundColor: '#f44336',
              textTransform: 'capitalize',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#d32f2f',
                boxShadow: 'none',
              },
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save/Discard Notification */}
      <Snackbar
        open={showSaveNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            minWidth: 'auto',
          },
        }}
      >
        <Alert
          severity="info"
          icon={<InfoIcon sx={{ fontSize: 20 }} />}
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white',
            color: '#424242',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: 2,
            py: 1,
            px: 2,
            '& .MuiAlert-icon': {
              color: '#757575',
              mr: 1,
            },
            '& .MuiAlert-message': {
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, gap: { xs: 1.5, sm: 2 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <Typography variant="body2" sx={{ fontSize: { xs: '12px', sm: '13px' }, fontWeight: 'medium', mb: 0.25 }}>
                Producto no guardado
              </Typography>
              <Typography variant="caption" sx={{ fontSize: { xs: '11px', sm: '12px' }, color: '#757575' }}>
                Tienes cambios pendientes por guardar.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, ml: { xs: 0, sm: 'auto' }, justifyContent: { xs: 'stretch', sm: 'flex-end' } }}>
              <Button
                size="small"
                variant="outlined"
                onClick={handleDiscardChanges}
                sx={{
                  borderColor: '#e0e0e0',
                  color: '#424242',
                  fontSize: { xs: '11px', sm: '12px' },
                  px: { xs: 1.5, sm: 2 },
                  py: 0.5,
                  textTransform: 'capitalize',
                  boxShadow: 'none',
                  flex: { xs: 1, sm: '0 0 auto' },
                  '&:hover': {
                    borderColor: '#bdbdbd',
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                Descartar
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleSaveChanges}
                sx={{
                  backgroundColor: '#424242',
                  fontSize: { xs: '11px', sm: '12px' },
                  px: { xs: 1.5, sm: 2 },
                  py: 0.5,
                  textTransform: 'capitalize',
                  boxShadow: 'none',
                  flex: { xs: 1, sm: '0 0 auto' },
                  '&:hover': {
                    backgroundColor: '#303030',
                    boxShadow: 'none',
                  },
                }}
              >
                Guardar
              </Button>
            </Box>
          </Box>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductForm;

