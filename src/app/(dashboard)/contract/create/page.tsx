'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { contractTemplateController } from '@/components/core';
import RichTextEditor from '@/components/reutilizables/RichTextEditor';

interface TemplateVariable {
  key: string;
  label: string;
  description?: string;
  data_type: 'TEXT' | 'NUMBER' | 'DATE' | 'SIGNATURE' | 'EMAIL';
  required: boolean;
  default_value?: string;
  sort_order: number;
}

const CreateContractTemplatePage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    html_content: '',
  });
  const [variables, setVariables] = useState<TemplateVariable[]>([
    // Campos básicos
    {
      key: 'email',
      label: 'Email',
      data_type: 'EMAIL',
      required: true,
      sort_order: 1,
    },
    {
      key: 'signer_name',
      label: 'Nombre del que firma',
      data_type: 'TEXT',
      required: true,
      sort_order: 2,
    },
    {
      key: 'identity_type',
      label: 'Tipo de identidad (CC, NIT, etc.)',
      data_type: 'TEXT',
      required: false,
      sort_order: 3,
    },
    {
      key: 'identity_number',
      label: 'Número de identidad',
      data_type: 'TEXT',
      required: false,
      sort_order: 4,
    },
    {
      key: 'company',
      label: 'Empresa',
      data_type: 'TEXT',
      required: false,
      sort_order: 5,
    },
    {
      key: 'signature',
      label: 'Firma (se convierte en tag <img> HTML)',
      data_type: 'SIGNATURE',
      required: true,
      sort_order: 6,
    },
    // Información General - Sección 1
    {
      key: 'general_info_first_name',
      label: '1.1 Nombre',
      data_type: 'TEXT',
      required: false,
      sort_order: 7,
    },
    {
      key: 'general_info_last_name',
      label: '1.2 Apellido',
      data_type: 'TEXT',
      required: false,
      sort_order: 8,
    },
    {
      key: 'general_info_nationality',
      label: '1.3 Nacionalidad',
      data_type: 'TEXT',
      required: false,
      sort_order: 9,
    },
    {
      key: 'general_info_document_type',
      label: '1.4 Tipo de documento',
      data_type: 'TEXT',
      required: false,
      sort_order: 10,
    },
    {
      key: 'general_info_document_number',
      label: '1.5 Número de documento',
      data_type: 'TEXT',
      required: false,
      sort_order: 11,
    },
    {
      key: 'general_info_email',
      label: '1.6 Correo electrónico/email',
      data_type: 'EMAIL',
      required: false,
      sort_order: 12,
    },
    {
      key: 'general_info_phone',
      label: '1.7 Celular/WhatsApp',
      data_type: 'TEXT',
      required: false,
      sort_order: 13,
    },
    {
      key: 'general_info_address',
      label: '1.8 Dirección de correspondencia',
      data_type: 'TEXT',
      required: false,
      sort_order: 14,
    },
    {
      key: 'general_info_address_additional',
      label: '1.9 Dirección - Información adicional',
      data_type: 'TEXT',
      required: false,
      sort_order: 15,
    },
    {
      key: 'general_info_address_city',
      label: '1.10 Dirección - Ciudad',
      data_type: 'TEXT',
      required: false,
      sort_order: 16,
    },
    {
      key: 'general_info_address_state',
      label: '1.11 Dirección - Estado',
      data_type: 'TEXT',
      required: false,
      sort_order: 17,
    },
    {
      key: 'general_info_address_zip_code',
      label: '1.12 Dirección - Código postal',
      data_type: 'TEXT',
      required: false,
      sort_order: 18,
    },
    {
      key: 'general_info_address_country',
      label: '1.13 Dirección - País',
      data_type: 'TEXT',
      required: false,
      sort_order: 19,
    },
    {
      key: 'general_info_birth_date',
      label: '1.14 Fecha de nacimiento (formato: YYYY-MM-DD)',
      data_type: 'DATE',
      required: false,
      sort_order: 20,
    },
    {
      key: 'general_info_certification_level',
      label: '1.15 Nivel de certificación actual',
      data_type: 'TEXT',
      required: false,
      sort_order: 21,
    },
    {
      key: 'general_info_dive_count',
      label: '1.15 Cantidad de buceos / Logbook dives (número)',
      data_type: 'NUMBER',
      required: false,
      sort_order: 22,
    },
    {
      key: 'general_info_how_did_you_know',
      label: '1.16 Cómo supo de nosotros',
      data_type: 'TEXT',
      required: false,
      sort_order: 23,
    },
    {
      key: 'general_info_accommodation',
      label: '1.17 Lugar de hospedaje',
      data_type: 'TEXT',
      required: false,
      sort_order: 24,
    },
    {
      key: 'general_info_activity',
      label: '1.18 Actividad a tomar',
      data_type: 'TEXT',
      required: false,
      sort_order: 25,
    },
    {
      key: 'general_info_activity_start_date',
      label: '1.19 Fecha de inicio de la actividad (formato: YYYY-MM-DD)',
      data_type: 'DATE',
      required: false,
      sort_order: 26,
    },
    {
      key: 'general_info_height',
      label: '1.20 Estatura (centímetros, número)',
      data_type: 'NUMBER',
      required: false,
      sort_order: 27,
    },
    {
      key: 'general_info_weight',
      label: '1.21 Peso (kilogramos, número decimal)',
      data_type: 'NUMBER',
      required: false,
      sort_order: 28,
    },
    {
      key: 'general_info_shoe_size',
      label: '1.22 Talla de calzado (texto)',
      data_type: 'TEXT',
      required: false,
      sort_order: 29,
    },
    {
      key: 'general_info_special_requirements',
      label: '1.23 Requerimientos especiales (texto largo)',
      data_type: 'TEXT',
      required: false,
      sort_order: 30,
    },
    // Contacto de Emergencia - Sección 2
    {
      key: 'emergency_contact_first_name',
      label: '2.1 Nombre',
      data_type: 'TEXT',
      required: false,
      sort_order: 31,
    },
    {
      key: 'emergency_contact_last_name',
      label: '2.2 Apellido',
      data_type: 'TEXT',
      required: false,
      sort_order: 32,
    },
    {
      key: 'emergency_contact_phone',
      label: '2.3 Número de teléfono',
      data_type: 'TEXT',
      required: false,
      sort_order: 33,
    },
    {
      key: 'emergency_contact_email',
      label: '2.4 Correo electrónico',
      data_type: 'EMAIL',
      required: false,
      sort_order: 34,
    },
  ]);
  const [newVariable, setNewVariable] = useState<TemplateVariable>({
    key: '',
    label: '',
    description: '',
    data_type: 'TEXT',
    required: false,
    default_value: '',
    sort_order: 0,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddVariable = () => {
    if (newVariable.key && newVariable.label) {
      setVariables(prev => [...prev, { ...newVariable, sort_order: prev.length + 1 }]);
      setNewVariable({
        key: '',
        label: '',
        description: '',
        data_type: 'TEXT',
        required: false,
        default_value: '',
        sort_order: 0,
      });
    }
  };

  const handleRemoveVariable = (index: number) => {
    // No permitir eliminar las variables predefinidas (33 variables: 6 básicas + 23 info general + 4 emergencia)
    if (index < 34) {
      return;
    }
    setVariables(prev => prev.filter((_, i) => i !== index));
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async () => {
    // Validaciones básicas
    if (!formData.name.trim()) {
      showSnackbar('El nombre de la plantilla es requerido', 'error');
      return;
    }

    if (!formData.sku.trim()) {
      showSnackbar('El SKU es requerido', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await contractTemplateController.create({
        name: formData.name,
        sku: formData.sku,
        description: formData.description || undefined,
        html_content: formData.html_content,
        variables: variables.length > 0 ? variables : undefined,
      });
      
      if (response && 'success' in response) {
        if (response.success === false) {
          // Error retornado por el controlador con mensaje de la API
          const errorMessage = response.message || 'Error al crear la plantilla. Por favor, verifica los datos e intenta nuevamente.';
          showSnackbar(errorMessage, 'error');
        } else if (response.success === true) {
          // Éxito
          showSnackbar('Plantilla creada exitosamente', 'success');
          setTimeout(() => {
            router.push('/contract');
          }, 1500);
        }
      } else if (!response) {
        // Respuesta null (no debería pasar con los cambios)
        showSnackbar('Error al crear la plantilla. Por favor, intenta nuevamente.', 'error');
      }
    } catch (error) {
      console.error('Error al crear plantilla:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error al crear la plantilla. Por favor, intenta nuevamente.';
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 6 }, py: 2, backgroundColor: 'white', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            sx={{ color: '#757575', p: { xs: 0.5, sm: 1 } }}
            onClick={() => router.push('/contract')}
          >
            <ArrowBackIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#424242', fontSize: { xs: '18px', sm: '20px' } }}>
            Nueva Plantilla de Contrato
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !formData.name || !formData.sku}
          sx={{
            backgroundColor: '#424242',
            textTransform: 'capitalize',
            boxShadow: 'none',
            fontSize: { xs: '13px', sm: '14px' },
            px: { xs: 2, sm: 3 },
            '&:hover': {
              backgroundColor: '#303030',
              boxShadow: 'none',
            },
          }}
        >
          Guardar plantilla
        </Button>
      </Box>

      {/* Información básica */}
      <Paper sx={{ p: 2, border: '1px solid #e0e0e0', boxShadow: 'none', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#424242', mb: 2, fontSize: '16px' }}>
          Información básica
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#424242', mb: 0.5, fontWeight: 'medium', display: 'block' }}>
              Nombre de la plantilla *
            </Typography>
            <TextField
              fullWidth
              placeholder="Ej: Contrato de Arrendamiento"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { fontSize: '14px' } }}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: '#424242', mb: 0.5, fontWeight: 'medium', display: 'block' }}>
              SKU / Código *
            </Typography>
            <TextField
              fullWidth
              placeholder="Ej: LEASE-001"
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              size="small"
              sx={{ '& .MuiOutlinedInput-root': { fontSize: '14px' } }}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: '#424242', mb: 0.5, fontWeight: 'medium', display: 'block' }}>
              Descripción
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Descripción breve de la plantilla"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { fontSize: '14px' } }}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: '#424242', mb: 0.5, fontWeight: 'medium', display: 'block' }}>
              Contenido HTML del contrato
            </Typography>
            <RichTextEditor
              value={formData.html_content}
              onChange={(value) => handleInputChange('html_content', value)}
              placeholder="Escribe el contenido del contrato aquí. Usa %variable% para insertar variables dinámicas."
              minHeight={300}
            />
            <Typography variant="caption" sx={{ color: '#757575', fontSize: '12px', mt: 0.5, display: 'block' }}>
              Usa el formato %variable% para insertar variables, por ejemplo: %email%, %signer_name%, %general_info_first_name%, %emergency_contact_phone%, %signature%
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Variables dinámicas */}
      <Paper sx={{ p: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#424242', mb: 2, fontSize: '16px' }}>
          Variables Disponibles ({variables.length})
        </Typography>

        {/* Lista de variables */}
        {variables.length > 0 ? (
          <TableContainer sx={{ maxHeight: '500px', overflow: 'auto' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f8f8' }}>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', minWidth: 150 }}>Clave</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', minWidth: 250 }}>Etiqueta</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', minWidth: 100 }}>Tipo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', textAlign: 'center', minWidth: 120 }}>Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {variables.map((variable, index) => (
                  <TableRow key={index} hover>
                    <TableCell sx={{ fontSize: '13px', fontFamily: 'monospace' }}>%{variable.key}%</TableCell>
                    <TableCell sx={{ fontSize: '13px' }}>{variable.label}</TableCell>
                    <TableCell sx={{ fontSize: '13px' }}>
                      <Chip 
                        label={variable.data_type} 
                        size="small" 
                        sx={{ 
                          fontSize: '11px', 
                          height: 20,
                          backgroundColor: variable.data_type === 'SIGNATURE' ? '#fff3e0' :
                                           variable.data_type === 'EMAIL' ? '#e3f2fd' :
                                           variable.data_type === 'DATE' ? '#f3e5f5' :
                                           variable.data_type === 'NUMBER' ? '#e8f5e9' : '#f5f5f5',
                          color: variable.data_type === 'SIGNATURE' ? '#e65100' :
                                 variable.data_type === 'EMAIL' ? '#1976d2' :
                                 variable.data_type === 'DATE' ? '#7b1fa2' :
                                 variable.data_type === 'NUMBER' ? '#388e3c' : '#424242',
                        }} 
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {index >= 34 ? (
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveVariable(index)}
                          sx={{ color: '#f44336', p: 0.5 }}
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      ) : (
                        <Chip
                          label="Predefinida"
                          size="small"
                          sx={{
                            fontSize: '10px',
                            height: 20,
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                          }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" sx={{ color: '#757575', fontSize: '14px' }}>
              No hay variables agregadas aún
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateContractTemplatePage;
