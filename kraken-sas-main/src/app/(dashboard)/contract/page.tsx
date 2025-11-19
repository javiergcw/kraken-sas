'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  FileCopy as FileCopyIcon,
} from '@mui/icons-material';
import { contractTemplateController, contractController } from '@/components/core';
import type { ContractTemplateDto, ContractDto } from '@/components/core/contracts/dto';

const ContractPage: React.FC = () => {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<ContractTemplateDto[]>([]);
  const [contracts, setContracts] = useState<ContractDto[]>([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplateDto | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string; type: 'template' | 'contract' } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar plantillas
      const templatesResponse = await contractTemplateController.getAll();
      if (templatesResponse?.success && templatesResponse.data) {
        setTemplates(templatesResponse.data);
      }
      
      // Cargar contratos
      const contractsResponse = await contractController.getAll();
      if (contractsResponse?.success && contractsResponse.data) {
        setContracts(contractsResponse.data);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTemplate = (template: ContractTemplateDto) => {
    setSelectedTemplate(template);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedTemplate(null);
  };

  const handleDeleteClick = (id: string, name: string, type: 'template' | 'contract') => {
    setItemToDelete({ id, name, type });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'template') {
        const response = await contractTemplateController.delete(itemToDelete.id);
        if (response?.success) {
          await loadData();
        }
      } else {
        const response = await contractController.delete(itemToDelete.id);
        if (response?.success) {
          await loadData();
        }
      }
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContracts = contracts.filter(contract =>
    contract.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.signer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SIGNED':
        return { bg: '#e8f5e9', color: '#4caf50' };
      case 'PENDING':
        return { bg: '#fff3e0', color: '#ff9800' };
      case 'EXPIRED':
        return { bg: '#ffebee', color: '#f44336' };
      case 'CANCELLED':
        return { bg: '#f5f5f5', color: '#757575' };
      default:
        return { bg: '#e3f2fd', color: '#1976d2' };
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'DRAFT': 'Borrador',
      'PENDING': 'Pendiente',
      'SIGNED': 'Firmado',
      'EXPIRED': 'Expirado',
      'CANCELLED': 'Cancelado',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <Box sx={{ px: { xs: 2, sm: 3, md: 6 }, py: 2, backgroundColor: 'white', height: 'calc(100vh - 64px)' }}>
        <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={400} />
      </Box>
    );
  }

  // Estado vacío para plantillas
  if (templates.length === 0 && tabValue === 0) {
    return (
      <Box sx={{ 
        px: { xs: 2, sm: 3, md: 6 }, 
        py: 2, 
        backgroundColor: 'white', 
        height: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{ textAlign: 'center', maxWidth: '400px' }}>
          <DescriptionIcon sx={{ fontSize: 70, color: '#bdbdbd', opacity: 0.6, mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#424242', mb: 1.5, fontSize: '22px' }}>
            No hay plantillas de contratos
          </Typography>
          <Typography variant="body1" sx={{ color: '#757575', mb: 3, fontSize: '15px', lineHeight: 1.5 }}>
            Crea tu primera plantilla de contrato para empezar a gestionar contratos digitales
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/contract/create')}
            sx={{
              backgroundColor: '#424242',
              fontSize: '15px',
              px: 3.5,
              py: 1.2,
              borderRadius: 2,
              textTransform: 'capitalize',
              boxShadow: 'none',
              '&:hover': { 
                backgroundColor: '#303030',
                boxShadow: 'none'
              },
            }}
          >
            Crear plantilla
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 6 }, py: 2, backgroundColor: 'white', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#424242', fontSize: { xs: '18px', sm: '20px' } }}>
              Contratos
            </Typography>
            <Chip
              label={`${tabValue === 0 ? filteredTemplates.length : filteredContracts.length} registros`}
              size="small"
              sx={{
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                fontWeight: 'medium',
                fontSize: '12px',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {tabValue === 0 && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/contract/create')}
                sx={{
                  backgroundColor: '#424242',
                  fontSize: '14px',
                  px: 2,
                  py: 0.5,
                  textTransform: 'capitalize',
                  boxShadow: 'none',
                  '&:hover': { backgroundColor: '#303030', boxShadow: 'none' },
                }}
              >
                Nueva plantilla
              </Button>
            )}
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: '1px solid #e0e0e0', mb: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'capitalize',
                fontSize: '14px',
                fontWeight: 'medium',
                minHeight: 48,
              },
            }}
          >
            <Tab label="Plantillas" />
            <Tab label="Contratos emitidos" />
          </Tabs>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: '#757575', mr: 1, fontSize: 20 }} />,
          }}
          sx={{
            maxWidth: '70%',
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
              fontSize: '14px',
            },
          }}
        />
      </Box>

      {/* Contenido según tab */}
      {tabValue === 0 ? (
        // Tabla de plantillas
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f8f8' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>SKU</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>Variables</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px', textAlign: 'center' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell sx={{ fontSize: '14px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DescriptionIcon sx={{ fontSize: 18, color: '#757575' }} />
                      {template.name}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: '14px', fontFamily: 'monospace', color: '#757575' }}>
                    {template.sku}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`${template.variables?.length || 0} variables`} 
                      size="small" 
                      sx={{ fontSize: '12px', height: 22 }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={template.is_active ? 'Activa' : 'Inactiva'}
                      size="small"
                      sx={{
                        backgroundColor: template.is_active ? '#e8f5e9' : '#ffebee',
                        color: template.is_active ? '#4caf50' : '#f44336',
                        fontSize: '12px',
                        height: 22,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewTemplate(template)}
                        sx={{
                          border: '1px solid #e0e0e0',
                          borderRight: 'none',
                          borderRadius: '4px 0 0 4px',
                          color: '#757575',
                          p: 1,
                          '&:hover': { backgroundColor: '#f5f5f5' },
                        }}
                      >
                        <ViewIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => router.push(`/contract/edit/${template.id}`)}
                        sx={{
                          border: '1px solid #e0e0e0',
                          borderRadius: 0,
                          color: '#757575',
                          p: 1,
                          '&:hover': { backgroundColor: '#f5f5f5' },
                        }}
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(template.id, template.name, 'template')}
                        sx={{
                          border: '1px solid #f44336',
                          borderLeft: 'none',
                          borderRadius: '0 4px 4px 0',
                          backgroundColor: '#f44336',
                          color: 'white',
                          p: 1,
                          '&:hover': { backgroundColor: '#ff5252' },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // Tabla de contratos emitidos
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f8f8' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>ID / SKU / Código</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>Firmante</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px', textAlign: 'center' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContracts.map((contract) => {
                const statusStyle = getStatusColor(contract.status);
                return (
                  <TableRow key={contract.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <TableCell>
                      <Box>
                        <Typography sx={{ fontSize: '11px', color: '#9e9e9e', fontFamily: 'monospace', mb: 0.25 }}>
                          ID: {contract.id}
                        </Typography>
                        <Typography sx={{ fontSize: '13px', fontFamily: 'monospace', color: '#424242', fontWeight: 'medium' }}>
                          {contract.sku}
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: '#9e9e9e', fontFamily: 'monospace' }}>
                          {contract.code}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: '14px' }}>{contract.signer_name}</TableCell>
                    <TableCell sx={{ fontSize: '13px', color: '#757575' }}>{contract.signer_email}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(contract.status)}
                        size="small"
                        sx={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          fontSize: '12px',
                          height: 22,
                          fontWeight: 'medium',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '13px', color: '#757575' }}>
                      {new Date(contract.created_at).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0 }}>
                        <IconButton
                          size="small"
                          sx={{
                            border: '1px solid #e0e0e0',
                            borderRight: 'none',
                            borderRadius: '4px 0 0 4px',
                            color: '#757575',
                            p: 1,
                            '&:hover': { backgroundColor: '#f5f5f5' },
                          }}
                        >
                          <ViewIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(contract.id, contract.code, 'contract')}
                          sx={{
                            border: '1px solid #f44336',
                            borderLeft: 'none',
                            borderRadius: '0 4px 4px 0',
                            backgroundColor: '#f44336',
                            color: 'white',
                            p: 1,
                            '&:hover': { backgroundColor: '#ff5252' },
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal de Ver Plantilla */}
      <Dialog
        open={viewModalOpen}
        onClose={handleCloseViewModal}
        maxWidth="md"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#424242', fontSize: '18px' }}>
          {selectedTemplate?.name}
        </DialogTitle>
        <DialogContent>
          {selectedTemplate && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#424242', mb: 0.5 }}>
                  SKU:
                </Typography>
                <Typography variant="body2" sx={{ color: '#757575' }}>
                  {selectedTemplate.sku}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#424242', mb: 0.5 }}>
                  Descripción:
                </Typography>
                <Typography variant="body2" sx={{ color: '#757575' }}>
                  {selectedTemplate.description || 'Sin descripción'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#424242', mb: 1 }}>
                  Variables ({selectedTemplate.variables?.length || 0}):
                </Typography>
                {selectedTemplate.variables && selectedTemplate.variables.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedTemplate.variables.map((variable, index) => (
                      <Chip 
                        key={index} 
                        label={`${variable.key} (${variable.data_type})`} 
                        size="small" 
                        sx={{ fontSize: '12px' }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: '#757575' }}>
                    Sin variables definidas
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseViewModal} sx={{ textTransform: 'capitalize' }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Eliminar */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: 2, maxWidth: '420px', padding: '12px' } }}
      >
        <DialogTitle sx={{ pb: 0.5, px: 1.5, pt: 1, fontWeight: 'bold', color: '#424242', fontSize: '16px' }}>
          Eliminar {itemToDelete?.type === 'template' ? 'Plantilla' : 'Contrato'}
        </DialogTitle>
        <DialogContent sx={{ px: 1.5, py: 1 }}>
          <Typography variant="body2" sx={{ color: '#424242', fontSize: '13px', lineHeight: 1.4 }}>
            ¿Estás seguro de que deseas eliminar{' '}
            <Typography component="span" sx={{ fontWeight: 'bold', color: '#f44336', fontSize: '13px' }}>
              {itemToDelete?.name}
            </Typography>
            ?
          </Typography>
          <Typography variant="body2" sx={{ color: '#757575', fontSize: '12px', mt: 0.5 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 1.5, pb: 1, pt: 0.5, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setDeleteModalOpen(false)}
            sx={{
              borderColor: '#e0e0e0',
              color: '#424242',
              textTransform: 'capitalize',
              fontSize: '13px',
              px: 2,
              py: 0.5,
              '&:hover': { borderColor: '#bdbdbd', backgroundColor: '#f5f5f5' },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmDelete}
            sx={{
              backgroundColor: '#f44336',
              textTransform: 'capitalize',
              fontSize: '13px',
              px: 2,
              py: 0.5,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#d32f2f', boxShadow: 'none' },
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContractPage;
