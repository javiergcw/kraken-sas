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
  Add as AddIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Inventory as InventoryIcon,
  Close as CloseIcon,
  DeleteOutlineOutlined as DeleteOutlineOutlinedIcon,
  ModeEditOutlineOutlined as ModeEditOutlineOutlinedIcon,
  CenterFocusStrongOutlined as CenterFocusStrongOutlinedIcon,
} from '@mui/icons-material';
import ProductosPageSkeleton from './ProductosPageSkeleton';

interface Product {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  price: string;
  image: string;
}

const ProductsPage: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Simular carga de datos (puedes reemplazar esto con una llamada API real)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Datos de ejemplo de productos
  const products: Product[] = [
    {
      id: 1,
      name: 'Discover Scuba Diving - Minicurso',
      category: 'Aventuras',
      subcategory: 'Principales',
      price: '$410.000',
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: 2,
      name: 'PADI Divemaster',
      category: 'Otros servicios',
      subcategory: '¡Formación PADI a otro nivel!',
      price: '$0',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: 3,
      name: 'PADI Advanced Open Water Diver',
      category: 'Otros servicios',
      subcategory: '¿Ya eres buzo?',
      price: '$1.560.000',
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: 4,
      name: 'Emergency First Response (EFR)',
      category: 'Otros servicios',
      subcategory: '¡Formación PADI a otro nivel!',
      price: '$450.000',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: 5,
      name: 'Control de Especie Invasora: Pez León',
      category: 'Otros servicios',
      subcategory: '¿Ya eres buzo?',
      price: '$750.000',
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: 6,
      name: 'Dive Like a GIRL- Especialidad Distintiva',
      category: 'Otros servicios',
      subcategory: '¡Formación PADI a otro nivel!',
      price: '$620.000',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: 7,
      name: 'Curso Reactivate / Refresh',
      category: 'Aventuras',
      subcategory: '#SomosOceano',
      price: '$350.000',
      image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: 8,
      name: 'PADI Rescue Diver + EFR',
      category: 'Otros servicios',
      subcategory: '¡Formación PADI a otro nivel!',
      price: '$1.990.000',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop&crop=face',
    },
    {
      id: 9,
      name: 'PADI Rescue Diver + EFR',
      category: 'Otros servicios',
      subcategory: '¡Formación PADI a otro nivel!',
      price: '$1.990.000',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop&crop=face',
    },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (event: React.ChangeEvent<unknown> | null, page: number) => {
    setCurrentPage(page);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = () => {
    // Aquí iría la lógica para eliminar el producto
    console.log('Eliminando producto:', productToDelete);
    handleCloseDeleteModal();
  };

  // Mostrar skeleton mientras carga
  if (loading) {
    return <ProductosPageSkeleton />;
  }

  // Si no hay productos, mostrar estado vacío
  if (filteredProducts.length === 0) {
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
          maxWidth: { xs: '340px', sm: '400px' },
          px: { xs: 2.5, sm: 4 }
        }}>
          {/* Icono */}
          <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
            <InventoryIcon 
              sx={{ 
                fontSize: { xs: 70, sm: 80 }, 
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
              mb: { xs: 1.5, sm: 2 },
              fontSize: { xs: '22px', sm: '24px' }
            }}
          >
            No hay productos
          </Typography>

          {/* Descripción */}
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#757575',
              mb: { xs: 3, sm: 4 },
              fontSize: { xs: '15px', sm: '16px' },
              lineHeight: 1.5
            }}
          >
            Comienza abasteciendo tu tienda con productos que tus clientes amarán
          </Typography>

          {/* Botón Añadir producto */}
          <Button
            variant="contained"
            onClick={() => router.push('/productos/create')}
            sx={{
              backgroundColor: '#424242',
              fontSize: { xs: '15px', sm: '16px' },
              px: { xs: 3, sm: 4 },
              py: { xs: 1.25, sm: 1.5 },
              borderRadius: 2,
              textTransform: 'capitalize',
              fontWeight: 'medium',
              boxShadow: 'none',
              width: { xs: '100%', sm: 'auto' },
              '&:hover': { 
                backgroundColor: '#303030',
                boxShadow: 'none'
              },
            }}
          >
            Añadir producto
          </Button>

          {/* Enlace de ayuda */}
          <Box sx={{ mt: { xs: 3, sm: 4 } }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#757575',
                fontSize: { xs: '13px', sm: '14px' },
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
              Productos
            </Typography>
            <Chip
              label={`${filteredProducts.length} registros`}
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
              variant="contained"
              startIcon={<AddIcon sx={{ fontSize: { xs: 18, sm: 20 }, display: { xs: 'none', sm: 'flex' } }} />}
              size="small"
              onClick={() => router.push('/productos/create')}
              sx={{
                backgroundColor: '#424242',
                fontSize: { xs: '13px', sm: '14px' },
                px: { xs: 1.5, sm: 2 },
                py: 0.5,
                textTransform: 'capitalize',
                flex: { xs: 1, sm: '0 0 auto' },
                '&:hover': { backgroundColor: '#303030' },
              }}
            >
              Nuevo
            </Button>
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
        <Table size="small" sx={{ minWidth: { xs: 650, sm: 'auto' } }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f8f8' }}>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Categoría</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Subcategoría</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Precio</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242', textAlign: 'center', py: 0.5, fontSize: '14px' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentProducts.map((product) => (
              <TableRow key={product.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell sx={{ py: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      src={product.image}
                      alt={product.name}
                      sx={{ width: 32, height: 32, borderRadius: 1 }}
                      variant="square"
                    />
                    <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '14px' }}>
                      {product.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 0.5 }}>
                  <Chip
                    label={product.category}
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
                  <Typography variant="body2" sx={{ color: '#757575', fontSize: '14px' }}>
                    {product.subcategory}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>
                    {product.price}
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: 'center', py: 0.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0 }}>
                    <IconButton 
                      size="small"
                      onClick={() => handleViewProduct(product)}
                      sx={{ 
                        border: '1px solid #e0e0e0',
                        borderRight: 'none',
                        borderRadius: '4px 0 0 4px',
                        color: '#757575',
                        p: 1,
                        textTransform: 'capitalize',
                        '&:hover': { 
                          backgroundColor: '#f5f5f5',
                          borderColor: '#bdbdbd'
                        },
                      }}
                    >
                      <CenterFocusStrongOutlinedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton 
                      size="small"
                      onClick={() => router.push(`/productos/edit/${product.id}`)}
                      sx={{ 
                        border: '1px solid #e0e0e0',
                        borderRadius: 0,
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
                    <IconButton 
                      size="small"
                      onClick={() => handleDeleteProduct(product)}
                      sx={{ 
                        border: '1px solid #f44336',
                        borderLeft: 'none',
                        borderRadius: '0 4px 4px 0',
                        backgroundColor: '#f44336',
                        color: 'white',
                        p: 1,
                        textTransform: 'capitalize',
                        '&:hover': { 
                          backgroundColor: '#ff5252',
                          borderColor: '#ff5252'
                        },
                      }}
                    >
                      <DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }} />
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
          Mostrando {startIndex + 1} - {Math.min(endIndex, filteredProducts.length)} de {filteredProducts.length} registros
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

      {/* Modal de Ver Producto */}
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
            {selectedProduct?.name}
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
          {selectedProduct && (
            <Box>
              {/* Imagen del producto */}
              <Box
                component="img"
                src={selectedProduct.image}
                alt={selectedProduct.name}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 1,
                  mb: 2,
                  objectFit: 'cover',
                }}
              />

              {/* Información del producto */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#424242', mb: 0.5 }}>
                    Precio: {selectedProduct.price}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#424242', mb: 0.5 }}>
                    Categoría: {selectedProduct.category}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#424242', mb: 0.5 }}>
                    Subcategoría: {selectedProduct.subcategory}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Eliminar Producto */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            maxWidth: '420px',
            padding: '12px',
          },
        }}
      >
        <DialogTitle sx={{ 
          pb: 0.5,
          px: 1.5,
          pt: 1,
        }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#424242', fontSize: '16px' }}>
            Eliminar Producto
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: 1.5, py: 1 }}>
          <Typography variant="body2" sx={{ color: '#424242', fontSize: '13px', lineHeight: 1.4 }}>
            ¿Estás seguro de que deseas eliminar el producto{' '}
            <Typography component="span" sx={{ fontWeight: 'bold', color: '#f44336', fontSize: '13px' }}>
              {productToDelete?.name}
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
            onClick={handleCloseDeleteModal}
            sx={{
              borderColor: '#e0e0e0',
              color: '#424242',
              textTransform: 'capitalize',
              boxShadow: 'none',
              fontSize: '13px',
              px: 2,
              py: 0.5,
              '&:hover': {
                borderColor: '#bdbdbd',
                backgroundColor: '#f5f5f5',
              },
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
              boxShadow: 'none',
              fontSize: '13px',
              px: 2,
              py: 0.5,
              '&:hover': {
                backgroundColor: '#d32f2f',
                boxShadow: 'none',
              },
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsPage;
