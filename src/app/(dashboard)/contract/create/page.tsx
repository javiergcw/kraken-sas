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
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    html_content: '',
  });
  const [variables, setVariables] = useState<TemplateVariable[]>([]);
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
    setVariables(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await contractTemplateController.create({
        name: formData.name,
        sku: formData.sku,
        description: formData.description || undefined,
        html_content: formData.html_content,
        variables: variables.length > 0 ? variables : undefined,
      });
      
      if (response?.success) {
        router.push('/contract');
      }
    } catch (error) {
      console.error('Error al crear plantilla:', error);
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

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        {/* Información básica */}
        <Box sx={{ flex: 1 }}>
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
                  placeholder="Escribe el contenido del contrato aquí. Usa {{variable}} para insertar variables dinámicas."
                  minHeight={300}
                />
                <Typography variant="caption" sx={{ color: '#757575', fontSize: '12px', mt: 0.5, display: 'block' }}>
                  Usa doble llave para variables, por ejemplo: {'{{'}<Chip label="company_name" size="small" sx={{ fontSize: '11px', height: 18, mx: 0.5 }} />{'}}'} o {'{{'}<Chip label="client_name" size="small" sx={{ fontSize: '11px', height: 18, mx: 0.5 }} />{'}}'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Variables dinámicas */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#424242', mb: 2, fontSize: '16px' }}>
              Variables dinámicas
            </Typography>

            {/* Formulario para agregar variable */}
            <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#757575', fontSize: '12px', mb: 1, display: 'block' }}>
                Agregar nueva variable
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    placeholder="Clave (ej: client_name)"
                    value={newVariable.key}
                    onChange={(e) => setNewVariable(prev => ({ ...prev, key: e.target.value }))}
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', backgroundColor: 'white' } }}
                  />
                  <TextField
                    fullWidth
                    placeholder="Etiqueta (ej: Nombre del cliente)"
                    value={newVariable.label}
                    onChange={(e) => setNewVariable(prev => ({ ...prev, label: e.target.value }))}
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { fontSize: '13px', backgroundColor: 'white' } }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={newVariable.data_type}
                      onChange={(e) => setNewVariable(prev => ({ ...prev, data_type: e.target.value as any }))}
                      sx={{ fontSize: '13px', backgroundColor: 'white' }}
                    >
                      <MenuItem value="TEXT">Texto</MenuItem>
                      <MenuItem value="NUMBER">Número</MenuItem>
                      <MenuItem value="DATE">Fecha</MenuItem>
                      <MenuItem value="EMAIL">Email</MenuItem>
                      <MenuItem value="SIGNATURE">Firma</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddVariable}
                    disabled={!newVariable.key || !newVariable.label}
                    sx={{
                      backgroundColor: '#424242',
                      textTransform: 'none',
                      fontSize: '13px',
                      px: 2,
                      boxShadow: 'none',
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        backgroundColor: '#303030',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    Agregar
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Lista de variables */}
            {variables.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8f8f8' }}>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '12px' }}>Clave</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '12px' }}>Etiqueta</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '12px' }}>Tipo</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}>Acción</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {variables.map((variable, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontSize: '13px', fontFamily: 'monospace' }}>{variable.key}</TableCell>
                        <TableCell sx={{ fontSize: '13px' }}>{variable.label}</TableCell>
                        <TableCell sx={{ fontSize: '13px' }}>
                          <Chip label={variable.data_type} size="small" sx={{ fontSize: '11px', height: 20 }} />
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveVariable(index)}
                            sx={{ color: '#f44336', p: 0.5 }}
                          >
                            <DeleteIcon sx={{ fontSize: 18 }} />
                          </IconButton>
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
        </Box>
      </Box>
    </Box>
  );
};

export default CreateContractTemplatePage;
