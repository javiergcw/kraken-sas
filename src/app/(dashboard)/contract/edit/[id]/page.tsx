'use client';

import React, { useState, useEffect, use } from 'react';
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
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { contractTemplateController } from '@/components/core';
import RichTextEditor from '@/components/reutilizables/RichTextEditor';
import type { ContractTemplateDto, TemplateVariableDto } from '@/components/core/contracts/dto';

const EditContractTemplatePage = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [template, setTemplate] = useState<ContractTemplateDto | null>(null);
  const [variables, setVariables] = useState<TemplateVariableDto[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    html_content: '',
    is_active: true,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
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
        setVariables(response.data.variables || []);
        setFormData({
          name: response.data.name,
          description: response.data.description || '',
          html_content: response.data.html_content,
          is_active: response.data.is_active,
        });
      } else {
        showSnackbar('No se pudo cargar la plantilla', 'error');
      }
    } catch (error) {
      console.error('Error al cargar plantilla:', error);
      showSnackbar('Error al cargar la plantilla', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showSnackbar('El nombre es requerido', 'error');
      return;
    }

    if (!formData.html_content.trim()) {
      showSnackbar('El contenido HTML es requerido', 'error');
      return;
    }

    try {
      setSubmitting(true);
      
      const updateData = {
        name: formData.name,
        description: formData.description,
        html_content: formData.html_content,
        is_active: formData.is_active,
      };

      const response = await contractTemplateController.update(resolvedParams.id, updateData);

      if (response?.success) {
        showSnackbar('Plantilla actualizada exitosamente', 'success');
        setTimeout(() => {
          router.push('/contract');
        }, 1500);
      } else {
        showSnackbar('Error al actualizar la plantilla', 'error');
      }
    } catch (error) {
      console.error('Error al actualizar plantilla:', error);
      showSnackbar('Error al actualizar la plantilla', 'error');
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

  if (!template) {
    return (
      <Box sx={{ px: { xs: 2, sm: 2, md: 3 }, py: 3, backgroundColor: '#fafafa', minHeight: 'calc(100vh - 64px)' }}>
        <Alert severity="error">Plantilla no encontrada</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/contract')}
          sx={{ mt: 2 }}
        >
          Volver a contratos
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#fafafa', minHeight: 'calc(100vh - 64px)', py: 3 }}>
      <Box sx={{ px: { xs: 2, sm: 2, md: 3 } }}>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => router.push('/contract')}
            sx={{ 
              color: '#757575',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography sx={{ fontSize: '24px', fontWeight: 'bold', color: '#424242' }}>
              Editar Plantilla de Contrato
            </Typography>
            <Typography sx={{ fontSize: '14px', color: '#9e9e9e' }}>
              SKU: {template.sku}
            </Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          {/* Información Básica */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <Typography sx={{ fontSize: '18px', fontWeight: 'bold', mb: 3, color: '#424242' }}>
              Información Básica
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Nombre de la Plantilla"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                fullWidth
                placeholder="Ej: Contrato de Arrendamiento (v2)"
              />

              <TextField
                label="Descripción"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                multiline
                rows={3}
                fullWidth
                placeholder="Describe el propósito y contenido de esta plantilla..."
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 'medium' }}>
                      Plantilla Activa
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: '#757575' }}>
                      (Disponible para crear contratos)
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Paper>

          {/* Contenido HTML */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: '#424242', mb: 1 }}>
                Contenido HTML
              </Typography>
              <Typography sx={{ fontSize: '13px', color: '#757575', mb: 2 }}>
                Define el contenido del contrato. Puedes usar variables como {'{'}{'{'} company_name {'}'}{'}'}
              </Typography>
            </Box>

            <RichTextEditor
              value={formData.html_content}
              onChange={(value) => handleInputChange('html_content', value)}
              placeholder="Escribe el contenido del contrato aquí..."
            />
          </Paper>

          {/* Variables (Solo lectura) */}
          {variables.length > 0 && (
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: '#424242' }}>
                    Variables de la Plantilla
                  </Typography>
                  <Typography sx={{ fontSize: '13px', color: '#757575', mt: 0.5 }}>
                    Las variables se gestionan en la vista de creación
                  </Typography>
                </Box>
                <Chip 
                  label={`${variables.length} variable${variables.length !== 1 ? 's' : ''}`}
                  size="small"
                  sx={{ 
                    backgroundColor: '#e3f2fd', 
                    color: '#1976d2',
                    fontWeight: 'medium'
                  }}
                />
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#fafafa' }}>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>Orden</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>Clave</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>Etiqueta</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>Tipo</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>Requerido</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '13px' }}>Valor por Defecto</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {variables
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((variable, index) => (
                        <TableRow key={variable.id || index}>
                          <TableCell sx={{ fontSize: '13px' }}>
                            <Chip 
                              label={variable.sort_order} 
                              size="small" 
                              sx={{ 
                                width: 32, 
                                height: 24, 
                                fontSize: '12px',
                                backgroundColor: '#f5f5f5',
                                color: '#616161'
                              }} 
                            />
                          </TableCell>
                          <TableCell sx={{ fontSize: '13px', fontFamily: 'monospace', color: '#1976d2' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CodeIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />
                              {variable.key}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontSize: '13px', fontWeight: 'medium' }}>
                            {variable.label}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={variable.data_type} 
                              size="small"
                              sx={{ 
                                fontSize: '11px',
                                height: 22,
                                backgroundColor: '#e8eaf6',
                                color: '#3f51b5'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {variable.required ? (
                              <Chip 
                                label="Sí" 
                                size="small" 
                                sx={{ 
                                  fontSize: '11px',
                                  height: 22,
                                  backgroundColor: '#ffebee',
                                  color: '#d32f2f'
                                }} 
                              />
                            ) : (
                              <Chip 
                                label="No" 
                                size="small" 
                                sx={{ 
                                  fontSize: '11px',
                                  height: 22,
                                  backgroundColor: '#f5f5f5',
                                  color: '#757575'
                                }} 
                              />
                            )}
                          </TableCell>
                          <TableCell sx={{ fontSize: '13px', color: '#757575' }}>
                            {variable.default_value || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* Botones de Acción */}
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/contract')}
                disabled={submitting}
                sx={{ textTransform: 'none' }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#424242',
                  '&:hover': {
                    backgroundColor: '#303030',
                  },
                }}
              >
                {submitting ? 'Actualizando...' : 'Actualizar Plantilla'}
              </Button>
            </Box>
          </Paper>
        </form>
      </Box>

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

export default EditContractTemplatePage;
