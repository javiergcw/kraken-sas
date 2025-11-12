'use client';

import React from 'react';
import {
  Box,
  Paper,
  Stack,
  Skeleton,
  useMediaQuery,
  useTheme,
} from '@mui/material';

const ConfiguracionPageSkeleton: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '100%', height: '100%', backgroundColor: 'white' }}>
      {/* Contenido Principal */}
      <Box sx={{ flex: 1, p: { xs: 2, sm: 3 }, overflowY: 'auto', order: { xs: 2, md: 1 }, height: '100%' }}>
        {/* Título */}
        <Skeleton 
          variant="text" 
          width={220} 
          height={32} 
          sx={{ mb: { xs: 2, sm: 3 }, fontSize: { xs: '18px', sm: '20px' } }}
        />

        <Paper sx={{ p: { xs: 2, sm: 3 }, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
          <Stack spacing={3}>
            {/* Campo 1 - Nombre del sitio web */}
            <Box>
              <Skeleton variant="text" width={150} height={20} sx={{ mb: 1 }} />
              <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: 1 }} />
              <Skeleton variant="text" width="80%" height={16} sx={{ mt: 0.5 }} />
            </Box>

            {/* Campo 2 - Dirección */}
            <Box>
              <Skeleton variant="text" width={120} height={20} sx={{ mb: 1 }} />
              <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: 1 }} />
              <Skeleton variant="text" width="70%" height={16} sx={{ mt: 0.5 }} />
            </Box>

            {/* Campo 3 - Contacto */}
            <Box>
              <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
              <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: 1 }} />
              <Skeleton variant="text" width="75%" height={16} sx={{ mt: 0.5 }} />
            </Box>

            {/* Campo 4 - Icono (imagen) */}
            <Box>
              <Skeleton variant="text" width={80} height={20} sx={{ mb: 1 }} />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1.5, sm: 2 },
                  p: { xs: 1.5, sm: 2 },
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  backgroundColor: 'white',
                }}
              >
                <Skeleton 
                  variant="rounded" 
                  sx={{ 
                    width: { xs: 40, sm: 48 }, 
                    height: { xs: 40, sm: 48 },
                    borderRadius: 1, 
                    flexShrink: 0 
                  }}
                />
                <Skeleton 
                  variant="rounded" 
                  width={140} 
                  height={36} 
                  sx={{ borderRadius: 0.5 }}
                />
              </Box>
              <Skeleton variant="text" width="85%" height={16} sx={{ mt: 0.5 }} />
            </Box>

            {/* Campo 5 - Logotipo (imagen) */}
            <Box>
              <Skeleton variant="text" width={90} height={20} sx={{ mb: 1 }} />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1.5, sm: 2 },
                  p: { xs: 1.5, sm: 2 },
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  backgroundColor: 'white',
                }}
              >
                <Skeleton 
                  variant="rounded" 
                  sx={{ 
                    width: { xs: 40, sm: 48 }, 
                    height: { xs: 40, sm: 48 },
                    borderRadius: 1, 
                    flexShrink: 0 
                  }}
                />
                <Skeleton 
                  variant="rounded" 
                  width={140} 
                  height={36} 
                  sx={{ borderRadius: 0.5 }}
                />
              </Box>
              <Skeleton variant="text" width="80%" height={16} sx={{ mt: 0.5 }} />
            </Box>

            {/* Campo 6 - Isotipo (imagen) */}
            <Box>
              <Skeleton variant="text" width={85} height={20} sx={{ mb: 1 }} />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1.5, sm: 2 },
                  p: { xs: 1.5, sm: 2 },
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  backgroundColor: 'white',
                }}
              >
                <Skeleton 
                  variant="rounded" 
                  sx={{ 
                    width: { xs: 40, sm: 48 }, 
                    height: { xs: 40, sm: 48 },
                    borderRadius: 1, 
                    flexShrink: 0 
                  }}
                />
                <Skeleton 
                  variant="rounded" 
                  width={140} 
                  height={36} 
                  sx={{ borderRadius: 0.5 }}
                />
              </Box>
              <Skeleton variant="text" width="90%" height={16} sx={{ mt: 0.5 }} />
            </Box>

            {/* Campo 7 - Color primario */}
            <Box>
              <Skeleton variant="text" width={130} height={20} sx={{ mb: 1 }} />
              <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, alignItems: 'center' }}>
                <Skeleton 
                  variant="rounded" 
                  sx={{ 
                    width: { xs: 40, sm: 48 }, 
                    height: { xs: 36, sm: 40 },
                    borderRadius: 1, 
                    flexShrink: 0 
                  }}
                />
                <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: 0.5 }} />
              </Box>
              <Skeleton variant="text" width="65%" height={16} sx={{ mt: 0.5 }} />
            </Box>

            {/* Campo 8 - Color secundario */}
            <Box>
              <Skeleton variant="text" width={140} height={20} sx={{ mb: 1 }} />
              <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, alignItems: 'center' }}>
                <Skeleton 
                  variant="rounded" 
                  sx={{ 
                    width: { xs: 40, sm: 48 }, 
                    height: { xs: 36, sm: 40 },
                    borderRadius: 1, 
                    flexShrink: 0 
                  }}
                />
                <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: 0.5 }} />
              </Box>
              <Skeleton variant="text" width="70%" height={16} sx={{ mt: 0.5 }} />
            </Box>

            {/* Campo 9 - Términos y condiciones */}
            <Box>
              <Skeleton variant="text" width={180} height={20} sx={{ mb: 1 }} />
              <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: 1 }} />
              <Skeleton variant="text" width="75%" height={16} sx={{ mt: 0.5 }} />
            </Box>

            {/* Campo 10 - Política de privacidad */}
            <Box>
              <Skeleton variant="text" width={170} height={20} sx={{ mb: 1 }} />
              <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: 1 }} />
              <Skeleton variant="text" width="70%" height={16} sx={{ mt: 0.5 }} />
            </Box>

            {/* Botón de guardar */}
            <Box sx={{ pt: 2 }}>
              <Skeleton 
                variant="rounded" 
                height={40} 
                sx={{ 
                  width: { xs: '100%', sm: 200 },
                  borderRadius: 1 
                }}
              />
            </Box>
          </Stack>
        </Paper>
      </Box>

      {/* Sidebar de pestañas */}
      <Box
        sx={{
          width: { xs: '100%', md: 200 },
          backgroundColor: '#f5f5f5',
          borderLeft: { xs: 'none', md: '1px solid #e0e0e0' },
          borderBottom: { xs: '1px solid #e0e0e0', md: 'none' },
          p: { xs: 1, sm: 2 },
          order: { xs: 1, md: 2 },
          height: { xs: 'auto', md: '100%' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'row', md: 'column' },
            gap: { xs: 0, md: 1 },
            justifyContent: { xs: 'space-around', md: 'flex-start' },
          }}
        >
          {[1, 2, 3].map((index) => (
            <Skeleton
              key={index}
              variant="rounded"
              sx={{ 
                width: { xs: '30%', md: '100%' },
                height: { xs: 48, md: 40 },
                borderRadius: { xs: 0, md: 1 },
                flexShrink: { xs: 0, md: 1 },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ConfiguracionPageSkeleton;

