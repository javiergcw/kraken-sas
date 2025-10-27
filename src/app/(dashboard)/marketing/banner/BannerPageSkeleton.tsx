'use client';

import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
} from '@mui/material';

const BannerPageSkeleton: React.FC = () => {
  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 6 }, py: 2, backgroundColor: 'white', height: 'calc(100vh - 64px)', overflow: 'auto' }}>
      {/* Header con Tabs */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        {/* Tabs Skeleton */}
        <Box sx={{ 
          display: 'flex', 
          flex: 1, 
          backgroundColor: '#f5f5f5', 
          borderRadius: { xs: 1, sm: 2 }, 
          p: 0.5,
          mb: 2
        }}>
          <Skeleton 
            variant="rounded" 
            sx={{ 
              flex: 1, 
              borderRadius: 1.5,
              height: { xs: 36, sm: 40 }
            }}
          />
          <Box sx={{ width: 8 }} />
          <Skeleton 
            variant="rounded" 
            sx={{ 
              flex: 1, 
              borderRadius: 1.5,
              height: { xs: 36, sm: 40 }
            }}
          />
        </Box>

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: { xs: 0.75, sm: 1 }, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <Skeleton 
            variant="rounded" 
            height={32}
            sx={{ borderRadius: 1, width: { xs: 90, sm: 100 } }}
          />
          <Skeleton 
            variant="rounded" 
            height={32}
            sx={{ borderRadius: 1, width: { xs: 110, sm: 130 } }}
          />
        </Box>
      </Box>

      {/* Barra de búsqueda y filtros */}
      <Box sx={{ display: 'flex', gap: { xs: 0.75, sm: 1 }, mb: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
        <Skeleton 
          variant="rounded" 
          height={40}
          sx={{ borderRadius: 1, flex: { xs: '1 1 100%', sm: '1 1 auto' } }}
        />
        <Skeleton 
          variant="rounded" 
          height={40}
          sx={{ 
            borderRadius: 1, 
            flexShrink: 0,
            width: { xs: 'auto', sm: 90 },
            minWidth: { xs: 'auto', sm: 90 }
          }}
        />
        <Skeleton 
          variant="rounded" 
          height={40}
          sx={{ 
            borderRadius: 1, 
            flexShrink: 0,
            width: { xs: 'auto', sm: 100 },
            minWidth: { xs: 'auto', sm: 100 }
          }}
        />
      </Box>

      {/* Zonas colapsables skeleton (3 zonas) */}
      {[1, 2, 3].map((zona) => (
        <Box key={zona} sx={{ mb: 2 }}>
          {/* Header de la zona */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              py: 1,
              px: 2,
              backgroundColor: '#fafafa',
              borderRadius: 1,
              border: '1px solid #e0e0e0',
            }}
          >
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={150} height={20} />
            <Skeleton 
              variant="rounded" 
              width={90} 
              height={20} 
              sx={{ borderRadius: 3 }}
            />
          </Box>

          {/* Tabla de banners skeleton (solo para la primera zona expandida) */}
          {zona === 1 && (
            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', borderTop: 'none', mt: 0, overflowX: { xs: 'auto', sm: 'visible' } }}>
              <Table size="small" sx={{ minWidth: { xs: 600, sm: 'auto' } }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f8f8' }}>
                    <TableCell sx={{ py: 1 }}>
                      <Skeleton variant="text" width={80} height={18} />
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Skeleton variant="text" width={100} height={18} />
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Skeleton variant="text" width={120} height={18} />
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Skeleton variant="text" width={100} height={18} />
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Skeleton variant="text" width={80} height={18} />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', py: 1 }}>
                      <Skeleton variant="text" width={80} height={18} sx={{ mx: 'auto' }} />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[1, 2].map((banner) => (
                    <TableRow key={banner}>
                      <TableCell sx={{ py: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Skeleton 
                            variant="rounded" 
                            width={50} 
                            height={32} 
                            sx={{ borderRadius: 0.5 }}
                          />
                          <Skeleton variant="text" width={200} height={18} />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Skeleton variant="text" width={100} height={18} />
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Skeleton variant="text" width={90} height={18} />
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Skeleton variant="text" width={90} height={18} />
                      </TableCell>
                      <TableCell sx={{ py: 1 }}>
                        <Skeleton 
                          variant="rounded" 
                          width={70} 
                          height={22} 
                          sx={{ borderRadius: 3 }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', py: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0 }}>
                          <Skeleton 
                            variant="rounded" 
                            width={32} 
                            height={32} 
                            sx={{ borderRadius: '4px 0 0 4px' }}
                          />
                          <Skeleton 
                            variant="rounded" 
                            width={32} 
                            height={32} 
                            sx={{ borderRadius: 0 }}
                          />
                          <Skeleton 
                            variant="rounded" 
                            width={32} 
                            height={32} 
                            sx={{ borderRadius: '0 4px 4px 0' }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default BannerPageSkeleton;

