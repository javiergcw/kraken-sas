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
import { httpService } from '@/utils/http.service';
import { API_ENDPOINTS } from '@/routes/api.config';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';

interface SaleItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_name: string;
  product_sku: string;
}

interface Sale {
  id: string;
  company_id: string;
  person_id: string;
  person_name: string;
  person_email: string;
  person_phone: string;
  person_document_number: string;
  status: string;
  total_amount: number;
  subtotal: number;
  tax: number;
  discount: number;
  reference: string;
  wompi_transaction_id?: string;
  payment_method: string;
  notes?: string;
  paid_at?: string;
  items: SaleItem[];
  created_at: string;
  updated_at: string;
}

interface SalesResponse {
  success: boolean;
  data: Sale[];
}

interface DisplaySale {
  id: string;
  nombre: string;
  precio: string;
  persona: string;
  fecha?: string;
}

const HistorialVentasPage: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<DisplaySale | null>(null);
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState<DisplaySale[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos de la API
  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await httpService.get<SalesResponse>(API_ENDPOINTS.SALES.BASE);
        
        if (response.success && response.data) {
          // Mapear los datos de la API al formato de visualización
          const mappedSales: DisplaySale[] = response.data.map((sale) => {
            const firstItem = sale.items[0]; // Tomar el primer item
            const productName = firstItem?.product_name || 'Sin nombre';
            const price = firstItem?.total_price || sale.total_amount;
            const formattedPrice = `$${price.toFixed(2)}`;
            const fecha = sale.paid_at ? new Date(sale.paid_at).toLocaleDateString('es-ES') : undefined;

            return {
              id: sale.id,
              nombre: productName,
              precio: formattedPrice,
              persona: sale.person_name,
              fecha: fecha,
            };
          });
          
          setSales(mappedSales);
        }
      } catch (err) {
        console.error('Error al obtener ventas:', err);
        setError('Error al cargar las ventas. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const filteredSales = sales.filter(sale =>
    sale.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.persona.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.precio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSales = filteredSales.slice(startIndex, endIndex);

  const handlePageChange = (event: React.ChangeEvent<unknown> | null, page: number) => {
    setCurrentPage(page);
  };

  const handleViewSale = (sale: DisplaySale) => {
    setSelectedSale(sale);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedSale(null);
  };

  const handleEditSale = (saleId: string) => {
    router.push(`/historial/${saleId}`);
  };

  // Mostrar skeleton mientras carga
  if (loading) {
    return <HistorialVentasSkeleton />;
  }

  // Si hay error, mostrar mensaje de error
  if (error && !loading) {
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
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#d32f2f', mb: 2 }}>
            {error}
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </Box>
      </Box>
    );
  }

  // Si no hay ventas, mostrar estado vacío
  if (filteredSales.length === 0 && !loading) {
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
              <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Nombre del Producto</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Persona</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Precio</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242', textAlign: 'center', py: 0.5, fontSize: '14px' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentSales.map((sale) => (
              <TableRow key={sale.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell sx={{ py: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '14px' }}>
                    {sale.nombre}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 0.5 }}>
                  <Typography variant="body2" sx={{ fontSize: '14px', color: '#424242' }}>
                    {sale.persona}
                  </Typography>
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
                      onClick={() => handleEditSale(sale.id)}
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
                      < RemoveRedEyeOutlinedIcon sx={{ fontSize: 16 }} />
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#424242', mb: 0.5 }}>
                  Nombre del Producto: {selectedSale.nombre}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#424242', mb: 0.5 }}>
                  Precio: {selectedSale.precio}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#424242', mb: 0.5 }}>
                  Persona: {selectedSale.persona}
                </Typography>
              </Box>
              {selectedSale.fecha && (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#424242', mb: 0.5 }}>
                    Fecha: {selectedSale.fecha}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default HistorialVentasPage;

