'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';
import Dashboard from './Dashboard';
import ProductsPage from '../../app/dashboard/productos/page';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: 'white' }}>
      {/* Sidebar */}
      <Box sx={{ position: 'relative' }}>
        <Sidebar open={sidebarOpen} onToggle={handleMenuClick} />
        
        {/* Clickable area on the right edge of sidebar */}
        {sidebarOpen && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: -10,
              width: 10,
              height: '100%',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              zIndex: 1300,
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: 'white',
          transition: 'all 0.3s ease',
          width: sidebarOpen ? 'calc(100% - 280px)' : '100%',
        }}
      >
        {/* Header */}
        <Header onMenuClick={handleMenuClick} />

        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: 'white',
          }}
        >
          {children || <Dashboard />}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
