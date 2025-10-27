'use client';

import React, { useState, useEffect } from 'react';
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
  Avatar,
  Pagination,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ReceiptLongOutlined as ReceiptIcon,
  Close as CloseIcon,
  ModeEditOutlineOutlined as ModeEditOutlineOutlinedIcon,
} from '@mui/icons-material';
import HistorialVentasSkeleton from './HistorialVentasSkeleton';

interface Sale {
  id: number;
  nombre: string;
  categoria: string;
  precio: string;
  imagen: string;
  fecha?: string;
  cantidad?: number;
}

const HistorialVentasPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);

  // Simular carga de datos (puedes reemplazar esto con una llamada API real)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Datos de ejemplo de ventas
  const sales: Sale[] = [
    {
      id: 1,
      nombre: 'Camiseta',
      categoria: 'Ropa',
      precio: '$20.00',
      imagen: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
      fecha: '2025-10-25',
      cantidad: 2,
    },
    {
      id: 2,
      nombre: 'Zapatos',
      categoria: 'Calzado',
      precio: '$50.00',
      imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
      fecha: '2025-10-24',
      cantidad: 1,
    },
    {
      id: 3,
      nombre: 'Mochila',
      categoria: 'Accesorios',
      precio: '$35.00',
      imagen: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop',
      fecha: '2025-10-23',
      cantidad: 1,
    },
  ];

  const filteredSales = sales.filter(sale =>
    sale.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.precio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSales = filteredSales.slice(startIndex, endIndex);

  const handlePageChange = (event: React.ChangeEvent<unknown> | null, page: number) => {
    setCurrentPage(page);
  };

  const handleViewSale = (sale: Sale) => {
    setSelectedSale(sale);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedSale(null);
  };

  // Mostrar skeleton mientras carga
  if (loading) {
    return <HistorialVentasSkeleton />;
  }

  // Si no hay ventas, mostrar estado vacío
  if (filteredSales.length === 0) {
    return (
      <Box sx={{ 
        px: { xs: 2, sm: 3, md: 6 }, 
        py: 2, 
        backgroundColor: 'white', 
        height: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          textAlign: 'center',
          maxWidth: { xs: '320px', sm: '380px' },
          px: { xs: 2, sm: 3 }
        }}>
          {/* Icono */}
          <Box sx={{ mb: 2 }}>
            <ReceiptIcon 
              sx={{ 
                fontSize: { xs: 60, sm: 70 }, 
                color: '#bdbdbd',
                opacity: 0.6
              }} 
            />
          </Box>

          {/* Título */}
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#424242',
              mb: 1.5,
              fontSize: { xs: '20px', sm: '22px' }
            }}
          >
            No hay ventas registradas
          </Typography>

          {/* Descripción */}
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#757575',
              mb: 3,
              fontSize: { xs: '14px', sm: '15px' },
              lineHeight: 1.4
            }}
          >
            Aquí verás el historial de todas tus ventas realizadas
          </Typography>

          {/* Enlace de ayuda */}
          <Box sx={{ mt: 3 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#757575',
                fontSize: { xs: '12px', sm: '13px' },
                cursor: 'pointer',
                '&:hover': {
                  color: '#424242',
                  textDecoration: 'underline'
                }
              }}
            >
              ¿Necesitas ayuda?
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 6 }, py: 2, backgroundColor: 'white', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: { xs: 'wrap', sm: 'nowrap' }, gap: { xs: 1.5, sm: 0 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#424242', fontSize: { xs: '18px', sm: '20px' } }}>
              Historial De Ventas
            </Typography>
            <Chip
              label={`${filteredSales.length} registros`}
              size="small"
              sx={{
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                fontWeight: 'medium',
                fontSize: { xs: '11px', sm: '12px' },
                height: { xs: 22, sm: 24 },
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 }, width: { xs: '100%', sm: 'auto' } }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon sx={{ fontSize: { xs: 18, sm: 20 }, display: { xs: 'none', sm: 'flex' } }} />}
              size="small"
              sx={{
                borderColor: '#e0e0e0',
                color: '#424242',
                fontSize: { xs: '13px', sm: '14px' },
                px: { xs: 1.5, sm: 2 },
                py: 0.5,
                textTransform: 'capitalize',
                flex: { xs: 1, sm: '0 0 auto' },
                '&:hover': { borderColor: '#bdbdbd' },
              }}
            >
              Exportar
            </Button>
          </Box>
        </Box>

        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Buscar en todos los campos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: '#757575', mr: 1, fontSize: { xs: 18, sm: 20 } }} />,
          }}
          sx={{
            maxWidth: { xs: '100%', sm: '70%' },
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
              fontSize: { xs: '13px', sm: '14px' },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#bdbdbd',
              },
            },
          }}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', overflowX: { xs: 'auto', sm: 'visible' } }}>
        <Table size="small" sx={{ minWidth: { xs: 600, sm: 'auto' } }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f8f8' }}>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Categoría</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Precio</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242', textAlign: 'center', py: 0.5, fontSize: '14px' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentSales.map((sale) => (
              <TableRow key={sale.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell sx={{ py: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      src={sale.imagen}
                      alt={sale.nombre}
                      sx={{ width: 32, height: 32, borderRadius: 1 }}
                      variant="square"
                    />
                    <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '14px' }}>
                      {sale.nombre}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 0.5 }}>
                  <Chip
                    label={sale.categoria}
                    size="small"
                    sx={{
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      fontWeight: 'medium',
                      fontSize: '12px',
                      height: 20,
                    }}
                  />
                </TableCell>
                <TableCell sx={{ py: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>
                    {sale.precio}
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: 'center', py: 0.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0 }}>
                    <IconButton 
                      size="small"
                      onClick={() => {}}
                      sx={{ 
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        color: '#757575',
                        p: 1,
                        textTransform: 'capitalize',
                        '&:hover': { 
                          backgroundColor: '#f5f5f5',
                          borderColor: '#bdbdbd'
                        },
                      }}
                    >
                      <ModeEditOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' }, gap: { xs: 1.5, sm: 0 } }}>
        <Typography variant="body2" sx={{ color: '#757575', fontSize: { xs: '12px', sm: '14px' }, order: { xs: 2, sm: 1 }, width: { xs: '100%', sm: 'auto' }, textAlign: { xs: 'center', sm: 'left' } }}>
          Mostrando {startIndex + 1} - {Math.min(endIndex, filteredSales.length)} de {filteredSales.length} registros
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, order: { xs: 1, sm: 2 }, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'center', sm: 'flex-end' } }}>
          <Button
            variant="outlined"
            size="small"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(null, currentPage - 1)}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              color: '#757575',
              px: { xs: 1.25, sm: 1.5 },
              py: 0.5,
              fontSize: { xs: '11px', sm: '12px' },
              textTransform: 'capitalize',
              minWidth: { xs: 'auto', sm: 'auto' },
              '&:hover': {
                backgroundColor: '#f5f5f5',
                borderColor: '#bdbdbd'
              },
              '&:disabled': {
                color: '#bdbdbd',
                borderColor: '#e0e0e0'
              }
            }}
          >
            anterior
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant="text"
              size="small"
              onClick={() => handlePageChange(null, page)}
              sx={{
                border: currentPage === page ? 'none' : '1px solid #e0e0e0',
                borderRadius: '4px',
                color: currentPage === page ? 'white' : '#757575',
                backgroundColor: currentPage === page ? '#424242' : 'white',
                px: { xs: 0.75, sm: 1 },
                py: 0.5,
                fontSize: { xs: '11px', sm: '12px' },
                minWidth: { xs: 32, sm: 36 },
                textTransform: 'capitalize',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: currentPage === page ? '#303030' : '#f5f5f5',
                  borderColor: currentPage === page ? 'transparent' : '#bdbdbd'
                }
              }}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outlined"
            size="small"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(null, currentPage + 1)}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              color: '#757575',
              px: { xs: 1.25, sm: 1.5 },
              py: 0.5,
              fontSize: { xs: '11px', sm: '12px' },
              textTransform: 'capitalize',
              minWidth: { xs: 'auto', sm: 'auto' },
              '&:hover': {
                backgroundColor: '#f5f5f5',
                borderColor: '#bdbdbd'
              },
              '&:disabled': {
                color: '#bdbdbd',
                borderColor: '#e0e0e0'
              }
            }}
          >
            siguiente
          </Button>
        </Box>
      </Box>

      {/* Modal de Ver Venta */}
      <Dialog
        open={viewModalOpen}
        onClose={handleCloseViewModal}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            maxWidth: '450px',
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1,
          px: 2,
          pt: 2,
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#424242', fontSize: '18px' }}>
            {selectedSale?.nombre}
          </Typography>
          <IconButton
            onClick={handleCloseViewModal}
            size="small"
            sx={{
              color: '#757575',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 2, pb: 2 }}>
          {selectedSale && (
            <Box>
              {/* Imagen de la venta */}
              <Box
                component="img"
                src={selectedSale.imagen}
                alt={selectedSale.nombre}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 1,
                  mb: 2,
                  objectFit: 'cover',
                }}
              />

              {/* Información de la venta */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#424242', mb: 0.5 }}>
                    Precio: {selectedSale.precio}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#424242', mb: 0.5 }}>
                    Categoría: {selectedSale.categoria}
                  </Typography>
                </Box>
                {selectedSale.fecha && (
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#424242', mb: 0.5 }}>
                      Fecha: {selectedSale.fecha}
                    </Typography>
                  </Box>
                )}
                {selectedSale.cantidad && (
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#424242', mb: 0.5 }}>
                      Cantidad: {selectedSale.cantidad}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default HistorialVentasPage;

