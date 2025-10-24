'use client';

import React from 'react';
import {
  Box,
  IconButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
} from '@mui/icons-material';
import DynamicBreadcrumbs from './DynamicBreadcrumbs';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMenuClick();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        backgroundColor: 'white',
        borderBottom: '1px solid #E0E0E0',
        minHeight: 64,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <IconButton
        onClick={handleMenuClick}
        sx={{
          mr: 2,
          color: '#757575',
          backgroundColor: '#F5F5F5',
          '&:hover': {
            backgroundColor: '#E0E0E0',
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      <DynamicBreadcrumbs onMenuClick={onMenuClick} />
    </Box>
  );
};

export default Header;
