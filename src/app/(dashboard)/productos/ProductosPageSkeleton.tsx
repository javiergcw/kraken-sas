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

const ProductosPageSkeleton: React.FC = () => {
  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 6 }, py: 2, backgroundColor: 'white', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 1.5, 
          flexWrap: { xs: 'wrap', sm: 'nowrap' }, 
          gap: { xs: 1.5, sm: 0 } 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
            <Skeleton 
              variant="text" 
              width={150} 
              height={32} 
            />
            <Skeleton 
              variant="rounded" 
              width={90} 
              sx={{ borderRadius: 3, height: { xs: 22, sm: 24 } }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 }, width: { xs: '100%', sm: 'auto' } }}>
            <Skeleton 
              variant="rounded" 
              height={32} 
              sx={{ borderRadius: 1, flex: { xs: 1, sm: '0 0 auto' }, width: { xs: '50%', sm: 100 } }}
            />
            <Skeleton 
              variant="rounded" 
              height={32} 
              sx={{ borderRadius: 1, flex: { xs: 1, sm: '0 0 auto' }, width: { xs: '50%', sm: 110 } }}
            />
          </Box>
        </Box>

        {/* Search Bar Skeleton */}
        <Skeleton 
          variant="rounded" 
          height={40} 
          sx={{ borderRadius: 1, width: { xs: '100%', sm: '70%' } }}
        />
      </Box>

      {/* Table Skeleton */}
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', overflowX: { xs: 'auto', sm: 'visible' } }}>
        <Table size="small" sx={{ minWidth: { xs: 650, sm: 'auto' } }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f8f8' }}>
              <TableCell sx={{ py: 0.5 }}>
                <Skeleton variant="text" width={80} height={20} />
              </TableCell>
              <TableCell sx={{ py: 0.5 }}>
                <Skeleton variant="text" width={90} height={20} />
              </TableCell>
              <TableCell sx={{ py: 0.5 }}>
                <Skeleton variant="text" width={110} height={20} />
              </TableCell>
              <TableCell sx={{ py: 0.5 }}>
                <Skeleton variant="text" width={70} height={20} />
              </TableCell>
              <TableCell sx={{ textAlign: 'center', py: 0.5 }}>
                <Skeleton variant="text" width={80} height={20} sx={{ mx: 'auto' }} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <TableRow key={index}>
                <TableCell sx={{ py: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Skeleton 
                      variant="rounded" 
                      width={32} 
                      height={32} 
                      sx={{ borderRadius: 1 }}
                    />
                    <Skeleton variant="text" width={180} height={20} />
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 0.5 }}>
                  <Skeleton 
                    variant="rounded" 
                    width={100} 
                    height={20} 
                    sx={{ borderRadius: 3 }}
                  />
                </TableCell>
                <TableCell sx={{ py: 0.5 }}>
                  <Skeleton variant="text" width={140} height={20} />
                </TableCell>
                <TableCell sx={{ py: 0.5 }}>
                  <Skeleton variant="text" width={80} height={20} />
                </TableCell>
                <TableCell sx={{ textAlign: 'center', py: 0.5 }}>
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

      {/* Pagination Skeleton */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mt: 2, 
        flexWrap: { xs: 'wrap', sm: 'nowrap' }, 
        gap: { xs: 1.5, sm: 0 } 
      }}>
        <Skeleton 
          variant="text" 
          height={20} 
          sx={{ order: { xs: 2, sm: 1 }, width: { xs: '100%', sm: 250 } }}
        />
        <Box sx={{ 
          display: 'flex', 
          gap: 0.5, 
          order: { xs: 1, sm: 2 }, 
          width: { xs: '100%', sm: 'auto' }, 
          justifyContent: { xs: 'center', sm: 'flex-end' } 
        }}>
          <Skeleton 
            variant="rounded" 
            height={32} 
            sx={{ borderRadius: '4px', width: { xs: 70, sm: 80 } }}
          />
          {[1, 2].map((page) => (
            <Skeleton 
              key={page}
              variant="rounded" 
              height={32} 
              sx={{ borderRadius: '4px', width: { xs: 32, sm: 36 } }}
            />
          ))}
          <Skeleton 
            variant="rounded" 
            height={32} 
            sx={{ borderRadius: '4px', width: { xs: 70, sm: 80 } }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProductosPageSkeleton;

