'use client';

import React from 'react';
import { Box, Paper } from '@mui/material';

export default function DashboardPage() {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Logo Container */}
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          p: 4,
          position: 'relative',
          cursor: 'pointer',
          '&:hover': {
            transform: 'scale(1.02)',
            transition: 'transform 0.2s ease-in-out',
          },
        }}
      >
        {/* Logo Image */}
        <Box
          component="img"
          src="https://s3.makerstech.co/public/space_20250512055823/file_20250515125049.png"
          alt="OCEANOSCUBA Logo"
          sx={{
            maxWidth: { xs: '300px', md: '400px', lg: '500px' },
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </Paper>
    </Box>
  );
}
