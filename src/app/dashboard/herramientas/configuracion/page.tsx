'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import ImageUploadDialog from '@/components/common/ImageUploadDialog';
import ConfiguracionPageSkeleton from './ConfiguracionPageSkeleton';

const ConfiguracionPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombreSitio: 'Oceano Scuba',
    direccion: 'Carrera 2 # 17 - 46 Esquina, Taganga, Santa Marta, Magdalena',
    contacto: 'oceano@oceanoscuba.com.co',
    colorPrimario: '#D6252C',
    colorSecundario: '#EBF2F9',
    terminos: 'https://#',
    privacidad: '#',
    correoRemitente: '#',
  });
  
  const [imagenes, setImagenes] = useState({
    icono: '/favicon.ico',
    logotipo: '/favicon.ico',
    isotipo: '/favicon.ico',
  });

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<'icono' | 'logotipo' | 'isotipo' | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const [cuentaData, setCuentaData] = useState({
    correo: 'nanobonilla@hotmail.com',
    contrasena: '',
    autenticacionDosFactor: false,
  });

  const [notificacionesData, setNotificacionesData] = useState({
    notificacionesCorreo: false,
    notificacionesPush: false,
    correosMarketing: false,
  });

  // Simular carga de datos (puedes reemplazar esto con una llamada API real)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOpenImageUpload = (field: 'icono' | 'logotipo' | 'isotipo') => {
    setCurrentImageField(field);
    setUploadDialogOpen(true);
  };

  const handleCloseImageUpload = () => {
    setUploadDialogOpen(false);
    setCurrentImageField(null);
  };

  const handleImageUpload = (imageUrl: string) => {
    if (currentImageField) {
      setImagenes({ ...imagenes, [currentImageField]: imageUrl });
    }
  };

  const handleUpdateConfiguration = () => {
    // Aquí iría la lógica para guardar la configuración en el backend
    console.log('Guardando configuración:', formData, imagenes);
    setShowSuccessMessage(true);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  // Mostrar skeleton mientras carga
  if (loading) {
    return <ConfiguracionPageSkeleton />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '100%', height: '100%', backgroundColor: 'white' }}>
      {/* Contenido Principal */}
      <Box sx={{ flex: 1, p: { xs: 2, sm: 3 }, overflowY: 'auto', order: { xs: 2, md: 1 }, height: '100%' }}>
        <Typography variant="h5" sx={{ mb: { xs: 2, sm: 3 }, fontWeight: 'bold', fontSize: { xs: '18px', sm: '20px' }, color: '#1a1a1a' }}>
          Configuración generales
        </Typography>

        <Paper sx={{ p: { xs: 2, sm: 3 }, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
          {activeTab === 0 && (
            <Stack spacing={3}>
              {/* Nombre del sitio web */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: '14px', color: '#424242' }}>
                  Nombre del sitio web
                </Typography>
                <TextField
                  fullWidth
                  value={formData.nombreSitio || ''}
                  onChange={(e) => handleChange('nombreSitio', e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '14px',
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: '#757575', fontSize: '12px', mt: 0.5, display: 'block' }}>
                  Este es el nombre que se mostrará en tu sitio web.
                </Typography>
              </Box>

              {/* Dirección */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: '14px', color: '#424242' }}>
                  Dirección
                </Typography>
                <TextField
                  fullWidth
                  value={formData.direccion || ''}
                  onChange={(e) => handleChange('direccion', e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '14px',
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: '#757575', fontSize: '12px', mt: 0.5, display: 'block' }}>
                  Dirección física de la empresa
                </Typography>
              </Box>

              {/* Contacto */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: '14px', color: '#424242' }}>
                  Contacto
                </Typography>
                <TextField
                  fullWidth
                  value={formData.contacto || ''}
                  onChange={(e) => handleChange('contacto', e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '14px',
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: '#757575', fontSize: '12px', mt: 0.5, display: 'block' }}>
                  Email de contacto para soporte
                </Typography>
              </Box>

              {/* Icono */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: { xs: '13px', sm: '14px' }, color: '#424242' }}>
                  Icono
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1.5, sm: 2 },
                    p: { xs: 1.5, sm: 2 },
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    backgroundColor: 'white',
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  }}
                >
                  <Box
                    component="img"
                    src={imagenes.icono}
                    alt="Icono"
                    sx={{ width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, borderRadius: 1, objectFit: 'cover', flexShrink: 0 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<AddPhotoAlternateOutlinedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                    onClick={() => handleOpenImageUpload('icono')}
                    sx={{
                      textTransform: 'none',
                      fontSize: { xs: '12px', sm: '13px' },
                      color: '#424242',
                      borderColor: '#e0e0e0',
                      px: { xs: 1.5, sm: 2 },
                      py: { xs: 0.75, sm: 1 },
                      '&:hover': { borderColor: '#bdbdbd', backgroundColor: '#f5f5f5' },
                    }}
                  >
                    Añadir imagen
                  </Button>
                </Box>
                <Typography variant="caption" sx={{ color: '#757575', fontSize: '12px', mt: 0.5, display: 'block' }}>
                  Selecciona un icono para tu sitio web
                </Typography>
              </Box>

              {/* Logotipo */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: { xs: '13px', sm: '14px' }, color: '#424242' }}>
                  Logotipo
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1.5, sm: 2 },
                    p: { xs: 1.5, sm: 2 },
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    backgroundColor: 'white',
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  }}
                >
                  <Box
                    component="img"
                    src={imagenes.logotipo}
                    alt="Logotipo"
                    sx={{ width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, borderRadius: 1, objectFit: 'cover', flexShrink: 0 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<AddPhotoAlternateOutlinedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                    onClick={() => handleOpenImageUpload('logotipo')}
                    sx={{
                      textTransform: 'none',
                      fontSize: { xs: '12px', sm: '13px' },
                      color: '#424242',
                      borderColor: '#e0e0e0',
                      px: { xs: 1.5, sm: 2 },
                      py: { xs: 0.75, sm: 1 },
                      '&:hover': { borderColor: '#bdbdbd', backgroundColor: '#f5f5f5' },
                    }}
                  >
                    Añadir imagen
                  </Button>
                </Box>
                <Typography variant="caption" sx={{ color: '#757575', fontSize: '12px', mt: 0.5, display: 'block' }}>
                  Selecciona un logotipo completo
                </Typography>
              </Box>

              {/* Isotipo */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: { xs: '13px', sm: '14px' }, color: '#424242' }}>
                  Isotipo
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1.5, sm: 2 },
                    p: { xs: 1.5, sm: 2 },
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    backgroundColor: 'white',
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  }}
                >
                  <Box
                    component="img"
                    src={imagenes.isotipo}
                    alt="Isotipo"
                    sx={{ width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, borderRadius: 1, objectFit: 'cover', flexShrink: 0 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<AddPhotoAlternateOutlinedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                    onClick={() => handleOpenImageUpload('isotipo')}
                    sx={{
                      textTransform: 'none',
                      fontSize: { xs: '12px', sm: '13px' },
                      color: '#424242',
                      borderColor: '#e0e0e0',
                      px: { xs: 1.5, sm: 2 },
                      py: { xs: 0.75, sm: 1 },
                      '&:hover': { borderColor: '#bdbdbd', backgroundColor: '#f5f5f5' },
                    }}
                  >
                    Añadir imagen
                  </Button>
                </Box>
                <Typography variant="caption" sx={{ color: '#757575', fontSize: '12px', mt: 0.5, display: 'block' }}>
                  Selecciona un isotipo (parte simbólica del logotipo)
                </Typography>
              </Box>

               {/* Color primario */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: { xs: '13px', sm: '14px' }, color: '#424242' }}>
                  Color primario
                </Typography>
                <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: { xs: 40, sm: 48 },
                      height: { xs: 36, sm: 40 },
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                      backgroundColor: 'white',
                      flexShrink: 0,
                    }}
                  >
                    <input
                      type="color"
                      value={formData.colorPrimario || '#000000'}
                      onChange={(e) => handleChange('colorPrimario', e.target.value)}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '2px',
                        cursor: 'pointer',
                      }}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    value={formData.colorPrimario || ''}
                    onChange={(e) => handleChange('colorPrimario', e.target.value)}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: { xs: '13px', sm: '14px' },
                      },
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: '#757575', fontSize: { xs: '11px', sm: '12px' }, mt: 0.5, display: 'block' }}>
                  Color principal de la marca
                </Typography>
              </Box>

              {/* Color secundario */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: { xs: '13px', sm: '14px' }, color: '#424242' }}>
                  Color secundario
                </Typography>
                <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: { xs: 40, sm: 48 },
                      height: { xs: 36, sm: 40 },
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                      backgroundColor: 'white',
                      flexShrink: 0,
                    }}
                  >
                    <input
                      type="color"
                      value={formData.colorSecundario || '#000000'}
                      onChange={(e) => handleChange('colorSecundario', e.target.value)}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '2px',
                        cursor: 'pointer',
                      }}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    value={formData.colorSecundario || ''}
                    onChange={(e) => handleChange('colorSecundario', e.target.value)}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: { xs: '13px', sm: '14px' },
                      },
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: '#757575', fontSize: { xs: '11px', sm: '12px' }, mt: 0.5, display: 'block' }}>
                  Color secundario de la marca
                </Typography>
              </Box>

              {/* Términos y condiciones */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: '14px', color: '#424242' }}>
                  Términos y condiciones
                </Typography>
                <TextField
                  fullWidth
                  value={formData.terminos || ''}
                  onChange={(e) => handleChange('terminos', e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '14px',
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: '#757575', fontSize: '12px', mt: 0.5, display: 'block' }}>
                  Enlace a los términos y condiciones
                </Typography>
              </Box>

              {/* Política de privacidad */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: '14px', color: '#424242' }}>
                  Política de privacidad
                </Typography>
                <TextField
                  fullWidth
                  value={formData.privacidad || ''}
                  onChange={(e) => handleChange('privacidad', e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '14px',
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: '#757575', fontSize: '12px', mt: 0.5, display: 'block' }}>
                  Enlace a la política de privacidad
                </Typography>
              </Box>

              {/* Correo electrónico remitente */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: '14px', color: '#424242' }}>
                  Correo electrónico remitente
                </Typography>
                <TextField
                  fullWidth
                  value={formData.correoRemitente || ''}
                  onChange={(e) => handleChange('correoRemitente', e.target.value)}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '14px',
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: '#757575', fontSize: '12px', mt: 0.5, display: 'block' }}>
                  Correo electrónico desde el cual se enviarán los mensajes
                </Typography>
              </Box>

               {/* Botón de guardar */}
              <Box sx={{ pt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleUpdateConfiguration}
                  sx={{
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    textTransform: 'none',
                    fontSize: { xs: '13px', sm: '14px' },
                    px: { xs: 2, sm: 3 },
                    py: { xs: 0.875, sm: 1 },
                    boxShadow: 'none',
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': {
                      backgroundColor: '#000',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Actualizar configuración
                </Button>
              </Box>
            </Stack>
          )}

          {activeTab === 1 && (
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '16px', sm: '18px' }, color: '#1a1a1a' }}>
                Configuración de cuenta
              </Typography>

              {/* Correo electrónico */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: { xs: '13px', sm: '14px' }, color: '#424242' }}>
                  Correo electrónico
                </Typography>
                <TextField
                  fullWidth
                  value={cuentaData.correo || ''}
                  onChange={(e) => setCuentaData({ ...cuentaData, correo: e.target.value })}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: { xs: '13px', sm: '14px' },
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: '#757575', fontSize: { xs: '11px', sm: '12px' }, mt: 0.5, display: 'block' }}>
                  Este correo electrónico se utilizará para las notificaciones relacionadas con la cuenta.
                </Typography>
              </Box>

              {/* Contraseña */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: { xs: '13px', sm: '14px' }, color: '#424242' }}>
                  Contraseña
                </Typography>
                <TextField
                  fullWidth
                  value={cuentaData.contrasena || ''}
                  onChange={(e) => setCuentaData({ ...cuentaData, contrasena: e.target.value })}
                  size="small"
                  type="password"
                  placeholder="Ingresa tu nueva contraseña"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: { xs: '13px', sm: '14px' },
                    },
                  }}
                />
              </Box>

              {/* Autenticación de dos factores */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: { xs: '13px', sm: '14px' }, color: '#424242' }}>
                  Autenticación de dos factores
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={cuentaData.autenticacionDosFactor}
                      onChange={(e) => setCuentaData({ ...cuentaData, autenticacionDosFactor: e.target.checked })}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#1a1a1a',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#1a1a1a',
                        },
                      }}
                    />
                  }
                  label="Habilitar autenticación de dos factores"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: { xs: '12px', sm: '13px' },
                      color: '#424242',
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: '#757575', fontSize: { xs: '11px', sm: '12px' }, display: 'block', ml: { xs: 4, sm: 5 } }}>
                  Añade una capa adicional de seguridad a tu cuenta.
                </Typography>
              </Box>

              {/* Botón de guardar */}
              <Box sx={{ pt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleUpdateConfiguration}
                  sx={{
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    textTransform: 'none',
                    fontSize: { xs: '13px', sm: '14px' },
                    px: { xs: 2, sm: 3 },
                    py: { xs: 0.875, sm: 1 },
                    boxShadow: 'none',
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': {
                      backgroundColor: '#000',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Guardar cambios
                </Button>
              </Box>
            </Stack>
          )}

          {activeTab === 2 && (
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '16px', sm: '18px' }, color: '#1a1a1a' }}>
                Preferencias de notificación
              </Typography>

              {/* Notificaciones por correo electrónico */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: { xs: 2, sm: 3 } }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '13px', sm: '14px' }, color: '#424242' }}>
                    Notificaciones por correo electrónico
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#757575', fontSize: { xs: '11px', sm: '12px' }, display: 'block' }}>
                    Recibe correos electrónicos sobre la actividad de la cuenta
                  </Typography>
                </Box>
                <Switch
                  checked={notificacionesData.notificacionesCorreo}
                  onChange={(e) => setNotificacionesData({ ...notificacionesData, notificacionesCorreo: e.target.checked })}
                  sx={{
                    flexShrink: 0,
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#1a1a1a',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#1a1a1a',
                    },
                  }}
                />
              </Box>

              {/* Notificaciones push */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: { xs: 2, sm: 3 } }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '13px', sm: '14px' }, color: '#424242' }}>
                    Notificaciones push
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#757575', fontSize: { xs: '11px', sm: '12px' }, display: 'block' }}>
                    Recibe notificaciones push en tus dispositivos
                  </Typography>
                </Box>
                <Switch
                  checked={notificacionesData.notificacionesPush}
                  onChange={(e) => setNotificacionesData({ ...notificacionesData, notificacionesPush: e.target.checked })}
                  sx={{
                    flexShrink: 0,
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#1a1a1a',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#1a1a1a',
                    },
                  }}
                />
              </Box>

              {/* Correos electrónicos de marketing */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: { xs: 2, sm: 3 } }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '13px', sm: '14px' }, color: '#424242' }}>
                    Correos electrónicos de marketing
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#757575', fontSize: { xs: '11px', sm: '12px' }, display: 'block' }}>
                    Recibe correos electrónicos sobre nuevas funciones y ofertas
                  </Typography>
                </Box>
                <Switch
                  checked={notificacionesData.correosMarketing}
                  onChange={(e) => setNotificacionesData({ ...notificacionesData, correosMarketing: e.target.checked })}
                  sx={{
                    flexShrink: 0,
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#1a1a1a',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#1a1a1a',
                    },
                  }}
                />
              </Box>

              {/* Botón de guardar */}
              <Box sx={{ pt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleUpdateConfiguration}
                  sx={{
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    textTransform: 'none',
                    fontSize: { xs: '13px', sm: '14px' },
                    px: { xs: 2, sm: 3 },
                    py: { xs: 0.875, sm: 1 },
                    boxShadow: 'none',
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': {
                      backgroundColor: '#000',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Actualizar preferencias
                </Button>
              </Box>
            </Stack>
          )}
        </Paper>
      </Box>

      {/* Sidebar de pestañas */}
      <Box
        sx={{
          width: { xs: '100%', md: 200 },
          backgroundColor: '#f5f5f5',
          borderLeft: { xs: 'none', md: '1px solid #e0e0e0' },
          borderBottom: { xs: '1px solid #e0e0e0', md: 'none' },
          p: { xs: 1, sm: 2 },
          order: { xs: 1, md: 2 },
          height: { xs: 'auto', md: '100%' },
        }}
      >
        <Tabs
          orientation={isMobile ? 'horizontal' : 'vertical'}
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? 'fullWidth' : 'standard'}
          sx={{
            '& .MuiTab-root': {
              alignItems: { xs: 'center', md: 'flex-start' },
              textTransform: 'none',
              fontSize: { xs: '13px', sm: '14px' },
              color: '#424242',
              minHeight: { xs: 48, md: 40 },
              px: { xs: 1, sm: 2 },
              '&.Mui-selected': {
                backgroundColor: { xs: 'transparent', md: '#fff' },
                color: '#1a1a1a',
                fontWeight: 500,
                borderRadius: { xs: 0, md: 1 },
                borderBottom: { xs: '2px solid #1a1a1a', md: 'none' },
              },
            },
            '& .MuiTabs-indicator': {
              display: { xs: 'none', md: 'none' },
            },
          }}
        >
          <Tab label="Generales" />
          <Tab label="Cuenta" />
          <Tab label="Notificaciones" />
        </Tabs>
      </Box>

      {/* Dialog de subida de imágenes */}
      <ImageUploadDialog
        open={uploadDialogOpen}
        onClose={handleCloseImageUpload}
        onUpload={handleImageUpload}
      />

      {/* Mensaje de éxito */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={4000}
        onClose={handleCloseSuccessMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSuccessMessage}
          severity="info"
          variant="standard"
          sx={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            color: '#424242',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '& .MuiAlert-icon': {
              color: '#2196f3',
            },
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '14px', color: '#424242' }}>
              Configuración actualizada
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '12px', color: '#757575' }}>
              La configuración se ha actualizado correctamente
            </Typography>
          </Box>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConfiguracionPage;

