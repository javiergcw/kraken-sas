'use client';

import React from 'react';
import {
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
} from '@mui/icons-material';
import DynamicBreadcrumbs from './DynamicBreadcrumbs';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMenuClick();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 0,
        px: 1.5,
        backgroundColor: 'white',
        borderBottom: '1px solid #E0E0E0',
        minHeight: 48,
        position: 'relative',
        zIndex: 1100,
      }}
    >
      {/* Botón de menú visible siempre */}
      <IconButton
        onClick={handleMenuClick}
        sx={{
          mr: 1.5,
          color: '#757575',
          backgroundColor: '#F5F5F5',
          width: 32,
          height: 32,
          '&:hover': {
            backgroundColor: '#E0E0E0',
          },
          '&:active': {
            backgroundColor: '#D0D0D0',
          },
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <MenuIcon sx={{ fontSize: 18 }} />
      </IconButton>

      <DynamicBreadcrumbs onMenuClick={onMenuClick} />
    </Box>
  );
};

export default Header;
