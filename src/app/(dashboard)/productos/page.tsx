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
import { productController, categoryController, subcategoryController } from '@/components/core';
import { ProductDto } from '@/components/core/products/dto/ProductResponse.dto';

const ProductsPage: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [categories, setCategories] = useState<{id: string; name: string}[]>([]);
  const [subcategories, setSubcategories] = useState<{id: string; name: string; category_id: string}[]>([]);

  // Cargar productos, categorías y subcategorías
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar productos
      const productsResponse = await productController.getAll();
      if (productsResponse?.success && productsResponse.data) {
        setProducts(productsResponse.data);
      }
      
      // Cargar categorías
      const categoriesResponse = await categoryController.getAll();
      if (categoriesResponse?.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data.map(cat => ({ id: cat.id, name: cat.name })));
      }
      
      // Cargar subcategorías
      const subcategoriesResponse = await subcategoryController.getAll();
      if (subcategoriesResponse?.success && subcategoriesResponse.data) {
        setSubcategories(subcategoriesResponse.data.map(sub => ({ 
          id: sub.id, 
          name: sub.name, 
          category_id: sub.category_id 
        })));
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper para obtener nombre de categoría
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Sin categoría';
  };

  // Helper para obtener nombre de subcategoría
  const getSubcategoryName = (subcategoryId: string) => {
    const subcategory = subcategories.find(sub => sub.id === subcategoryId);
    return subcategory?.name || 'Sin subcategoría';
  };

  // Helper para formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Helper para formatear precio en USD
  const formatPriceUSD = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCategoryName(product.category_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getSubcategoryName(product.subcategory_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (event: React.ChangeEvent<unknown> | null, page: number) => {
    setCurrentPage(page);
  };

  const handleViewProduct = (product: ProductDto) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (product: ProductDto) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      const response = await productController.delete(productToDelete.id);
      if (response?.success) {
        // Recargar productos
        await loadData();
        handleCloseDeleteModal();
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
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
                      src={product.photo || '/placeholder.svg'}
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
                    label={getCategoryName(product.category_id)}
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
                    {getSubcategoryName(product.subcategory_id)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>
                    {formatPrice(product.price)}
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
          fontWeight: 'bold',
          color: '#424242',
          fontSize: '18px',
        }}>
          {selectedProduct?.name}
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
                src={selectedProduct.photo || '/placeholder.svg'}
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
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#424242', fontSize: '18px' }}>
                    {selectedProduct.name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#757575', lineHeight: 1.6 }}>
                    {selectedProduct.short_description || selectedProduct.long_description || 'Sin descripción'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#424242' }}>
                    {formatPriceUSD(selectedProduct.price)}
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
          fontWeight: 'bold',
          color: '#424242',
          fontSize: '16px',
        }}>
          Eliminar Producto
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
