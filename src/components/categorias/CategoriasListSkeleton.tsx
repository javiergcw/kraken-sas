'use client';

import React from 'react';
import {
  Box,
  Paper,
  Stack,
  Skeleton,
} from '@mui/material';

export default function CategoriasListSkeleton() {
  return (
    <Box>
      {/* Header Skeleton */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Skeleton 
          variant="text" 
          width={150} 
          height={32} 
          sx={{ fontSize: { xs: '18px', sm: '20px' } }}
        />
        <Skeleton 
          variant="rounded" 
          width={100} 
          height={32} 
          sx={{ borderRadius: 1 }}
        />
      </Box>

      {/* Lista de Categorías Skeleton */}
      <Stack spacing={1}>
        {[1, 2, 3].map((index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              border: "1px solid #e5e5e5",
              borderRadius: 1,
              overflow: "hidden",
              bgcolor: "white",
            }}
          >
            {/* Categoría Principal Skeleton */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 1.25,
                px: { xs: 1.5, sm: 2 },
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                gap: { xs: 1, sm: 0 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: { xs: '1 1 100%', sm: '1 1 auto' } }}>
                <Skeleton 
                  variant="rounded" 
                  width={{ xs: 28, sm: 32 }} 
                  height={{ xs: 28, sm: 32 }} 
                  sx={{ borderRadius: 1, flexShrink: 0 }}
                />
                <Box sx={{ lineHeight: 1, minWidth: 0, flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={20} sx={{ mb: 0.3 }} />
                  <Skeleton variant="text" width="40%" height={16} />
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                <Skeleton 
                  variant="rounded" 
                  width={{ xs: 90, sm: 110 }} 
                  height={28} 
                  sx={{ borderRadius: 0.5 }}
                />
                <Skeleton 
                  variant="rounded" 
                  width={{ xs: 28, sm: 32 }} 
                  height={28} 
                  sx={{ borderRadius: 0.5 }}
                />
                <Skeleton 
                  variant="rounded" 
                  width={{ xs: 28, sm: 32 }} 
                  height={28} 
                  sx={{ borderRadius: 0.5 }}
                />
              </Box>
            </Box>

            {/* Subcategorías Skeleton */}
            {[1, 2].map((subIndex) => (
              <Box
                key={subIndex}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  py: 1.25,
                  px: { xs: 1.5, sm: 2 },
                  pl: { xs: 3, sm: 5 },
                  borderTop: "1px solid #f5f5f5",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, minWidth: 0, flex: 1 }}>
                  <Skeleton 
                    variant="rounded" 
                    width={{ xs: 24, sm: 28 }} 
                    height={{ xs: 24, sm: 28 }} 
                    sx={{ borderRadius: 1, flexShrink: 0 }}
                  />
                  <Box sx={{ lineHeight: 1, minWidth: 0, flex: 1 }}>
                    <Skeleton variant="text" width="50%" height={18} sx={{ mb: 0.3 }} />
                    <Skeleton variant="text" width="35%" height={14} />
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                  <Skeleton 
                    variant="rounded" 
                    width={{ xs: 28, sm: 32 }} 
                    height={28} 
                    sx={{ borderRadius: 0.5 }}
                  />
                  <Skeleton 
                    variant="rounded" 
                    width={{ xs: 28, sm: 32 }} 
                    height={28} 
                    sx={{ borderRadius: 0.5 }}
                  />
                </Box>
              </Box>
            ))}
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}

