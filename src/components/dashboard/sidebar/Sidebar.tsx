'use client';

import React, { useState } from 'react';
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
  DashboardOutlined,
  InventoryOutlined,
  CategoryOutlined,
  HistoryOutlined,
  MenuBookOutlined,
  PersonAddOutlined,
  SettingsOutlined,
  KeyboardArrowDown,
} from '@mui/icons-material';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onToggle }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [principalOpen, setPrincipalOpen] = useState(true);
  const [marketingOpen, setMarketingOpen] = useState(false);
  const [prospectosOpen, setProspectosOpen] = useState(false);
  const [herramientasOpen, setHerramientasOpen] = useState(false);

  const drawerWidth = open ? 240 : 56;

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const menuItems = [
    {
      title: 'Principal',
      icon: <HomeOutlined />,
      expanded: principalOpen,
      onToggle: () => setPrincipalOpen(!principalOpen),
      children: [
        { title: 'Dashboard', icon: <DashboardOutlined />, path: '/dashboard', active: pathname === '/dashboard' },
        { title: 'Productos', icon: <InventoryOutlined />, path: '/dashboard/productos', active: pathname.startsWith('/dashboard/productos') },
        { title: 'Categorías', icon: <CategoryOutlined />, path: '/dashboard/categorias', active: pathname.startsWith('/dashboard/categorias') },
        { title: 'Historial de ventas', icon: <HistoryOutlined />, path: '/dashboard/historial', active: pathname.startsWith('/dashboard/historial') },
      ],
    },
    {
      title: 'Marketing | publicidad',
      icon: <MenuBookOutlined />,
      expanded: marketingOpen,
      onToggle: () => setMarketingOpen(!marketingOpen),
      children: [],
    },
    {
      title: 'Prospectos',
      icon: <PersonAddOutlined />,
      expanded: prospectosOpen,
      onToggle: () => setProspectosOpen(!prospectosOpen),
      children: [],
    },
    {
      title: 'Herramientas',
      icon: <SettingsOutlined />,
      expanded: herramientasOpen,
      onToggle: () => setHerramientasOpen(!herramientasOpen),
      children: [],
    },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box 
        sx={{ 
          p: open ? 1.5 : 1.5, 
          backgroundColor: '#F8F8F8',
          cursor: !open ? 'pointer' : 'default',
          '&:hover': !open ? { backgroundColor: '#F0F0F0' } : {}
        }}
        onClick={() => {
          if (!open) {
            onToggle();
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: open ? 0.5 : 0 }}>
          <Avatar sx={{ width: 28, height: 28, backgroundColor: '#E0E0E0', mr: open ? 0.75 : 0 }}>
            <Typography variant="h6" sx={{ color: 'white', fontSize: '12px' }}>
              N
            </Typography>
          </Avatar>
          {open && (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 28 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#424242', fontSize: '12px', lineHeight: 1 }}>
                OCEANOSCUBA
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575', fontSize: '9px', lineHeight: 1 }}>
                Santa marta.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, backgroundColor: '#F8F8F8', mt: -2 }}>
        {open && (
          <Typography
            variant="subtitle2"
            sx={{
              px: 1.5,
              py: 0.25,
              color: '#424242',
              fontWeight: 'bold',
              fontSize: '10px',
              textTransform: 'uppercase',
            }}
          >
            Principal
          </Typography>
        )}

        <List sx={{ px: open ? 0.75 : 1 }}>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem disablePadding>
                <Tooltip title={!open ? item.title : ''} placement="right">
                  <ListItemButton
                    onClick={() => {
                      if (!open) {
                        onToggle();
                      } else {
                        item.onToggle();
                      }
                    }}
                    sx={{
                      backgroundColor: item.title === 'Principal' ? '#E0E0E0' : 'transparent',
                      borderRadius: 1,
                      mb: 0.25,
                      minHeight: 36,
                      justifyContent: open ? 'flex-start' : 'center',
                      px: open ? 1.5 : 0.75,
                      '&:hover': {
                        backgroundColor: item.title === 'Principal' ? '#D5D5D5' : '#F0F0F0',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: open ? 32 : 'auto', color: '#424242' }}>
                      {item.icon}
                    </ListItemIcon>
                    {open && (
                      <>
                        <ListItemText
                          primary={item.title}
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontSize: '12px',
                              fontWeight: item.title === 'Principal' ? 'bold' : 'normal',
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

              {item.children && open && (
                <Collapse in={item.expanded} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child, childIndex) => (
                      <ListItem key={childIndex} disablePadding>
                        <Tooltip title={child.title} placement="right">
                          <ListItemButton
                            onClick={() => {
                              if (!open) {
                                onToggle();
                              } else {
                                handleNavigation(child.path);
                              }
                            }}
                            sx={{
                              pl: 3,
                              backgroundColor: child.active ? '#F0F0F0' : 'transparent',
                              borderRadius: 1,
                              mb: 0.25,
                              minHeight: 32,
                              '&:hover': {
                                backgroundColor: child.active ? '#E8E8E8' : '#F5F5F5',
                              },
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 32, color: '#424242' }}>
                              {child.icon}
                            </ListItemIcon>
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
          p: open ? 1.5 : 1.5, 
          backgroundColor: '#F8F8F8',
          cursor: !open ? 'pointer' : 'default',
          '&:hover': !open ? { backgroundColor: '#F0F0F0' } : {}
        }}
        onClick={() => {
          if (!open) {
            onToggle();
          }
        }}
      >
        {open && <Divider sx={{ mb: 1 }} />}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: open ? 'space-between' : 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 'bold',
                color: '#424242',
                mr: open ? 0.75 : 0,
                fontSize: '12px',
              }}
            >
              AS
            </Typography>
            {open && (
              <Typography variant="body2" sx={{ color: '#757575', fontSize: '10px' }}>
                nanobonilla@hotmail.com
              </Typography>
            )}
          </Box>
          {open && <KeyboardArrowDown sx={{ color: '#BDBDBD', fontSize: 16 }} />}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none',
          backgroundColor: '#F8F8F8',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;