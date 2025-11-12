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
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  FileCopy as FileCopyIcon,
  CalendarToday as CalendarIcon,
  Code as CodeIcon,
  MoreVert as MoreVertIcon,
  PictureAsPdf as PdfIcon,
  Block as BlockIcon,
  GetApp as DownloadIcon,
  PlayArrow as CreateIcon,
  NoteAdd as NoteAddIcon,
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

  // Modales
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplateDto | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string; type: 'template' | 'contract' } | null>(null);
  const [viewContractModalOpen, setViewContractModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ContractDto | null>(null);
  const [invalidateModalOpen, setInvalidateModalOpen] = useState(false);
  const [contractToInvalidate, setContractToInvalidate] = useState<{ id: string; code: string } | null>(null);

  // Notificaciones
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Menú contextual
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

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
          showSnackbar('Plantilla eliminada exitosamente', 'success');
          await loadData();
        } else {
          showSnackbar('Error al eliminar la plantilla', 'error');
        }
      } else {
        const response = await contractController.delete(itemToDelete.id);
        if (response?.success) {
          showSnackbar('Contrato eliminado exitosamente', 'success');
          await loadData();
        } else {
          showSnackbar('Error al eliminar el contrato', 'error');
        }
      }
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
      showSnackbar('Error al eliminar', 'error');
    }
  };

  // Nuevas funciones
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleViewContract = async (contract: ContractDto) => {
    setSelectedContract(contract);
    setViewContractModalOpen(true);
  };

  const handleCloseViewContractModal = () => {
    setViewContractModalOpen(false);
    setSelectedContract(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, contractId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedContractId(contractId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContractId(null);
  };

  const handleDownloadPDF = async (contractId: string) => {
    try {
      showSnackbar('Descargando PDF...', 'info');
      handleMenuClose();

      // Crear enlace de descarga
      const link = document.createElement('a');
      link.href = `/api/v1/contracts/${contractId}/pdf`;
      link.download = `contrato-${contractId}.pdf`;
      link.click();

      showSnackbar('PDF descargado exitosamente', 'success');
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      showSnackbar('Error al descargar PDF', 'error');
    }
  };

  const handleInvalidateClick = (contractId: string, contractCode: string) => {
    setContractToInvalidate({ id: contractId, code: contractCode });
    setInvalidateModalOpen(true);
    handleMenuClose();
  };

  const handleConfirmInvalidate = async () => {
    if (!contractToInvalidate) return;

    try {
      const response = await contractController.invalidate(contractToInvalidate.id, {
        reason: 'Invalidado desde el panel de administración',
      });

      if (response?.success) {
        showSnackbar('Contrato invalidado exitosamente', 'success');
        await loadData();
      } else {
        showSnackbar('Error al invalidar el contrato', 'error');
      }
      setInvalidateModalOpen(false);
      setContractToInvalidate(null);
    } catch (error) {
      console.error('Error al invalidar:', error);
      showSnackbar('Error al invalidar el contrato', 'error');
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContracts = contracts.filter(contract =>
    contract.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.signer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SIGNED':
        return { bg: '#e8f5e9', color: '#4caf50' };
      case 'PENDING':
      case 'PENDING_SIGN':
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
      'PENDING_SIGN': 'Pendiente de Firma',
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
    <Box sx={{ px: { xs: 2, sm: 3, md: 6 }, py: 3, backgroundColor: '#fafafa', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header Mejorado */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#424242', fontSize: { xs: '24px', sm: '28px' }, mb: 0.5 }}>
              Gestión de Contratos
            </Typography>
            <Typography sx={{ color: '#757575', fontSize: '14px' }}>
              {tabValue === 0
                ? 'Administra las plantillas de contratos que se utilizarán para generar nuevos contratos'
                : 'Visualiza y gestiona todos los contratos generados y firmados'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            {tabValue === 0 && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/contract/create')}
                sx={{
                  backgroundColor: '#1976d2',
                  fontSize: '14px',
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  boxShadow: '0 2px 8px rgba(25,118,210,0.3)',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                    boxShadow: '0 4px 12px rgba(25,118,210,0.4)'
                  },
                }}
              >
                Nueva Plantilla
              </Button>
            )}
          </Box>
        </Box>

        {/* Tabs Mejorados */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{
              backgroundColor: 'white',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '15px',
                fontWeight: 'medium',
                minHeight: 56,
                px: 3,
              },
              '& .Mui-selected': {
                color: '#1976d2',
              },
              '& .MuiTabs-indicator': {
                height: 3,
                backgroundColor: '#1976d2',
              },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DescriptionIcon sx={{ fontSize: 20 }} />
                  <span>Plantillas</span>
                  <Chip
                    label={filteredTemplates.length}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '11px',
                      backgroundColor: tabValue === 0 ? '#e3f2fd' : '#f5f5f5',
                      color: tabValue === 0 ? '#1976d2' : '#757575',
                    }}
                  />
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FileCopyIcon sx={{ fontSize: 20 }} />
                  <span>Contratos Emitidos</span>
                  <Chip
                    label={filteredContracts.length}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '11px',
                      backgroundColor: tabValue === 1 ? '#e3f2fd' : '#f5f5f5',
                      color: tabValue === 1 ? '#1976d2' : '#757575',
                    }}
                  />
                </Box>
              }
            />
          </Tabs>
        </Paper>

        {/* Search Mejorado */}
        <Paper sx={{ p: 2, borderRadius: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder={tabValue === 0
              ? "Buscar plantillas por nombre o SKU..."
              : "Buscar contratos por código o firmante..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: '#757575', mr: 1, fontSize: 22 }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f8f8f8',
                borderRadius: 2,
                fontSize: '14px',
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: '#1976d2',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
              },
            }}
          />
        </Paper>
      </Box>

      {/* Contenido según tab */}
      {tabValue === 0 ? (
        // Tabla de plantillas mejorada
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {filteredTemplates.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '13px', py: 2 }}>
                      Plantilla
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '13px', py: 2 }}>
                      SKU
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '13px', py: 2, textAlign: 'center' }}>
                      Variables
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '13px', py: 2, textAlign: 'center' }}>
                      Estado
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '13px', py: 2, textAlign: 'center' }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTemplates.map((template) => (
                    <TableRow 
                      key={template.id} 
                      sx={{ 
                        '&:hover': { backgroundColor: '#fafafa' },
                        borderBottom: '1px solid #f0f0f0'
                      }}
                    >
                      <TableCell sx={{ py: 2.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              backgroundColor: '#e3f2fd',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <DescriptionIcon sx={{ fontSize: 22, color: '#1976d2' }} />
                          </Box>
                          <Box>
                            <Typography sx={{ fontSize: '14px', fontWeight: 'medium', color: '#424242' }}>
                              {template.name}
                            </Typography>
                            {template.description && (
                              <Typography sx={{ fontSize: '12px', color: '#9e9e9e', maxWidth: 300 }}>
                                {template.description}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Chip 
                          icon={<CodeIcon sx={{ fontSize: 14 }} />}
                          label={template.sku}
                          size="small"
                          sx={{ 
                            fontSize: '12px', 
                            height: 28,
                            fontFamily: 'monospace',
                            backgroundColor: '#f5f5f5',
                            color: '#424242',
                            fontWeight: 'medium'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', py: 2.5 }}>
                        <Chip 
                          label={`${template.variables?.length || 0}`} 
                          size="small" 
                          sx={{ 
                            fontSize: '13px', 
                            height: 28,
                            minWidth: 45,
                            backgroundColor: template.variables && template.variables.length > 0 ? '#e8f5e9' : '#f5f5f5',
                            color: template.variables && template.variables.length > 0 ? '#4caf50' : '#757575',
                            fontWeight: 'bold'
                          }} 
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', py: 2.5 }}>
                        <Chip
                          label={template.is_active ? 'Activa' : 'Inactiva'}
                          size="small"
                          sx={{
                            backgroundColor: template.is_active ? '#e8f5e9' : '#ffebee',
                            color: template.is_active ? '#4caf50' : '#f44336',
                            fontSize: '12px',
                            height: 28,
                            fontWeight: 'medium',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', py: 2.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<NoteAddIcon sx={{ fontSize: 16 }} />}
                            onClick={() => router.push(`/contract/emit/${template.id}`)}
                            sx={{
                              backgroundColor: '#4caf50',
                              color: 'white',
                              textTransform: 'none',
                              fontSize: '13px',
                              px: 2,
                              py: 0.75,
                              fontWeight: 'medium',
                              boxShadow: '0 2px 4px rgba(76,175,80,0.3)',
                              '&:hover': { 
                                backgroundColor: '#45a049',
                                boxShadow: '0 4px 8px rgba(76,175,80,0.4)',
                              },
                            }}
                          >
                            Emitir Contrato
                          </Button>
                          <IconButton
                            size="small"
                            onClick={() => handleViewTemplate(template)}
                            title="Ver detalles de la plantilla"
                            sx={{
                              border: '1px solid #e0e0e0',
                              borderRadius: 1.5,
                              color: '#757575',
                              p: 1,
                              '&:hover': { 
                                backgroundColor: '#e3f2fd', 
                                color: '#1976d2',
                                borderColor: '#1976d2' 
                              },
                            }}
                          >
                            <ViewIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(template.id, template.name, 'template')}
                            title="Eliminar plantilla"
                            sx={{
                              border: '1px solid #ffcdd2',
                              borderRadius: 1.5,
                              backgroundColor: '#ffebee',
                              color: '#f44336',
                              p: 1,
                              '&:hover': { 
                                backgroundColor: '#f44336', 
                                color: 'white',
                                borderColor: '#f44336' 
                              },
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <SearchIcon sx={{ fontSize: 60, color: '#bdbdbd', opacity: 0.5, mb: 2 }} />
              <Typography sx={{ fontSize: '16px', color: '#757575', fontWeight: 'medium' }}>
                No se encontraron plantillas
              </Typography>
              <Typography sx={{ fontSize: '14px', color: '#9e9e9e', mt: 0.5 }}>
                Intenta con otros términos de búsqueda
              </Typography>
            </Box>
          )}
        </Paper>
      ) : (
        // Tabla de contratos emitidos mejorada
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {filteredContracts.length > 0 ? (
            <TableContainer>
              <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f8f8' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>SKU / Código</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>Firmante</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>Relación</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>Vencimiento</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>Creado</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px', textAlign: 'center' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContracts.map((contract) => {
                const statusStyle = getStatusColor(contract.status);
                const expiresAt = contract.expires_at ? new Date(contract.expires_at) : null;
                const isExpired = expiresAt && expiresAt < new Date();
                
                return (
                  <TableRow key={contract.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    {/* SKU / Código */}
                    <TableCell>
                      <Box>
                        <Typography sx={{ fontSize: '13px', fontFamily: 'monospace', color: '#424242', fontWeight: 'medium' }}>
                          {contract.sku}
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: '#9e9e9e', fontFamily: 'monospace' }}>
                          {contract.code}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Firmante */}
                    <TableCell>
                      <Box>
                        <Typography sx={{ fontSize: '14px', color: '#424242', fontWeight: 'medium' }}>
                          {contract.signed_by_name}
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: '#757575' }}>
                          {contract.signed_by_email}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Relación */}
                    <TableCell>
                      {contract.related_type ? (
                        <Chip
                          label={contract.related_type}
                          size="small"
                          sx={{
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            fontSize: '11px',
                            height: 20,
                            fontWeight: 'medium',
                          }}
                        />
                      ) : (
                        <Typography sx={{ fontSize: '12px', color: '#bdbdbd' }}>-</Typography>
                      )}
                    </TableCell>

                    {/* Estado */}
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

                    {/* Vencimiento */}
                    <TableCell>
                      {expiresAt ? (
                        <Box>
                          <Typography 
                            sx={{ 
                              fontSize: '13px', 
                              color: isExpired ? '#f44336' : '#424242',
                              fontWeight: isExpired ? 'bold' : 'normal'
                            }}
                          >
                            {expiresAt.toLocaleDateString('es-ES', { 
                              day: '2-digit', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </Typography>
                          {isExpired && (
                            <Chip 
                              label="Vencido" 
                              size="small" 
                              sx={{ 
                                backgroundColor: '#ffebee', 
                                color: '#f44336', 
                                fontSize: '10px', 
                                height: 18,
                                mt: 0.5
                              }} 
                            />
                          )}
                        </Box>
                      ) : (
                        <Typography sx={{ fontSize: '12px', color: '#9e9e9e' }}>Sin vencimiento</Typography>
                      )}
                    </TableCell>

                    {/* Creado */}
                    <TableCell sx={{ fontSize: '13px', color: '#757575' }}>
                      {new Date(contract.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </TableCell>

                    {/* Acciones */}
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewContract(contract)}
                          sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            color: '#757575',
                            p: 0.75,
                            '&:hover': { backgroundColor: '#f5f5f5', color: '#1976d2' },
                          }}
                          title="Ver detalles"
                        >
                          <ViewIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, contract.id)}
                          sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            color: '#757575',
                            p: 0.75,
                            '&:hover': { backgroundColor: '#f5f5f5', color: '#424242' },
                          }}
                          title="Más acciones"
                        >
                          <MoreVertIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(contract.id, contract.code, 'contract')}
                          sx={{
                            border: '1px solid #ffcdd2',
                            borderRadius: 1,
                            backgroundColor: '#ffebee',
                            color: '#f44336',
                            p: 0.75,
                            '&:hover': { backgroundColor: '#f44336', color: 'white' },
                          }}
                          title="Eliminar"
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
          ) : (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <SearchIcon sx={{ fontSize: 60, color: '#bdbdbd', opacity: 0.5, mb: 2 }} />
              <Typography sx={{ fontSize: '16px', color: '#757575', fontWeight: 'medium' }}>
                No se encontraron contratos
              </Typography>
              <Typography sx={{ fontSize: '14px', color: '#9e9e9e', mt: 0.5 }}>
                Intenta con otros términos de búsqueda
              </Typography>
            </Box>
          )}
        </Paper>
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

      {/* Modal de Ver Contrato */}
      <Dialog
        open={viewContractModalOpen}
        onClose={handleCloseViewContractModal}
        maxWidth="md"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                backgroundColor: '#e3f2fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileCopyIcon sx={{ fontSize: 24, color: '#1976d2' }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 'bold', color: '#424242', fontSize: '18px' }}>
                Contrato: {selectedContract?.code}
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#9e9e9e' }}>
                ID: {selectedContract?.id.substring(0, 8)}...
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedContract && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* SKU y Código */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    SKU
                  </Typography>
                  <Typography sx={{ fontSize: '14px', fontFamily: 'monospace', color: '#424242', fontWeight: 'medium' }}>
                    {selectedContract.sku}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    Código
                  </Typography>
                  <Typography sx={{ fontSize: '14px', fontFamily: 'monospace', color: '#424242', fontWeight: 'medium' }}>
                    {selectedContract.code}
                  </Typography>
                </Box>
              </Box>

              {/* Firmante */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    Firmante
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: '#424242', fontWeight: 'medium' }}>
                    {selectedContract.signed_by_name}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    Email
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: '#424242' }}>
                    {selectedContract.signed_by_email}
                  </Typography>
                </Box>
              </Box>

              {/* Estado y Relación */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    Estado
                  </Typography>
                  <Chip
                    label={getStatusLabel(selectedContract.status)}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(selectedContract.status).bg,
                      color: getStatusColor(selectedContract.status).color,
                      fontSize: '12px',
                      height: 26,
                      fontWeight: 'medium',
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    Tipo de Relación
                  </Typography>
                  {selectedContract.related_type ? (
                    <Chip
                      label={selectedContract.related_type}
                      size="small"
                      sx={{
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        fontSize: '12px',
                        height: 26,
                        fontWeight: 'medium',
                      }}
                    />
                  ) : (
                    <Typography sx={{ fontSize: '14px', color: '#bdbdbd' }}>
                      Sin relación
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Fechas */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    Fecha de creación
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: '#424242', fontWeight: 'medium' }}>
                    {new Date(selectedContract.created_at).toLocaleDateString('es-ES', {
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
                    Fecha de vencimiento
                  </Typography>
                  {selectedContract.expires_at ? (
                    <Typography sx={{ fontSize: '14px', color: '#424242', fontWeight: 'medium' }}>
                      {new Date(selectedContract.expires_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  ) : (
                    <Typography sx={{ fontSize: '14px', color: '#bdbdbd' }}>
                      Sin vencimiento
                    </Typography>
                  )}
                </Box>
              </Box>

              {selectedContract.signed_at && (
                <Box>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    Fecha de firma
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: '#424242', fontWeight: 'medium' }}>
                    {new Date(selectedContract.signed_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Box>
              )}

              {/* Access Token */}
              {selectedContract.access_token && (
                <Box>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    Token de Acceso
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontSize: '12px', fontFamily: 'monospace', color: '#757575', backgroundColor: '#f5f5f5', p: 1, borderRadius: 1, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {selectedContract.access_token}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={handleCloseViewContractModal}
            sx={{
              textTransform: 'capitalize',
              color: '#757575'
            }}
          >
            Cerrar
          </Button>
          {selectedContract && (
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownloadPDF(selectedContract.id)}
              sx={{
                backgroundColor: '#424242',
                textTransform: 'capitalize',
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#303030', boxShadow: 'none' },
              }}
            >
              Descargar PDF
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Modal de Invalidar Contrato */}
      <Dialog
        open={invalidateModalOpen}
        onClose={() => setInvalidateModalOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: 2, maxWidth: '420px', padding: '12px' } }}
      >
        <DialogTitle sx={{ pb: 0.5, px: 1.5, pt: 1, fontWeight: 'bold', color: '#424242', fontSize: '16px' }}>
          Invalidar Contrato
        </DialogTitle>
        <DialogContent sx={{ px: 1.5, py: 1 }}>
          <Typography variant="body2" sx={{ color: '#424242', fontSize: '13px', lineHeight: 1.4 }}>
            ¿Estás seguro de que deseas invalidar el contrato{' '}
            <Typography component="span" sx={{ fontWeight: 'bold', color: '#ff9800', fontSize: '13px' }}>
              {contractToInvalidate?.code}
            </Typography>
            ?
          </Typography>
          <Typography variant="body2" sx={{ color: '#757575', fontSize: '12px', mt: 0.5 }}>
            Esta acción marcará el contrato como inválido y no podrá ser utilizado.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 1.5, pb: 1, pt: 0.5, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setInvalidateModalOpen(false)}
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
            onClick={handleConfirmInvalidate}
            sx={{
              backgroundColor: '#ff9800',
              textTransform: 'capitalize',
              fontSize: '13px',
              px: 2,
              py: 0.5,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#f57c00', boxShadow: 'none' },
            }}
          >
            Invalidar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menú Contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            borderRadius: 1,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            mt: 0.5,
          }
        }}
      >
        <MenuItem
          onClick={() => {
            if (selectedContractId) {
              handleDownloadPDF(selectedContractId);
            }
          }}
          sx={{ fontSize: '14px', py: 1 }}
        >
          <ListItemIcon>
            <PdfIcon sx={{ fontSize: 20, color: '#f44336' }} />
          </ListItemIcon>
          <ListItemText>Descargar PDF</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedContractId) {
              const contract = contracts.find(c => c.id === selectedContractId);
              if (contract) {
                handleInvalidateClick(contract.id, contract.code);
              }
            }
          }}
          sx={{ fontSize: '14px', py: 1 }}
        >
          <ListItemIcon>
            <BlockIcon sx={{ fontSize: 20, color: '#ff9800' }} />
          </ListItemIcon>
          <ListItemText>Invalidar contrato</ListItemText>
        </MenuItem>
      </Menu>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: 1,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContractPage;
