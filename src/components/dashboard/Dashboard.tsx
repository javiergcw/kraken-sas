'use client';

import React from 'react';
import {
  Box,
  Paper,
} from '@mui/material';
import { useUser } from '@/contexts/UserContext';

const Dashboard: React.FC = () => {
  const { user, loading } = useUser();
  const companyLogo = user?.company_logo || null;
  const companyName = user?.company_name || '';

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
      {!loading && companyLogo && (
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
            src={companyLogo}
            alt={companyName ? `${companyName} Logo` : 'Company Logo'}
            sx={{
              maxWidth: { xs: '300px', md: '400px', lg: '500px' },
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </Paper>
      )}
    </Box>
  );
};

export default Dashboard;
