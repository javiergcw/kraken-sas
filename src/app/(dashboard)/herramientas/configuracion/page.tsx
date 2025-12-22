'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import { httpService } from '@/utils/http.service';
import { API_ENDPOINTS } from '@/routes/api.config';
import ConfiguracionPageSkeleton from './ConfiguracionPageSkeleton';

const ConfiguracionPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    website_name: '',
    address: '',
    contact: '',
    website_url: '',
    terms_and_conditions: '',
    privacy_policy: '',
    website_email: '',
    usd_to_cop_exchange_rate: 0,
  });
  const [exchangeRateInput, setExchangeRateInput] = useState<string>('');

  // Cargar datos de la API
  useEffect(() => {
    const loadCompanySettings = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const response = await httpService.get<{ success: boolean; data: typeof formData }>(
          API_ENDPOINTS.COMPANY_SETTINGS.BASE
        );
        
        if (response?.success && response.data) {
          const settings = response.data;
          const exchangeRate = settings.usd_to_cop_exchange_rate || 0;
          setFormData({
            website_name: settings.website_name || '',
            address: settings.address || '',
            contact: settings.contact || '',
            website_url: settings.website_url || '',
            terms_and_conditions: settings.terms_and_conditions || '',
            privacy_policy: settings.privacy_policy || '',
            website_email: settings.website_email || '',
            usd_to_cop_exchange_rate: exchangeRate,
          });
          setExchangeRateInput(exchangeRate.toString());
        }
      } catch (error) {
        console.error('Error al cargar configuración:', error);
        setErrorMessage('Error al cargar la configuración');
      } finally {
        setLoading(false);
      }
    };

    loadCompanySettings();
  }, []);

  const handleChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleExchangeRateChange = (value: string) => {
    // No permitir valores negativos
    if (value.startsWith('-')) {
      return;
    }
    
    setExchangeRateInput(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && value !== '') {
      setFormData({ ...formData, usd_to_cop_exchange_rate: numValue });
    } else if (value === '') {
      setFormData({ ...formData, usd_to_cop_exchange_rate: 0 });
    }
  };

  const handleUpdateConfiguration = async () => {
    try {
      setErrorMessage(null);
      const response = await httpService.put<{ success: boolean }>(
        API_ENDPOINTS.COMPANY_SETTINGS.BASE,
        formData
      );
      
      if (response?.success) {
        setShowSuccessMessage(true);
      } else {
        setErrorMessage('Error al actualizar la configuración');
      }
    } catch (error) {
      console.error('Error al actualizar configuración:', error);
      setErrorMessage('Error al actualizar la configuración');
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
    <Box sx={{ p: { xs: 2, sm: 3 }, backgroundColor: 'white', minHeight: '100%' }}>
      <Typography variant="h5" sx={{ mb: { xs: 2, sm: 3 }, fontWeight: 'bold', fontSize: { xs: '18px', sm: '20px' }, color: '#1a1a1a' }}>
        Configuración generales
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 }, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
        <Stack spacing={3}>
          {/* Nombre del sitio web */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: '14px', color: '#424242' }}>
              Nombre del sitio web
            </Typography>
            <TextField
              fullWidth
              value={formData.website_name}
              onChange={(e) => handleChange('website_name', e.target.value)}
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
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
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
              value={formData.contact}
              onChange={(e) => handleChange('contact', e.target.value)}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '14px',
                },
              }}
            />
            <Typography variant="caption" sx={{ color: '#757575', fontSize: '12px', mt: 0.5, display: 'block' }}>
              Teléfono o información de contacto
            </Typography>
          </Box>

          {/* URL del sitio web */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: '14px', color: '#424242' }}>
              URL del sitio web
            </Typography>
            <TextField
              fullWidth
              value={formData.website_url}
              onChange={(e) => handleChange('website_url', e.target.value)}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '14px',
                },
              }}
            />
            <Typography variant="caption" sx={{ color: '#757575', fontSize: '12px', mt: 0.5, display: 'block' }}>
              URL principal del sitio web
            </Typography>
          </Box>

          {/* Términos y condiciones */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: '14px', color: '#424242' }}>
              Términos y condiciones
            </Typography>
            <TextField
              fullWidth
              value={formData.terms_and_conditions}
              onChange={(e) => handleChange('terms_and_conditions', e.target.value)}
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
              value={formData.privacy_policy}
              onChange={(e) => handleChange('privacy_policy', e.target.value)}
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

          {/* Correo electrónico del sitio web */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: '14px', color: '#424242' }}>
              Correo electrónico del sitio web
            </Typography>
            <TextField
              fullWidth
              value={formData.website_email}
              onChange={(e) => handleChange('website_email', e.target.value)}
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

          {/* Tasa de cambio USD a COP */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, fontSize: '14px', color: '#424242' }}>
              Tasa de cambio USD a COP
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={exchangeRateInput}
              onChange={(e) => handleExchangeRateChange(e.target.value)}
              inputProps={{ min: 0, step: 'any' }}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '14px',
                },
              }}
            />
            <Typography variant="caption" sx={{ color: '#757575', fontSize: '12px', mt: 0.5, display: 'block' }}>
              Tasa de cambio de dólar a peso colombiano
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
      </Paper>

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
    </Box>
  );
};

export default ConfiguracionPage;
