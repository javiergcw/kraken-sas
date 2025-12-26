'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { contractTemplateController, contractController } from '@/components/core';
import type { ContractTemplateDto } from '@/components/core/contracts/dto';

export default function EmitContractPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [template, setTemplate] = useState<ContractTemplateDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    sku: '',
    code: '',
    related_type: '' as '' | 'RESERVATION' | 'PRODUCT' | 'VESSEL' | 'RENT',
    related_id: '',
    signer_name: '',
    signer_email: '',
    expires_at: '',
    fields: {} as Record<string, string>,
  });

  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      const response = await contractTemplateController.getById(resolvedParams.id);
      
      if (response?.success && response.data) {
        setTemplate(response.data);
        
        // Inicializar campos con valores por defecto del template
        const initialFields: Record<string, string> = {};
        response.data.variables?.forEach(variable => {
          const defaultVal = variable.default_value !== null && variable.default_value !== undefined 
            ? String(variable.default_value) 
            : '';
          initialFields[variable.key] = defaultVal;
        });
        
        // Generar SKU sugerido basado en el template
        const templateSku = response.data.sku || 'CONT';
        const dateSuffix = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
        const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const suggestedSku = `${templateSku}-${dateSuffix}-${randomSuffix}`;
        
        setFormData(prev => ({
          ...prev,
          fields: initialFields,
          sku: suggestedSku,
          related_id: response.data.company_id, // Auto-rellenar con el company_id del template
        }));
      } else {
        setError('No se pudo cargar la plantilla');
      }
    } catch (error) {
      console.error('Error al cargar plantilla:', error);
      setError('Error al cargar la plantilla');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFieldChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      fields: { ...prev.fields, [key]: value },
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      // Validaciones básicas
      if (!formData.sku) {
        setError('El SKU es requerido');
        return;
      }

      if (!formData.signer_name || !formData.signer_email) {
        setError('Por favor completa el nombre y email del firmante');
        return;
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.signer_email)) {
        setError('Por favor ingresa un email válido');
        return;
      }

      // Validar campos requeridos de variables
      const requiredFields = template?.variables?.filter(v => v.required) || [];
      for (const field of requiredFields) {
        if (field.data_type !== 'SIGNATURE' && !formData.fields[field.key]) {
          setError(`El campo "${field.label}" es requerido`);
          return;
        }
      }

      // Convertir fecha al formato ISO 8601 completo si existe
      let expiresAt = undefined;
      if (formData.expires_at) {
        const date = new Date(formData.expires_at);
        expiresAt = date.toISOString(); // Convierte a formato: 2025-09-30T23:59:59.000Z
      }

      // Preparar campos: incluir TODOS los campos del template
      // Los campos SIGNATURE se envían como null y se llenan cuando el cliente firma
      const preparedFields: Record<string, any> = {};
      template?.variables?.forEach((variable) => {
        const value = formData.fields[variable.key];
        
        // Para campos SIGNATURE, enviar null si no hay valor
        if (variable.data_type === 'SIGNATURE') {
          preparedFields[variable.key] = value || null;
        } 
        // Para otros campos, enviar el valor o string vacío
        else {
          preparedFields[variable.key] = value !== undefined && value !== null ? value : '';
        }
      });

      // Agregar campos básicos del firmante dentro de fields (según nueva estructura)
      if (formData.signer_name) {
        preparedFields.signer_name = formData.signer_name;
      }
      if (formData.signer_email) {
        preparedFields.email = formData.signer_email;
      }

      // Construir payload con todos los campos necesarios
      const payload: any = {
        template_id: resolvedParams.id,
        sku: formData.sku,
        fields: preparedFields,
      };

      // Agregar related_id (company_id) - siempre requerido
      if (formData.related_id) {
        payload.related_id = formData.related_id;
      }

      // Agregar related_type si está seleccionado
      if (formData.related_type) {
        payload.related_type = formData.related_type;
      }

      // Agregar code si el usuario lo ingresó
      if (formData.code) {
        payload.code = formData.code;
      }

      // Agregar expires_at si se seleccionó fecha
      if (expiresAt) {
        payload.expires_at = expiresAt;
      }

      const response = await contractController.create(payload);

      if (response?.success) {
        router.push('/contract?tab=1');
      } else {
        const errorMsg = response?.message || 'Error al crear el contrato';
        setError(errorMsg);
      }
    } catch (error) {
      console.error('Error al crear contrato:', error);
      setError('Error al crear el contrato. Por favor verifica todos los campos.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 'calc(100vh - 64px)',
        backgroundColor: '#fafafa'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !template) {
    return (
      <Box sx={{ px: { xs: 2, sm: 3, md: 6 }, py: 3, backgroundColor: '#fafafa', minHeight: 'calc(100vh - 64px)' }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/contract')}
          sx={{ mt: 2 }}
        >
          Volver
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 6 }, py: 3, backgroundColor: '#fafafa', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => router.push('/contract')}
            sx={{ color: '#757575' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#424242', fontSize: { xs: '20px', sm: '24px' } }}>
              Emitir Nuevo Contrato
            </Typography>
            <Typography sx={{ color: '#757575', fontSize: '14px', mt: 0.5 }}>
              Plantilla: {template?.name}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
          onClick={handleSubmit}
          disabled={submitting}
          sx={{
            backgroundColor: '#4caf50',
            textTransform: 'none',
            px: 3,
            py: 1,
            boxShadow: '0 2px 8px rgba(76,175,80,0.3)',
            '&:hover': {
              backgroundColor: '#45a049',
              boxShadow: '0 4px 12px rgba(76,175,80,0.4)',
            },
          }}
        >
          {submitting ? 'Emitiendo...' : 'Emitir Contrato'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Información del Contrato */}
        <Paper sx={{ flex: 1, p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#424242', mb: 2, fontSize: '16px' }}>
            Información del Contrato
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="SKU *"
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              size="small"
              required
              placeholder="Ejemplo: RES-ABC-2025"
              helperText="Identificador único del contrato (requerido)"
            />

            <TextField
              fullWidth
              label="Código (opcional)"
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value)}
              size="small"
              placeholder="Ejemplo: CTR-000123"
              helperText="Código personalizado. Si no se ingresa, el backend lo genera automáticamente"
            />

            <Box>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de Relación (opcional)</InputLabel>
                <Select
                  value={formData.related_type}
                  label="Tipo de Relación (opcional)"
                  onChange={(e) => handleInputChange('related_type', e.target.value as 'RESERVATION' | 'PRODUCT' | 'VESSEL' | 'RENT' | '')}
                >
                  <MenuItem value="">Ninguno</MenuItem>
                  <MenuItem value="RESERVATION">Reserva</MenuItem>
                  <MenuItem value="PRODUCT">Producto</MenuItem>
                  <MenuItem value="VESSEL">Embarcación</MenuItem>
                  <MenuItem value="RENT">Alquiler</MenuItem>
                </Select>
              </FormControl>
              <Typography sx={{ fontSize: '12px', color: '#757575', mt: 0.5, ml: 1.5 }}>
                Relaciona este contrato con una entidad específica
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Nombre del Firmante *"
              value={formData.signer_name}
              onChange={(e) => handleInputChange('signer_name', e.target.value)}
              size="small"
              required
            />

            <TextField
              fullWidth
              label="Email del Firmante *"
              type="email"
              value={formData.signer_email}
              onChange={(e) => handleInputChange('signer_email', e.target.value)}
              size="small"
              required
            />

            <TextField
              fullWidth
              label="Fecha de Expiración (opcional)"
              type="datetime-local"
              value={formData.expires_at}
              onChange={(e) => handleInputChange('expires_at', e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
              helperText="Fecha y hora límite para firmar el contrato (opcional)"
              inputProps={{
                min: new Date().toISOString().slice(0, 16), // Fecha mínima es hoy
              }}
            />
          </Box>
        </Paper>

        {/* Variables del Contrato */}
        <Paper sx={{ flex: 1, p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#424242', mb: 2, fontSize: '16px' }}>
            Variables del Contrato ({template?.variables?.length || 0})
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {template?.variables && template.variables.length > 0 ? (
              template.variables.map((variable) => (
                <TextField
                  key={variable.key}
                  fullWidth
                  label={variable.label}
                  value={formData.fields[variable.key] || ''}
                  onChange={(e) => handleFieldChange(variable.key, e.target.value)}
                  size="small"
                  required={variable.required}
                  type={variable.data_type === 'NUMBER' ? 'number' : 
                        variable.data_type === 'DATE' ? 'date' : 
                        variable.data_type === 'EMAIL' ? 'email' : 'text'}
                  InputLabelProps={variable.data_type === 'DATE' ? { shrink: true } : undefined}
                  helperText={variable.description || `Variable: {{${variable.key}}}`}
                  disabled={variable.data_type === 'SIGNATURE'} // Las firmas se llenan al firmar
                />
              ))
            ) : (
              <Typography sx={{ color: '#9e9e9e', fontSize: '14px', textAlign: 'center', py: 3 }}>
                Esta plantilla no tiene variables configuradas
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Información adicional */}
      <Paper sx={{ mt: 3, p: 2, borderRadius: 2, backgroundColor: '#e3f2fd' }}>
        <Typography sx={{ fontSize: '13px', color: '#1976d2', fontWeight: 'medium' }}>
          ℹ️ El contrato se creará en estado "PENDING" (Pendiente de firma). 
          Se enviará un enlace al firmante para que pueda revisar y firmar el documento.
        </Typography>
      </Paper>
    </Box>
  );
}

