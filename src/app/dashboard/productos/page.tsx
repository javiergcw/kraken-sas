'use client';

import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

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

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return (
    <Box sx={{ p: 2, backgroundColor: 'white', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#424242' }}>
              Productos
            </Typography>
            <Chip
              label={`${filteredProducts.length} registros`}
              size="small"
              sx={{
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                fontWeight: 'medium',
                fontSize: '12px',
                height: 24,
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="small"
              onClick={() => router.push('/dashboard/productos/create')}
              sx={{
                backgroundColor: '#424242',
                fontSize: '14px',
                px: 2,
                py: 0.5,
                '&:hover': { backgroundColor: '#303030' },
              }}
            >
              Nuevo
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              size="small"
              sx={{
                borderColor: '#e0e0e0',
                color: '#424242',
                fontSize: '14px',
                px: 2,
                py: 0.5,
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
            startAdornment: <SearchIcon sx={{ color: '#757575', mr: 1, fontSize: 20 }} />,
          }}
          sx={{
            maxWidth: '70%',
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
              fontSize: '14px',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#bdbdbd',
              },
            },
          }}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f8f8' }}>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 1, fontSize: '14px' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 1, fontSize: '14px' }}>Categoría</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 1, fontSize: '14px' }}>Subcategoría</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 1, fontSize: '14px' }}>Precio</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#424242', textAlign: 'center', py: 1, fontSize: '14px' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentProducts.map((product) => (
              <TableRow key={product.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell sx={{ py: 1 }}>
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
                <TableCell sx={{ py: 1 }}>
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
                <TableCell sx={{ py: 1 }}>
                  <Typography variant="body2" sx={{ color: '#757575', fontSize: '14px' }}>
                    {product.subcategory}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>
                    {product.price}
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: 'center', py: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    <IconButton size="small" sx={{ color: '#757575', p: 0.5 }}>
                      <ViewIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#757575', p: 0.5 }}>
                      <EditIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#f44336', p: 0.5 }}>
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography variant="body2" sx={{ color: '#757575', fontSize: '14px' }}>
          Mostrando {startIndex + 1} - {Math.min(endIndex, filteredProducts.length)} de {filteredProducts.length} registros
        </Typography>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size="small"
        />
      </Box>
    </Box>
  );
};

export default ProductsPage;
