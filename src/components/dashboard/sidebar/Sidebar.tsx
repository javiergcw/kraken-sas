'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Collapse,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  HomeOutlined,
  ExpandMore,
  ExpandLess,
  MenuBookOutlined,
  SettingsOutlined,
  KeyboardArrowDown,
  WorkOutline,
  AssignmentIndOutlined,
  CampaignOutlined,
} from '@mui/icons-material';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onToggle, isMobile = false }) => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Determinar qué sección debe estar abierta según la ruta actual
  const isMarketingRoute = pathname.startsWith('/marketing');
  const isHerramientasRoute = pathname.startsWith('/herramientas');
  const isProyectosRoute = pathname.startsWith('/contract');
  
  const [principalOpen, setPrincipalOpen] = useState(!isMarketingRoute && !isHerramientasRoute && !isProyectosRoute);
  const [marketingOpen, setMarketingOpen] = useState(isMarketingRoute);
  const [herramientasOpen, setHerramientasOpen] = useState(isHerramientasRoute);
  const [proyectosOpen, setProyectosOpen] = useState(isProyectosRoute);

  // Actualizar el estado cuando cambia la ruta
  useEffect(() => {
    if (pathname.startsWith('/marketing')) {
      setMarketingOpen(true);
      setPrincipalOpen(false);
      setHerramientasOpen(false);
      setProyectosOpen(false);
    } else if (pathname.startsWith('/herramientas')) {
      setHerramientasOpen(true);
      setPrincipalOpen(false);
      setMarketingOpen(false);
      setProyectosOpen(false);
    } else if (pathname.startsWith('/contract')) {
      setProyectosOpen(true);
      setPrincipalOpen(false);
      setMarketingOpen(false);
      setHerramientasOpen(false);
    } else {
      setPrincipalOpen(true);
      setMarketingOpen(false);
      setHerramientasOpen(false);
      setProyectosOpen(false);
    }
  }, [pathname]);

  // Ancho dinámico: 240px expandido, 60px colapsado
  const drawerWidth = isMobile ? 240 : (open ? 240 : 60);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const menuItems = [
    {
      title: 'Principal',
      icon: <HomeOutlined sx={{ fontSize: 18 }} />,
      expanded: principalOpen,
      onToggle: () => setPrincipalOpen(!principalOpen),
      active: !isMarketingRoute && !isHerramientasRoute && !isProyectosRoute,
      children: [
        { title: 'Dashboard', path: '/dashboard', active: pathname === '/dashboard' },
        { title: 'Productos', path: '/productos', active: pathname.startsWith('/productos') },
        { title: 'Categorías', path: '/categorias', active: pathname.startsWith('/categorias') },
        { title: 'Historial de ventas', path: '/historial', active: pathname.startsWith('/historial') },
        { title: 'Reservas', path: '/reservation', active: pathname.startsWith('/reservation') },
      ],
    },
    {
      title: 'Prospectos',
      icon: <AssignmentIndOutlined sx={{ fontSize: 18 }} />,
      expanded: proyectosOpen,
      onToggle: () => setProyectosOpen(!proyectosOpen),
      active: isProyectosRoute,
      children: [
        { title: 'Contratos', path: '/contract', active: pathname.startsWith('/contract') },
      ],
    },
    {
      title: 'Marketing | publicidad',
      icon: <CampaignOutlined sx={{ fontSize: 18 }} />,
      expanded: marketingOpen,
      onToggle: () => setMarketingOpen(!marketingOpen),
      active: isMarketingRoute,
      children: [
        { title: 'Banner', path: '/marketing/banner', active: pathname.startsWith('/marketing/banner') },
      ],
    },
    {
      title: 'Herramientas',
      icon: <SettingsOutlined sx={{ fontSize: 18 }} />,
      expanded: herramientasOpen,
      onToggle: () => setHerramientasOpen(!herramientasOpen),
      active: isHerramientasRoute,
      children: [
        { title: 'Configuración', path: '/herramientas/configuracion', active: pathname.startsWith('/herramientas/configuracion') },
      ],
    },
  ];

  // Expandido si es mobile O si open es true
  const isExpanded = isMobile ? true : open;

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box 
        sx={{ 
          p: 1.5, 
          backgroundColor: 'white',
          cursor: !isExpanded && !isMobile ? 'pointer' : 'default',
          '&:hover': !isExpanded && !isMobile ? { backgroundColor: '#F5F5F5' } : {},
        }}
        onClick={() => {
          if (!isExpanded && !isMobile) {
            onToggle();
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: isExpanded ? 0.5 : 0 }}>
          <Avatar sx={{ width: 28, height: 28, backgroundColor: '#E0E0E0', mr: isExpanded ? 0.75 : 0, borderRadius: '4px' }}>
            <Typography variant="h6" sx={{ color: 'white', fontSize: '12px' }}>
              N
            </Typography>
          </Avatar>
          {isExpanded && (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 32 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px', lineHeight: 1.1 }}>
                OCEANOSCUBA
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575', fontSize: '10px', lineHeight: 1.1, mt: 0.2 }}>
                Santa marta.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, backgroundColor: 'white', mt: 0 }}>
        {isExpanded && (
          <Typography
            variant="subtitle2"
            sx={{
              px: 1.5,
              py: 0.25,
              pt: 1,
              color: '#424242',
              fontWeight: 'bold',
              fontSize: '12px',
              textTransform: 'uppercase',
            }}
          >
            Principal
          </Typography>
        )}

        <List sx={{ px: isExpanded ? 0.75 : 1 }}>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem disablePadding>
                <Tooltip title={!isExpanded ? item.title : ''} placement="right">
                  <ListItemButton
                    onClick={() => {
                      if (!isExpanded && !isMobile) {
                        // Si está colapsado, primero expandir
                        onToggle();
                      } else {
                        // Si está expandido, toggle de la sección
                        item.onToggle();
                      }
                    }}
                    sx={{
                      backgroundColor: item.active ? '#E0E0E0' : 'transparent',
                      borderRadius: 1,
                      mb: 0.25,
                      minHeight: 36,
                      justifyContent: isExpanded ? 'flex-start' : 'center',
                      px: isExpanded ? 1.5 : 0.75,
                      '&:hover': {
                        backgroundColor: item.active ? '#D5D5D5' : '#F0F0F0',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: isExpanded ? 32 : 'auto', color: '#424242' }}>
                      {item.icon}
                    </ListItemIcon>
                    {isExpanded && (
                      <>
                        <ListItemText
                          primary={item.title}
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontSize: '12px',
                              fontWeight: item.active ? 'bold' : 'normal',
                              color: '#424242',
                            },
                          }}
                        />
                        {item.expanded ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />}
                      </>
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>

              {item.children && isExpanded && (
                <Collapse in={item.expanded} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child, childIndex) => (
                      <ListItem key={childIndex} disablePadding>
                        <Tooltip title={child.title} placement="right">
                          <ListItemButton
                            onClick={() => {
                              handleNavigation(child.path);
                              if (isMobile) {
                                onToggle(); // Close sidebar after navigation on mobile
                              }
                            }}
                            sx={{
                              pl: 4,
                              backgroundColor: child.active ? '#F0F0F0' : 'transparent',
                              borderRadius: 1,
                              mb: 0.25,
                              minHeight: 32,
                              '&:hover': {
                                backgroundColor: child.active ? '#E8E8E8' : '#F5F5F5',
                              },
                            }}
                          >
                            <ListItemText
                              primary={child.title}
                              sx={{
                                '& .MuiListItemText-primary': {
                                  fontSize: '12px',
                                  fontWeight: child.active ? 'bold' : 'normal',
                                  color: '#424242',
                                },
                              }}
                            />
                          </ListItemButton>
                        </Tooltip>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box 
        sx={{ 
          p: 1.5, 
          backgroundColor: 'white',
          cursor: !isExpanded && !isMobile ? 'pointer' : 'default',
          '&:hover': !isExpanded && !isMobile ? { backgroundColor: '#F5F5F5' } : {},
        }}
        onClick={() => {
          if (!isExpanded && !isMobile) {
            onToggle();
          }
        }}
      >
        {isExpanded && <Divider sx={{ mb: 1 }} />}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isExpanded ? 'space-between' : 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 'bold',
                color: '#424242',
                mr: isExpanded ? 0.75 : 0,
                fontSize: '12px',
              }}
            >
              AS
            </Typography>
            {isExpanded && (
              <Typography variant="body2" sx={{ color: '#757575', fontSize: '10px' }}>
                nanobonilla@hotmail.com
              </Typography>
            )}
          </Box>
          {isExpanded && <KeyboardArrowDown sx={{ color: '#BDBDBD', fontSize: 16 }} />}
        </Box>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onToggle}
        ModalProps={{
          keepMounted: true,
          BackdropProps: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }
          }
        }}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 2,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            borderRight: '1px solid #e0e0e0',
            backgroundColor: 'white',
            zIndex: (theme) => theme.zIndex.drawer + 2,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  // Desktop: Box fijo permanente con ancho dinámico
  return (
    <Box
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        boxSizing: 'border-box',
        borderRight: '1px solid #e0e0e0',
        backgroundColor: 'white',
        overflowX: 'hidden',
        overflowY: 'auto',
        zIndex: 1200,
        transition: 'width 0.3s ease',
      }}
    >
      {drawerContent}
    </Box>
  );
};

export default Sidebar;