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
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TableHead,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { httpService } from '@/utils/http.service';
import { API_ENDPOINTS } from '@/routes/api.config';

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
  payment_method: string | null;
  notes?: string;
  paid_at?: string;
  items: SaleItem[];
  created_at: string;
  updated_at: string;
}

interface SaleDetailResponse {
  success: boolean;
  data: Sale;
}

const getStatusColor = (status: string | null | undefined): 'success' | 'error' | 'warning' | 'default' => {
  if (!status) return 'default';
  switch (status.toUpperCase()) {
    case 'PAID':
      return 'success';
    case 'PENDING':
      return 'warning';
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: string | null | undefined): string => {
  if (!status) return 'Desconocido';
  switch (status.toUpperCase()) {
    case 'PAID':
      return 'Pagado';
    case 'PENDING':
      return 'Pendiente';
    case 'CANCELLED':
      return 'Cancelado';
    default:
      return status;
  }
};

const getPaymentMethodLabel = (method: string | null | undefined): string => {
  if (!method) return 'No especificado';
  switch (method.toUpperCase()) {
    case 'CARD':
      return 'Tarjeta';
    case 'CASH':
      return 'Efectivo';
    case 'TRANSFER':
      return 'Transferencia';
    default:
      return method;
  }
};

export default function SaleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sale, setSale] = useState<Sale | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSale();
  }, []);

  const loadSale = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await httpService.get<SaleDetailResponse>(
        API_ENDPOINTS.SALES.BY_ID(resolvedParams.id)
      );
      
      if (response.success && response.data) {
        setSale(response.data);
      } else {
        setError('No se pudo cargar la venta');
      }
    } catch (err) {
      console.error('Error al cargar venta:', err);
      setError('Error al cargar la venta. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !sale) {
    return (
      <Box sx={{ px: { xs: 2, sm: 3, md: 6 }, py: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'No se encontró la venta'}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/historial')}
          variant="outlined"
        >
          Volver al historial
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 6 }, py: 2, backgroundColor: 'white', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={() => router.push('/historial')}
            sx={{
              '&:hover': { backgroundColor: '#f5f5f5' },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#424242' }}>
            Detalle de Venta
          </Typography>
        </Box>
        <Chip
          label={getStatusLabel(sale.status)}
          color={getStatusColor(sale.status)}
          sx={{ fontWeight: 'medium' }}
        />
      </Box>

      <Stack spacing={3}>
        {/* Información del Cliente y Pago */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Card 
            elevation={0}
            sx={{ 
              flex: 1, 
              border: '1px solid #f0f0f0',
              borderRadius: 1,
              backgroundColor: '#fafafa'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: '#e3f2fd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PersonIcon sx={{ color: '#1976d2', fontSize: 22 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#424242', fontSize: '18px' }}>
                  Cliente
                </Typography>
              </Box>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#757575', mb: 1, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Nombre Completo
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium', color: '#424242', fontSize: '17px' }}>
                    {sale.person_name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#757575', mb: 1, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Correo Electrónico
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#424242', fontSize: '17px' }}>
                    {sale.person_email}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#757575', mb: 1, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Teléfono
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#424242', fontSize: '17px' }}>
                    {sale.person_phone}
                  </Typography>
                </Box>
                {sale.person_document_number && (
                  <Box>
                    <Typography variant="body2" sx={{ color: '#757575', mb: 1, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Documento
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#424242', fontSize: '17px' }}>
                      {sale.person_document_number}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
          <Card 
            elevation={0}
            sx={{ 
              flex: 1, 
              border: '1px solid #f0f0f0',
              borderRadius: 1,
              backgroundColor: '#fafafa'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: '#e8f5e9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PaymentIcon sx={{ color: '#388e3c', fontSize: 22 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#424242', fontSize: '18px' }}>
                  Pago
                </Typography>
              </Box>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#757575', mb: 1, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Método de Pago
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium', color: '#424242', fontSize: '17px' }}>
                    {getPaymentMethodLabel(sale.payment_method)}
                  </Typography>
                </Box>
                {sale.paid_at && (
                  <Box>
                    <Typography variant="body2" sx={{ color: '#757575', mb: 1, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Fecha de Pago
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#424242', fontSize: '17px' }}>
                      {formatDate(sale.paid_at)}
                    </Typography>
                  </Box>
                )}
                {sale.notes && (
                  <Box>
                    <Typography variant="body2" sx={{ color: '#757575', mb: 1, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Notas
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#424242', fontSize: '17px' }}>
                      {sale.notes}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Productos */}
        <Card 
          elevation={0}
          sx={{ 
            border: '1px solid #f0f0f0',
            borderRadius: 1,
            backgroundColor: '#fafafa'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: '#fff3e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShoppingCartIcon sx={{ color: '#f57c00', fontSize: 22 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#424242', fontSize: '18px' }}>
                Productos
              </Typography>
            </Box>
              <Stack spacing={2}>
                {sale.items.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2.5,
                      borderRadius: 1,
                      border: '1px solid #f0f0f0',
                      backgroundColor: 'white',
                      '&:hover': {
                        backgroundColor: '#f8f8f8',
                      },
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'medium', color: '#424242', mb: 0.5, fontSize: '16px' }}>
                        {item.product_name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#757575' }}>
                        Cantidad: {item.quantity} × {formatCurrency(item.unit_price)}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#424242', ml: 2 }}>
                      {formatCurrency(item.total_price)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

        {/* Resumen Financiero */}
        <Card 
          elevation={0}
          sx={{ 
            border: '1px solid #f0f0f0',
            borderRadius: 1,
            backgroundColor: '#fafafa'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
              <Stack spacing={2} sx={{ flex: 1, minWidth: '200px' }}>
                {sale.subtotal > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#757575', fontSize: '14px' }}>
                      Subtotal
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#424242', fontWeight: 'medium', fontSize: '15px' }}>
                      {formatCurrency(sale.subtotal)}
                    </Typography>
                  </Box>
                )}
                {sale.tax > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#757575', fontSize: '14px' }}>
                      Impuestos
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#424242', fontWeight: 'medium', fontSize: '15px' }}>
                      {formatCurrency(sale.tax)}
                    </Typography>
                  </Box>
                )}
                {sale.discount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#757575', fontSize: '14px' }}>
                      Descuento
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#424242', fontWeight: 'medium', fontSize: '15px' }}>
                      -{formatCurrency(sale.discount)}
                    </Typography>
                  </Box>
                )}
              </Stack>
              <Divider orientation="vertical" flexItem sx={{ mx: 2, borderColor: '#f0f0f0', display: { xs: 'none', sm: 'block' } }} />
              <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, minWidth: '150px', pt: { xs: 1, sm: 0 } }}>
                <Typography variant="body2" sx={{ color: '#757575', mb: 1.5, fontSize: '14px' }}>
                  Total
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: { xs: '24px', sm: '28px' } }}>
                  {formatCurrency(sale.total_amount)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

