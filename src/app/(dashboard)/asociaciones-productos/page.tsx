'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Container,
    CircularProgress,
    Tooltip,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import { productAssociationService, ProductAssociation } from '@/components/core';
import { tokenService } from '@/utils/token.service'; // Import tokenService
import ProductAssociationModal from './ProductAssociationModal';

export default function ProductAssociationsPage() {
    const [loading, setLoading] = useState(true);
    const [associations, setAssociations] = useState<ProductAssociation[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAssociation, setSelectedAssociation] = useState<ProductAssociation | null>(null);

    const fetchAssociations = async () => {
        setLoading(true);
        try {
            const token = tokenService.getToken() || undefined; // Retrieve token
            const response = await productAssociationService.getAll(token); // Pass token
            setAssociations(response.data || []);
        } catch (error) {
            console.error('Error fetching associations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssociations();
    }, []);

    const handleCreate = () => {
        setSelectedAssociation(null);
        setModalOpen(true);
    };

    const handleEdit = (association: ProductAssociation) => {
        setSelectedAssociation(association);
        setModalOpen(true);
    };

    const handleModalSuccess = () => {
        fetchAssociations();
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: { md: 'flex', xs: 'block' }, justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#424242', fontSize: { xs: '18px', sm: '20px' }, mb: { xs: 2, sm: 0 } }}>
                    Asociaciones de Productos
                </Typography>


                <Button
                    variant="contained"
                    startIcon={<AddIcon sx={{ fontSize: { xs: 18, sm: 20 }, display: { xs: 'none', sm: 'flex' } }} />}
                    size="small"
                    onClick={handleCreate}
                    sx={{
                        backgroundColor: '#424242',
                        fontSize: { xs: '13px', sm: '14px' },
                        px: { xs: 1.5, sm: 2 },
                        py: 0.5,
                        textTransform: 'capitalize',
                        flex: { xs: 1, sm: '0 0 auto' }, '&:hover': { backgroundColor: '#303030' },
                    }}
                >
                    Nueva Asociación
                </Button>


            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #ccc' }}>
                <Table sx={{ minWidth: 650 }} aria-label="product associations table">
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Producto</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Contrato</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Actividad</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : associations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        No hay asociaciones registradas
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            associations.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: '#f9f9f9' } }}
                                >
                                    <TableCell>
                                        <Box>
                                            <Typography variant="subtitle2">{row.product?.name || 'N/A'}</Typography>
                                            <Typography variant="caption" color="text.secondary">{row.product?.sku}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2">{row.contract?.sku || 'N/A'}</Typography>
                                            <Chip
                                                label={row.contract?.status || 'Unknown'}
                                                size="small"
                                                color={row.contract?.status === 'SIGNED' ? 'success' : 'default'}
                                                variant="outlined"
                                                sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title={row.activity?.description || ''}>
                                            <Box>
                                                <Typography variant="body2">{row.activity?.code || 'N/A'}</Typography>
                                            </Box>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label="Active" color="success" size="small" />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Editar">
                                            <IconButton color="primary" onClick={() => handleEdit(row)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <ProductAssociationModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={handleModalSuccess}
                associationToEdit={selectedAssociation}
            />
        </Container>
    );
}
