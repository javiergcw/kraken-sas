'use client';

import React, { useState } from 'react';
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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const CreateProductPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    hasStock: false,
    quantity: 0,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBack = () => {
    router.push('/dashboard/productos');
  };

  return (
    <Box sx={{ p: 2, backgroundColor: 'white', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <IconButton 
            sx={{ mr: 1, color: '#757575' }}
            onClick={handleBack}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        {/* Left Column - Form Fields */}
        <Box sx={{ flex: 0.6 }}>
          <Box sx={{ p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1, mb: 1.5, backgroundColor: 'white' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#424242', mb: 1.5 }}>
              Datos del producto
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {/* Nombre */}
              <Box>
                <Typography variant="body2" sx={{ color: '#424242', mb: 0.5, fontWeight: 'medium' }}>
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
                      height: 40,
                    },
                  }}
                />
              </Box>

              {/* SKU */}
              <Box>
                <Typography variant="body2" sx={{ color: '#424242', mb: 0.5, fontWeight: 'medium' }}>
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
                      height: 40,
                    },
                  }}
                />
              </Box>

              {/* Descripción */}
              <Box>
                <Typography variant="body2" sx={{ color: '#424242', mb: 0.5, fontWeight: 'medium' }}>
                  Descripción
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Ingrese una descripción para el producto"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  size="small"
                />
              </Box>

              {/* Categoría y Subcategoría */}
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: '#424242', mb: 0.5, fontWeight: 'medium' }}>
                    Categoría
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      displayEmpty
                      sx={{
                        height: 40,
                        '& .MuiSelect-select': {
                          padding: '8px 14px',
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
                  <Typography variant="body2" sx={{ color: '#424242', mb: 0.5, fontWeight: 'medium' }}>
                    Subcategoría
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={formData.subcategory}
                      onChange={(e) => handleInputChange('subcategory', e.target.value)}
                      displayEmpty
                      sx={{
                        height: 40,
                        '& .MuiSelect-select': {
                          padding: '8px 14px',
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
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: '#424242', mb: 0.5, fontWeight: 'medium' }}>
                    Tipo de moneda
                  </Typography>
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 1,
                      border: '1px solid #e0e0e0',
                      minHeight: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#757575', fontWeight: 'medium' }}>
                      COP
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: '#424242', mb: 0.5, fontWeight: 'medium' }}>
                    Precio unitario
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Ingresa el precio del producto"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    size="small"
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: 40,
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Stock */}
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: '#424242', mb: 0.5, fontWeight: 'medium' }}>
                    Tiene stock
                  </Typography>
                  <FormControlLabel
                    control={
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
                    }
                    label=""
                    sx={{ margin: 0 }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: '#424242', mb: 0.5, fontWeight: 'medium' }}>
                    Cantidad
                  </Typography>
                  <TextField
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                    size="small"
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        height: 40,
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
          <Box sx={{ p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#424242' }}>
                Características
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                size="small"
                sx={{
                  borderColor: '#e0e0e0',
                  color: '#424242',
                  fontSize: '14px',
                }}
              >
                Agregar
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Right Column - Multimedia */}
        <Box sx={{ flex: 0.4 }}>
          <Box sx={{ backgroundColor: 'white', borderRadius: 1, p: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#424242', mb: 2 }}>
              Multimedia
            </Typography>
            
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
                  sx={{
                    backgroundColor: '#424242',
                    fontSize: '12px',
                    py: 0.5,
                    '&:hover': { backgroundColor: '#303030' },
                  }}
                >
                  Agregar nueva imagen
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    borderColor: '#e0e0e0',
                    color: '#424242',
                    fontSize: '12px',
                    py: 0.5,
                    '&:hover': { borderColor: '#bdbdbd' },
                  }}
                >
                  Seleccionar existente
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer Note */}
      <Box sx={{ mt: 1.5, p: 1, backgroundColor: '#f8f8f8', borderRadius: 1 }}>
        <Typography variant="body2" sx={{ color: '#757575', fontSize: '11px' }}>
          * Las variaciones del producto se pueden agregar después de crear el producto. Una vez que el producto esté guardado, podrás gestionar sus variaciones desde la página de edición.
        </Typography>
      </Box>
    </Box>
  );
};

export default CreateProductPage;
