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
import { categoryController, subcategoryController } from '@/components/core';
import { ProductCreateRequestDto, ProductUpdateRequestDto } from '@/components/core/products/dto/ProductRequest.dto';

export interface ProductFormData {
  category_id: string;
  subcategory_id: string;
  name: string;
  short_description: string;
  long_description: string;
  photo: string;
  price: number;
  dives_only: number;
  days_course: number;
}


interface ProductFormProps {
  mode: 'create' | 'edit';
  initialData?: ProductFormData;
  productId?: string;
  onSubmit?: (data: ProductFormData) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  mode, 
  initialData,
  productId,
  onSubmit 
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>(initialData || {
    category_id: '',
    subcategory_id: '',
    name: '',
    short_description: '',
    long_description: '',
    photo: '',
    price: 0,
    dives_only: 0,
    days_course: 0,
  });

  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaModalTitle, setMediaModalTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMenuAnchor, setViewMenuAnchor] = useState<null | HTMLElement>(null);
  const [viewType, setViewType] = useState('grid');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estados para categorías y subcategorías
  const [categories, setCategories] = useState<{id: string; name: string}[]>([]);
  const [allSubcategories, setAllSubcategories] = useState<{id: string; name: string; category_id: string}[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<{id: string; name: string; category_id: string}[]>([]);
  
  // Estado inicial para comparar cambios
  const [initialFormState, setInitialFormState] = useState<ProductFormData>(
    initialData || {
      category_id: '',
      subcategory_id: '',
      name: '',
      short_description: '',
      long_description: '',
      photo: '',
      price: 0,
      dives_only: 0,
      days_course: 0,
    }
  );

  // Cargar categorías y subcategorías
  useEffect(() => {
    loadCategoriesAndSubcategories();
  }, []);

  // Filtrar subcategorías cuando cambia la categoría seleccionada
  useEffect(() => {
    if (formData.category_id) {
      const filtered = allSubcategories.filter(sub => sub.category_id === formData.category_id);
      setFilteredSubcategories(filtered);
      // Limpiar subcategoría si no pertenece a la categoría seleccionada
      if (formData.subcategory_id && !filtered.find(sub => sub.id === formData.subcategory_id)) {
        setFormData(prev => ({ ...prev, subcategory_id: '' }));
      }
    } else {
      setFilteredSubcategories([]);
      setFormData(prev => ({ ...prev, subcategory_id: '' }));
    }
  }, [formData.category_id, allSubcategories]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setInitialFormState(initialData);
    }
  }, [initialData]);

  // Detectar cambios en el formulario
  useEffect(() => {
    if (mode === 'edit') {
      const formDataChanged = JSON.stringify(formData) !== JSON.stringify(initialFormState);
      const hasChanges = formDataChanged;
      setHasUnsavedChanges(hasChanges);
      setShowSaveNotification(hasChanges);
    }
  }, [formData, mode, initialFormState]);

  const loadCategoriesAndSubcategories = async () => {
    try {
      // Cargar categorías
      const categoriesResponse = await categoryController.getAll();
      if (categoriesResponse?.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data.map(cat => ({ id: cat.id, name: cat.name })));
      }
      
      // Cargar subcategorías
      const subcategoriesResponse = await subcategoryController.getAll();
      if (subcategoriesResponse?.success && subcategoriesResponse.data) {
        const subs = subcategoriesResponse.data.map(sub => ({ 
          id: sub.id, 
          name: sub.name, 
          category_id: sub.category_id 
        }));
        setAllSubcategories(subs);
        // Si hay una categoría seleccionada, filtrar subcategorías
        if (formData.category_id) {
          setFilteredSubcategories(subs.filter(sub => sub.category_id === formData.category_id));
        }
      }
    } catch (error) {
      console.error('Error al cargar categorías y subcategorías:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBack = () => {
    router.push('/productos');
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
    setFormData(prev => ({ ...prev, photo: imageUrl }));
    handleCloseMediaModal();
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      if (onSubmit) {
        await onSubmit(formData);
      }
      setInitialFormState(formData);
      setHasUnsavedChanges(false);
      setShowSaveNotification(false);
      router.push('/productos');
    } catch (error) {
      console.error('Error al guardar producto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscardChanges = () => {
    setFormData(initialFormState);
    setHasUnsavedChanges(false);
    setShowSaveNotification(false);
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 2, backgroundColor: 'white', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <IconButton 
            sx={{ color: '#757575', p: { xs: 0.5, sm: 1 } }}
            onClick={handleBack}
          >
            <ArrowBackIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </IconButton>
          {mode === 'create' && (
            <Button
              variant="contained"
              onClick={handleSaveChanges}
              disabled={loading}
              sx={{
                backgroundColor: '#424242',
                textTransform: 'capitalize',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#303030',
                  boxShadow: 'none',
                },
              }}
            >
              Guardar producto
            </Button>
          )}
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

              {/* Descripción corta */}
              <Box>
                <Typography variant="caption" sx={{ color: '#424242', mb: 0.25, fontWeight: 'medium' }}>
                  Descripción corta
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Ingrese una descripción corta para el producto"
                  value={formData.short_description}
                  onChange={(e) => handleInputChange('short_description', e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: 32,
                      fontSize: '12px',
                    },
                  }}
                />
              </Box>

              {/* Descripción larga */}
              <Box>
                <Typography variant="caption" sx={{ color: '#424242', mb: 0.25, fontWeight: 'medium' }}>
                  Descripción larga
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Ingrese una descripción detallada para el producto"
                  value={formData.long_description}
                  onChange={(e) => handleInputChange('long_description', e.target.value)}
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
                      value={formData.category_id}
                      onChange={(e) => handleInputChange('category_id', e.target.value)}
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
                      {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: '#424242', mb: 0.25, fontWeight: 'medium' }}>
                    Subcategoría
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={formData.subcategory_id}
                      onChange={(e) => handleInputChange('subcategory_id', e.target.value)}
                      displayEmpty
                      disabled={!formData.category_id || filteredSubcategories.length === 0}
                      sx={{
                        height: 32,
                        fontSize: '12px',
                        '& .MuiSelect-select': {
                          padding: '6px 12px',
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        {!formData.category_id ? 'Primero selecciona una categoría' : 'Selecciona una subcategoría'}
                      </MenuItem>
                      {filteredSubcategories.map((sub) => (
                        <MenuItem key={sub.id} value={sub.id}>
                          {sub.name}
                        </MenuItem>
                      ))}
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
                      USD
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ flex: { xs: 1, sm: 0.8 } }}>
                  <Typography variant="caption" sx={{ color: '#424242', mb: 0.25, fontWeight: 'medium' }}>
                    Precio unitario
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    placeholder="Ingresa el precio del producto"
                    value={formData.price || ''}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
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

              {/* Inmersiones y Días del curso */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: '#424242', mb: 0.25, fontWeight: 'medium' }}>
                    Inmersiones
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    placeholder="Número de inmersiones"
                    value={formData.dives_only || ''}
                    onChange={(e) => handleInputChange('dives_only', parseInt(e.target.value) || 0)}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: 32,
                        fontSize: '12px',
                      },
                    }}
                    inputProps={{ min: 0 }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: '#424242', mb: 0.25, fontWeight: 'medium' }}>
                    Días del curso
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    placeholder="Días de duración"
                    value={formData.days_course || ''}
                    onChange={(e) => handleInputChange('days_course', parseInt(e.target.value) || 0)}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: 32,
                        fontSize: '12px',
                      },
                    }}
                    inputProps={{ min: 0 }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

        </Box>

        {/* Right Column - Multimedia */}
        <Box sx={{ flex: { xs: '1', md: '0.4' }, order: { xs: 2, md: 2 } }}>
          <Box sx={{ backgroundColor: 'white', borderRadius: 1, p: { xs: 1.5, sm: 2 }, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#424242', mb: 2, fontSize: { xs: '14px', sm: '16px' } }}>
              Multimedia
            </Typography>
            
            {/* Selected Image */}
            {formData.photo ? (
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Box
                  component="img"
                  src={formData.photo}
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
                  onClick={() => setFormData(prev => ({ ...prev, photo: '' }))}
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

