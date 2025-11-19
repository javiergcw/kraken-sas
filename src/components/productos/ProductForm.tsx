'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { categoryController, subcategoryController } from '@/components/core';
import { ProductCreateRequestDto, ProductUpdateRequestDto } from '@/components/core/products/dto/ProductRequest.dto';
import ProductMediaManager from './ProductMediaManager';
import RichTextEditor from '@/components/reutilizables/RichTextEditor';

export interface ProductFormData {
  category_id: string;
  subcategory_id: string;
  sku: string;
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
    sku: '',
    name: '',
    short_description: '',
    long_description: '',
    photo: '',
    price: 0,
    dives_only: 0,
    days_course: 0,
  });

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
      sku: '',
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
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      
      // Generar SKU automáticamente desde el nombre (en crear y editar)
      if (field === 'name') {
        const sku = value
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-') // Reemplazar espacios con guiones medios
          .replace(/[^a-z0-9-]/g, '') // Eliminar caracteres especiales excepto guiones
          .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
          .replace(/^-|-$/g, ''); // Eliminar guiones al inicio y final
        updated.sku = sku;
      }
      
      return updated;
    });
  };

  const handleBack = () => {
    router.push('/productos');
  };

  const handleImageSelect = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, photo: imageUrl }));
  };

  const handleImageRemove = () => {
    setFormData(prev => ({ ...prev, photo: '' }));
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

              {/* SKU */}
              <Box>
                <Typography variant="caption" sx={{ color: '#424242', mb: 0.25, fontWeight: 'medium' }}>
                  SKU
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Se generará automáticamente desde el nombre"
                  value={formData.sku}
                  disabled={true}
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

              {/* Descripción larga con editor de texto enriquecido */}
              <Box>
                <Typography variant="caption" sx={{ color: '#424242', mb: 0.5, fontWeight: 'medium', display: 'block' }}>
                  Descripción larga
                </Typography>
                <RichTextEditor
                  value={formData.long_description}
                  onChange={(value) => handleInputChange('long_description', value)}
                  placeholder="Ingrese una descripción detallada para el producto. Usa las herramientas de formato para darle estilo."
                  minHeight={200}
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
            
            <ProductMediaManager
              currentImage={formData.photo}
              onImageSelect={handleImageSelect}
              onImageRemove={handleImageRemove}
            />
          </Box>
        </Box>
      </Box>

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

