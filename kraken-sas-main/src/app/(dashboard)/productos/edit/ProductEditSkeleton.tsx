'use client';

import React from 'react';
import {
  Box,
  Paper,
  Skeleton,
  IconButton,
} from '@mui/material';

const ProductEditSkeleton: React.FC = () => {
  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 2, backgroundColor: 'white', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Skeleton 
            variant="circular" 
            width={40} 
            height={40} 
            sx={{ borderRadius: '50%' }}
          />
          <Skeleton 
            variant="rounded" 
            width={150} 
            height={36} 
            sx={{ borderRadius: 1 }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1.5 }}>
        {/* Left Column - Form Fields */}
        <Box sx={{ flex: { xs: '1', md: '0.6' }, order: { xs: 1, md: 1 } }}>
          <Box sx={{ p: { xs: 1.5, sm: 2 }, border: '1px solid #e0e0e0', borderRadius: 1, mb: 1, backgroundColor: 'white' }}>
            {/* Section Title */}
            <Skeleton 
              variant="text" 
              width={150} 
              height={24} 
              sx={{ mb: 1 }}
            />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Nombre */}
              <Box>
                <Skeleton variant="text" width={60} height={16} sx={{ mb: 0.25 }} />
                <Skeleton variant="rounded" width="100%" height={32} sx={{ borderRadius: 1 }} />
              </Box>

              {/* Descripción corta */}
              <Box>
                <Skeleton variant="text" width={120} height={16} sx={{ mb: 0.25 }} />
                <Skeleton variant="rounded" width="100%" height={32} sx={{ borderRadius: 1 }} />
              </Box>

              {/* Descripción larga */}
              <Box>
                <Skeleton variant="text" width={130} height={16} sx={{ mb: 0.25 }} />
                <Skeleton variant="rounded" width="100%" height={80} sx={{ borderRadius: 1 }} />
              </Box>

              {/* Categoría y Subcategoría */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width={70} height={16} sx={{ mb: 0.25 }} />
                  <Skeleton variant="rounded" width="100%" height={32} sx={{ borderRadius: 1 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width={90} height={16} sx={{ mb: 0.25 }} />
                  <Skeleton variant="rounded" width="100%" height={32} sx={{ borderRadius: 1 }} />
                </Box>
              </Box>

              {/* Precio */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                <Box sx={{ flex: { xs: 1, sm: 0.2 } }}>
                  <Skeleton variant="text" width={100} height={16} sx={{ mb: 0.25 }} />
                  <Skeleton variant="rounded" width="100%" height={32} sx={{ borderRadius: 1 }} />
                </Box>
                <Box sx={{ flex: { xs: 1, sm: 0.8 } }}>
                  <Skeleton variant="text" width={100} height={16} sx={{ mb: 0.25 }} />
                  <Skeleton variant="rounded" width="100%" height={32} sx={{ borderRadius: 1 }} />
                </Box>
              </Box>

              {/* Inmersiones y Días del curso */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width={90} height={16} sx={{ mb: 0.25 }} />
                  <Skeleton variant="rounded" width="100%" height={32} sx={{ borderRadius: 1 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width={100} height={16} sx={{ mb: 0.25 }} />
                  <Skeleton variant="rounded" width="100%" height={32} sx={{ borderRadius: 1 }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Right Column - Multimedia */}
        <Box sx={{ flex: { xs: '1', md: '0.4' }, order: { xs: 2, md: 2 } }}>
          <Box sx={{ backgroundColor: 'white', borderRadius: 1, p: { xs: 1.5, sm: 2 }, border: '1px solid #e0e0e0' }}>
            {/* Multimedia Title */}
            <Skeleton 
              variant="text" 
              width={100} 
              height={24} 
              sx={{ mb: 2 }}
            />
            
            {/* Image Placeholder */}
            <Box
              sx={{
                p: 2,
                border: '2px dashed #e0e0e0',
                borderRadius: 2,
                textAlign: 'center',
                backgroundColor: 'white',
              }}
            >
              <Skeleton 
                variant="circular" 
                width={48} 
                height={48} 
                sx={{ mx: 'auto', mb: 1.5 }}
              />
              <Skeleton variant="text" width="80%" height={16} sx={{ mx: 'auto', mb: 1.5 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Skeleton 
                  variant="rounded" 
                  width="100%" 
                  height={32} 
                  sx={{ borderRadius: 1 }}
                />
                <Skeleton 
                  variant="rounded" 
                  width="100%" 
                  height={32} 
                  sx={{ borderRadius: 1 }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductEditSkeleton;

