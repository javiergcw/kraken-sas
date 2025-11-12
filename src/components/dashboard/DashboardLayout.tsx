'use client';

import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';
import Dashboard from './Dashboard';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  // Mostrar header siempre, excepto que se pase explícitamente children === null
  const showHeader = children !== null;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mounted, setMounted] = useState(false);
  
  // Estado del sidebar - persistente con localStorage
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Solo para mobile - permite abrir/cerrar
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Cargar el estado del sidebar desde localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      setSidebarOpen(JSON.parse(savedState));
    }
    setMounted(true);
  }, []);

  // Guardar el estado del sidebar en localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
    }
  }, [sidebarOpen, mounted]);

  const handleMenuClick = () => {
    if (isMobile) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // Evitar flash durante hidratación
  if (!mounted) {
    return (
      <Box sx={{ 
        width: '100vw', 
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        overflow: 'hidden'
      }}>
        {/* Sidebar visible en loading */}
        {!isMobile && (
          <Sidebar open={sidebarOpen} onToggle={handleMenuClick} isMobile={false} />
        )}
        
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          marginLeft: isMobile ? 0 : (sidebarOpen ? '240px' : '60px'),
        transition: 'margin-left 0.3s ease',
        }}>
          {showHeader && <Header onMenuClick={handleMenuClick} />}
          <Box sx={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: 'white'
          }}>
            {children || <Dashboard />}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100vw', 
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      backgroundColor: 'white',
      overflow: 'hidden'
    }}>
      {/* Sidebar Desktop - puede expandir/colapsar */}
      {!isMobile && (
        <Sidebar open={sidebarOpen} onToggle={handleMenuClick} isMobile={false} />
      )}

      {/* Sidebar Mobile - sí se puede cerrar */}
      {isMobile && (
        <Sidebar open={mobileSidebarOpen} onToggle={handleMenuClick} isMobile={true} />
      )}

      {/* Contenido Principal - con margen dinámico según estado del sidebar */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          backgroundColor: 'white',
          marginLeft: isMobile ? 0 : (sidebarOpen ? '240px' : '60px'),
          transition: 'margin-left 0.3s ease',
          position: 'relative',
          zIndex: 1,
        }}
      >
          {/* Header - solo mostrar si hay children (páginas específicas) */}
        {showHeader && <Header onMenuClick={handleMenuClick} />}

        {/* Área de Contenido con Scroll */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: 'white',
            minHeight: 0,
          }}
        >
          {children || <Dashboard />}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
