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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Code as CodeIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { contractController } from '@/components/core';
import type { ContractDto } from '@/components/core/contracts/dto';

// Función helper para traducir tipos de relación al español
const translateRelatedType = (type: string | undefined): string => {
  if (!type) return '-';
  const translations: Record<string, string> = {
    'RESERVATION': 'Reserva',
    'PRODUCT': 'Producto',
    'VESSEL': 'Embarcación',
    'RENT': 'Alquiler',
  };
  return translations[type] || type;
};

export default function ViewContractPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState<ContractDto | null>(null);
  const [fields, setFields] = useState<Array<{ key: string; value: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContract();
  }, []);

  const loadContract = async () => {
    try {
      setLoading(true);
      const response = await contractController.getById(resolvedParams.id);
      
      if (response?.success && response.data) {
        setContract(response.data.contract);
        setFields(response.data.fields || []);
      } else {
        setError('No se pudo cargar el contrato');
      }
    } catch (error) {
      console.error('Error al cargar contrato:', error);
      setError('Error al cargar el contrato');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      if (!contract) return;

      const fileName = `contrato-${contract.sku || contract.code}.pdf`;
      const blob = await contractController.downloadPDF(contract.id);

      if (!blob) {
        throw new Error('No se pudo descargar el PDF');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      setError('Error al descargar PDF');
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

  if (error || !contract) {
    return (
      <Box sx={{ px: { xs: 2, sm: 2, md: 3 }, py: 3, backgroundColor: '#fafafa', minHeight: 'calc(100vh - 64px)' }}>
        <Alert severity="error">{error || 'Contrato no encontrado'}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/contract?tab=1')}
          sx={{ mt: 2 }}
        >
          Volver a contratos
        </Button>
      </Box>
    );
  }

  const expiresAt = contract.expires_at ? new Date(contract.expires_at) : null;
  const isExpired = expiresAt && expiresAt < new Date();
  const statusStyle = getStatusColor(contract.status);

  return (
    <Box sx={{ backgroundColor: 'white', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header limpio y elegante */}
      <Box sx={{ 
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <Box sx={{ px: { xs: 2, sm: 2, md: 3 }, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => router.push('/contract?tab=1')}
              sx={{ 
                color: '#757575',
                '&:hover': { backgroundColor: '#f5f5f5' }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#424242' }}>
                Detalle del Contrato
              </Typography>
              <Typography sx={{ fontSize: '13px', color: '#9e9e9e' }}>
                {contract.code}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadPDF}
            sx={{
              textTransform: 'none',
              backgroundColor: '#424242',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#303030',
                boxShadow: 'none',
              },
            }}
          >
            Descargar PDF
          </Button>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, sm: 2, md: 3 }, py: 2 }}>
        {/* Estado destacado */}
        <Paper sx={{ p: 2, mb: 2, borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                backgroundColor: statusStyle.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <DescriptionIcon sx={{ fontSize: 24, color: statusStyle.color }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                  Estado Actual
                </Typography>
                <Typography sx={{ fontSize: '18px', fontWeight: 'bold', color: '#424242' }}>
                  {getStatusLabel(contract.status)}
                </Typography>
              </Box>
            </Box>
            <Chip
              label={contract.sku}
              sx={{
                backgroundColor: '#f5f5f5',
                color: '#424242',
                fontSize: '13px',
                height: 32,
                fontWeight: 'medium',
                fontFamily: 'monospace',
              }}
            />
          </Box>
        </Paper>

        {/* Información del Contrato */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e0e0e0', boxShadow: 'none', mb: 2 }}>
          <Box sx={{ p: 2, backgroundColor: '#fafafa', borderBottom: '1px solid #e0e0e0' }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: '#424242' }}>
              Información del Contrato
            </Typography>
          </Box>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: '200px', fontWeight: 'medium', color: '#757575', fontSize: '14px', borderBottom: '1px solid #f5f5f5' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CodeIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />
                    SKU
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: 'medium', borderBottom: '1px solid #f5f5f5' }}>
                  {contract.sku}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'medium', color: '#757575', fontSize: '14px', borderBottom: '1px solid #f5f5f5' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CodeIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />
                    Código
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: 'medium', borderBottom: '1px solid #f5f5f5' }}>
                  {contract.code}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'medium', color: '#757575', fontSize: '14px', borderBottom: '1px solid #f5f5f5' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinkIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />
                    Tipo de Relación
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #f5f5f5' }}>
                  {contract.related_type ? (
                    <Chip
                      label={translateRelatedType(contract.related_type)}
                      size="small"
                      sx={{
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        fontSize: '12px',
                        height: 24,
                      }}
                    />
                  ) : (
                    <Typography sx={{ fontSize: '14px', color: '#bdbdbd' }}>-</Typography>
                  )}
                </TableCell>
              </TableRow>
              {contract.related_id && (
                <TableRow>
                  <TableCell sx={{ fontWeight: 'medium', color: '#757575', fontSize: '14px', borderBottom: '1px solid #f5f5f5' }}>
                    ID de Relación
                  </TableCell>
                  <TableCell sx={{ fontSize: '12px', fontFamily: 'monospace', color: '#757575', borderBottom: '1px solid #f5f5f5' }}>
                    {contract.related_id}
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell sx={{ fontWeight: 'medium', color: '#757575', fontSize: '14px', borderBottom: '1px solid #f5f5f5' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />
                    Firmante
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #f5f5f5' }}>
                  <Typography sx={{ fontSize: '14px', fontWeight: 'medium', color: '#424242' }}>
                    {contract.signed_by_name}
                  </Typography>
                  <Typography sx={{ fontSize: '13px', color: '#757575' }}>
                    {contract.signed_by_email}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'medium', color: '#757575', fontSize: '14px', borderBottom: '1px solid #f5f5f5' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />
                    Creado
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: '14px', borderBottom: '1px solid #f5f5f5' }}>
                  {new Date(contract.created_at).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'medium', color: '#757575', fontSize: '14px', borderBottom: '1px solid #f5f5f5' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />
                    Vencimiento
                  </Box>
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #f5f5f5' }}>
                  {expiresAt ? (
                    <Box>
                      <Typography 
                        sx={{ 
                          fontSize: '14px', 
                          color: isExpired ? '#f44336' : '#424242',
                          fontWeight: isExpired ? 'bold' : 'normal'
                        }}
                      >
                        {expiresAt.toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
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
                    <Typography sx={{ fontSize: '14px', color: '#bdbdbd' }}>Sin vencimiento</Typography>
                  )}
                </TableCell>
              </TableRow>
              {contract.signed_at && (
                <TableRow>
                  <TableCell sx={{ fontWeight: 'medium', color: '#757575', fontSize: '14px', borderBottom: '1px solid #f5f5f5' }}>
                    Firmado el
                  </TableCell>
                  <TableCell sx={{ fontSize: '14px', color: '#4caf50', fontWeight: 'medium', borderBottom: '1px solid #f5f5f5' }}>
                    {new Date(contract.signed_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>


        {/* Variables del Contrato */}
        {fields.length > 0 && (
          <Paper sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e0e0e0', boxShadow: 'none', mb: 2 }}>
            <Box sx={{ p: 2, backgroundColor: '#fafafa', borderBottom: '1px solid #e0e0e0' }}>
              <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: '#424242' }}>
                Variables del Contrato
                <Chip 
                  label={fields.length} 
                  size="small" 
                  sx={{ 
                    ml: 1.5, 
                    backgroundColor: '#e0e0e0', 
                    color: '#424242', 
                    fontSize: '12px', 
                    height: 22 
                  }} 
                />
              </Typography>
            </Box>
            <Table>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ width: '200px', fontWeight: 'medium', color: '#757575', fontSize: '14px', borderBottom: index === fields.length - 1 ? 'none' : '1px solid #f5f5f5' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CodeIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />
                        {field.key}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: '14px', borderBottom: index === fields.length - 1 ? 'none' : '1px solid #f5f5f5' }}>
                      {field.value === 'null' || !field.value ? (
                        <Typography sx={{ fontSize: '14px', color: '#bdbdbd', fontStyle: 'italic' }}>
                          Sin valor
                        </Typography>
                      ) : (
                        <Typography sx={{ fontSize: '14px', color: '#424242', fontWeight: 'medium' }}>
                          {field.value}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

        {/* HTML Snapshot */}
        {contract.html_snapshot && (
          <Paper sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e0e0e0', boxShadow: 'none', mb: 2 }}>
            <Box sx={{ p: 2, backgroundColor: '#fafafa', borderBottom: '1px solid #e0e0e0' }}>
              <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: '#424242' }}>
                Vista Previa del Contrato
              </Typography>
            </Box>
            <Box 
              sx={{ 
                p: 3, 
                backgroundColor: 'white', 
                minHeight: '200px'
              }}
              dangerouslySetInnerHTML={{ __html: contract.html_snapshot }}
            />
          </Paper>
        )}
      </Box>
    </Box>
  );
}

