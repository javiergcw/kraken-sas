'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Description as DescriptionIcon,
  Code as CodeIcon,
  Edit as EditIcon,
  NoteAdd as NoteAddIcon,
} from '@mui/icons-material';
import { contractTemplateController } from '@/components/core';
import type { ContractTemplateDto } from '@/components/core/contracts/dto';

export default function ViewTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState<ContractTemplateDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      const response = await contractTemplateController.getById(resolvedParams.id);
      
      if (response?.success && response.data) {
        setTemplate(response.data);
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

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 'calc(100vh - 64px)',
        backgroundColor: 'white'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !template) {
    return (
      <Box sx={{ px: { xs: 2, sm: 2, md: 3 }, py: 3, backgroundColor: 'white', minHeight: 'calc(100vh - 64px)' }}>
        <Alert severity="error">{error || 'Plantilla no encontrada'}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/contract?tab=0')}
          sx={{ mt: 2 }}
        >
          Volver a plantillas
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: 'white', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <Box sx={{ 
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <Box sx={{ px: { xs: 2, sm: 2, md: 6 }, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => router.push('/contract?tab=0')}
              sx={{ 
                color: '#757575',
                '&:hover': { backgroundColor: '#f5f5f5' }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                backgroundColor: '#e3f2fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DescriptionIcon sx={{ fontSize: 24, color: '#1976d2' }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#424242' }}>
                {template.name}
              </Typography>
              <Typography sx={{ fontSize: '13px', color: '#9e9e9e' }}>
                SKU: {template.sku}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="contained"
              startIcon={<NoteAddIcon />}
              onClick={() => router.push(`/contract/emit/${template.id}`)}
              sx={{
                textTransform: 'none',
                backgroundColor: '#4caf50',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#45a049',
                  boxShadow: 'none',
                },
              }}
            >
              Emitir Contrato
            </Button>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => router.push(`/contract/edit/${template.id}`)}
              sx={{
                textTransform: 'none',
                borderColor: '#e0e0e0',
                color: '#424242',
                '&:hover': {
                  borderColor: '#1976d2',
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              Editar
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, sm: 2, md: 6 }, py: 3 }}>
        {/* Estado destacado */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label={template.is_active ? 'Activa' : 'Inactiva'}
                sx={{
                  backgroundColor: template.is_active ? '#e8f5e9' : '#ffebee',
                  color: template.is_active ? '#4caf50' : '#f44336',
                  fontSize: '13px',
                  height: 32,
                  fontWeight: 'medium',
                }}
              />
              <Chip
                label={`${template.variables?.length || 0} variable(s)`}
                sx={{
                  backgroundColor: template.variables && template.variables.length > 0 ? '#e8f5e9' : '#f5f5f5',
                  color: template.variables && template.variables.length > 0 ? '#4caf50' : '#757575',
                  fontSize: '13px',
                  height: 32,
                  fontWeight: 'medium',
                }}
              />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                Última actualización
              </Typography>
              <Typography sx={{ fontSize: '13px', color: '#424242', fontWeight: 'medium' }}>
                {new Date(template.updated_at).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Información Básica */}
          <Paper sx={{ p: 3, backgroundColor: 'white', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#424242', mb: 3, fontSize: '16px' }}>
              Información Básica
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    Nombre
                  </Typography>
                  <Typography sx={{ fontSize: '15px', color: '#424242', fontWeight: 'medium' }}>
                    {template.name}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    SKU / Código
                  </Typography>
                  <Chip 
                    label={template.sku}
                    size="small"
                    sx={{ 
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      height: 28,
                      backgroundColor: '#f5f5f5',
                      color: '#424242',
                      fontWeight: 'medium'
                    }}
                  />
                </Box>
              </Box>
              {template.description && (
                <Box>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    Descripción
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: '#424242' }}>
                    {template.description}
                  </Typography>
                </Box>
              )}
              <Divider />
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    Fecha de Creación
                  </Typography>
                  <Typography sx={{ fontSize: '13px', color: '#424242', fontWeight: 'medium' }}>
                    {new Date(template.created_at).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    Última Actualización
                  </Typography>
                  <Typography sx={{ fontSize: '13px', color: '#424242', fontWeight: 'medium' }}>
                    {new Date(template.updated_at).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Variables */}
          {template.variables && template.variables.length > 0 && (
            <Paper sx={{ p: 3, backgroundColor: 'white', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#424242', mb: 3, fontSize: '16px' }}>
                Variables ({template.variables.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {template.variables.map((variable, index) => (
                  <Chip
                    key={index}
                    label={`%${variable.key}% - ${variable.label} (${variable.data_type})`}
                    size="small"
                    sx={{ 
                      fontSize: '13px',
                      height: 32,
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      fontWeight: 'medium'
                    }}
                  />
                ))}
              </Box>
            </Paper>
          )}

          {/* Contenido HTML */}
          {template.html_content && (
            <Paper sx={{ p: 3, backgroundColor: 'white', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#424242', mb: 2, fontSize: '16px' }}>
                Contenido HTML
              </Typography>
              <Box
                sx={{
                  backgroundColor: '#fafafa',
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  p: 2,
                  maxHeight: '500px',
                  overflow: 'auto',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {template.html_content}
              </Box>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
}

