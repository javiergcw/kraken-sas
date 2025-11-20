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
import { companySettingsController } from '@/components/core';

const ConfiguracionPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [hasExistingSettings, setHasExistingSettings] = useState(false);
  const [originalData, setOriginalData] = useState({
    nombreSitio: '',
    direccion: '',
    contacto: '',
    websiteURL: '',
    colorPrimario: '#D6252C',
    colorSecundario: '#EBF2F9',
    terminos: '',
    privacidad: '',
    correoRemitente: '',
  });
  const [formData, setFormData] = useState({
    nombreSitio: '',
    direccion: '',
    contacto: '',
    websiteURL: '',
    colorPrimario: '#D6252C',
    colorSecundario: '#EBF2F9',
    terminos: '',
    privacidad: '',
    correoRemitente: '',
  });
  
  const [imagenes, setImagenes] = useState({
    icono: '/favicon.ico',
    logotipo: '/favicon.ico',
    isotipo: '/favicon.ico',
  });

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<'icono' | 'logotipo' | 'isotipo' | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
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

  // Cargar datos de la API
  useEffect(() => {
    const loadCompanySettings = async () => {
      try {
        setLoading(true);
        const response = await companySettingsController.get();
        
        if (response && response.success && response.data) {
          // Existe configuración
          const settings = response.data;
          const loadedData = {
            nombreSitio: settings.WebsiteName || '',
            direccion: settings.Address || '',
            contacto: settings.Contact || '',
            websiteURL: settings.WebsiteURL || '',
            colorPrimario: formData.colorPrimario, // Mantener valores locales
            colorSecundario: formData.colorSecundario, // Mantener valores locales
            terminos: settings.TermsAndConditions || '',
            privacidad: settings.PrivacyPolicy || '',
            correoRemitente: settings.WebsiteEmail || '',
          };
          setFormData(loadedData);
          setOriginalData(loadedData);
          setHasExistingSettings(true);
          setIsEditing(false); // Campos bloqueados cuando existe configuración
        } else {
          // No existe configuración - desbloquear campos para crear
          setHasExistingSettings(false);
          setIsEditing(true); // Campos desbloqueados para crear
        }
      } catch (error) {
        console.error('Error al cargar configuración:', error);
        setErrorMessage('Error al cargar la configuración');
      } finally {
        setLoading(false);
      }
    };

    loadCompanySettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Detectar si hay cambios en los campos
  const hasChanges = () => {
    return (
      formData.nombreSitio !== originalData.nombreSitio ||
      formData.direccion !== originalData.direccion ||
      formData.contacto !== originalData.contacto ||
      formData.websiteURL !== originalData.websiteURL ||
      formData.terminos !== originalData.terminos ||
      formData.privacidad !== originalData.privacidad ||
      formData.correoRemitente !== originalData.correoRemitente
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (hasExistingSettings) {
      // Si existe configuración, restaurar valores originales
      setFormData({ ...originalData });
      setIsEditing(false);
    } else {
      // Si no existe configuración, limpiar campos
      setFormData({
        nombreSitio: '',
        direccion: '',
        contacto: '',
        websiteURL: '',
        colorPrimario: formData.colorPrimario,
        colorSecundario: formData.colorSecundario,
        terminos: '',
        privacidad: '',
        correoRemitente: '',
      });
    }
  };

  const handleUpdateConfiguration = async () => {
    try {
      setErrorMessage(null);
      
      // Si no existe configuración, verificar que haya al menos algún dato
      if (!hasExistingSettings) {
        if (!formData.nombreSitio.trim() && !formData.direccion.trim() && !formData.contacto.trim()) {
          setErrorMessage('Debe completar al menos un campo');
          return;
        }
      } else {
        // Si existe configuración, verificar si hay cambios
        if (!hasChanges()) {
          setIsEditing(false);
          return;
        }
      }

      // Preparar datos según si existe configuración o no
      let settingsData;
      
      if (!hasExistingSettings) {
        // Crear: enviar todos los valores del formulario
        settingsData = {
          website_name: formData.nombreSitio || '',
          address: formData.direccion || '',
          contact: formData.contacto || '',
          website_url: formData.websiteURL || '',
          terms_and_conditions: formData.terminos || '',
          privacy_policy: formData.privacidad || '',
          website_email: formData.correoRemitente || '',
        };
      } else {
        // Actualizar: si cambió, usar el nuevo valor; si no cambió, usar el original
        settingsData = {
          website_name: formData.nombreSitio !== originalData.nombreSitio 
            ? formData.nombreSitio 
            : originalData.nombreSitio,
          address: formData.direccion !== originalData.direccion 
            ? formData.direccion 
            : originalData.direccion,
          contact: formData.contacto !== originalData.contacto 
            ? formData.contacto 
            : originalData.contacto,
          website_url: formData.websiteURL !== originalData.websiteURL 
            ? formData.websiteURL 
            : originalData.websiteURL,
          terms_and_conditions: formData.terminos !== originalData.terminos 
            ? formData.terminos 
            : originalData.terminos,
          privacy_policy: formData.privacidad !== originalData.privacidad 
            ? formData.privacidad 
            : originalData.privacidad,
          website_email: formData.correoRemitente !== originalData.correoRemitente 
            ? formData.correoRemitente 
            : originalData.correoRemitente,
        };
      }

      // Usar create si no existe configuración, update si ya existe
      const response = hasExistingSettings
        ? await companySettingsController.update(settingsData)
        : await companySettingsController.create(settingsData);
      
      if (response && response.success && response.data) {
        // Actualizar los datos con la respuesta del servidor (rellena todos los campos)
        const settings = response.data;
        const updatedData = {
          nombreSitio: settings.WebsiteName || '',
          direccion: settings.Address || '',
          contacto: settings.Contact || '',
          websiteURL: settings.WebsiteURL || '',
          colorPrimario: formData.colorPrimario,
          colorSecundario: formData.colorSecundario,
          terminos: settings.TermsAndConditions || '',
          privacidad: settings.PrivacyPolicy || '',
          correoRemitente: settings.WebsiteEmail || '',
        };
        setFormData(updatedData);
        setOriginalData(updatedData);
        setHasExistingSettings(true); // Marcar que ya existe configuración
        setIsEditing(false);
        setShowSuccessMessage(true);
      } else {
        setErrorMessage(hasExistingSettings 
          ? 'Error al actualizar la configuración' 
          : 'Error al crear la configuración');
      }
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      setErrorMessage(hasExistingSettings 
        ? 'Error al actualizar la configuración' 
        : 'Error al crear la configuración');
    }
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
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

              {/* URL del sitio web */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: '14px', color: '#424242' }}>
                  URL del sitio web
                </Typography>
                <TextField
                  fullWidth
                  value={formData.websiteURL || ''}
                  onChange={(e) => handleChange('websiteURL', e.target.value)}
                  disabled={!isEditing}
                  size="small"
                  placeholder="https://miempresa.com"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '14px',
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: '#757575', fontSize: '12px', mt: 0.5, display: 'block' }}>
                  URL completa del sitio web
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                      disabled={!isEditing}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '2px',
                        cursor: isEditing ? 'pointer' : 'not-allowed',
                        opacity: isEditing ? 1 : 0.6,
                      }}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    value={formData.colorPrimario || ''}
                    onChange={(e) => handleChange('colorPrimario', e.target.value)}
                    disabled={!isEditing}
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
                      disabled={!isEditing}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '2px',
                        cursor: isEditing ? 'pointer' : 'not-allowed',
                        opacity: isEditing ? 1 : 0.6,
                      }}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    value={formData.colorSecundario || ''}
                    onChange={(e) => handleChange('colorSecundario', e.target.value)}
                    disabled={!isEditing}
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
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

               {/* Botones de acción */}
              <Box sx={{ pt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {!hasExistingSettings ? (
                  // No existe configuración - mostrar botón Crear
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
                    Crear
                  </Button>
                ) : !isEditing ? (
                  // Existe configuración y no está editando - mostrar botón Editar
                  <Button
                    variant="contained"
                    onClick={handleEdit}
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
                    Editar
                  </Button>
                ) : (
                  // Existe configuración y está editando - mostrar botones Guardar y Cancelar
                  <>
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
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      sx={{
                        borderColor: '#e0e0e0',
                        color: '#424242',
                        textTransform: 'none',
                        fontSize: { xs: '13px', sm: '14px' },
                        px: { xs: 2, sm: 3 },
                        py: { xs: 0.875, sm: 1 },
                        width: { xs: '100%', sm: 'auto' },
                        '&:hover': {
                          borderColor: '#bdbdbd',
                          backgroundColor: '#f5f5f5',
                        },
                      }}
                    >
                      Cancelar
                    </Button>
                  </>
                )}
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
          severity="success"
          variant="standard"
          sx={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            color: '#424242',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '& .MuiAlert-icon': {
              color: '#4caf50',
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

      {/* Mensaje de error */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setErrorMessage(null)}
          severity="error"
          variant="standard"
          sx={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            color: '#424242',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '& .MuiAlert-icon': {
              color: '#f44336',
            },
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '14px', color: '#424242' }}>
              Error
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '12px', color: '#757575' }}>
              {errorMessage}
            </Typography>
          </Box>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConfiguracionPage;

