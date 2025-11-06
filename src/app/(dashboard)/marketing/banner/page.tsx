'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  FileUploadOutlined as ImportIcon,
  FilterListOutlined as FilterIcon,
  FileDownloadOutlined as ExportIcon,
  Search as SearchIcon,
  ImageOutlined as ImageIcon,
  Close as CloseIcon,
  VisibilityOutlined as VisibilityOutlinedIcon,
  EditOutlined as EditOutlinedIcon,
  DeleteOutlined as DeleteOutlinedIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FmdGoodOutlined as FmdGoodOutlinedIcon,
} from '@mui/icons-material';
import BannerDialog, { BannerFormData } from '@/components/marketing/BannerDialog';
import BannerPageSkeleton from './BannerPageSkeleton';
import { zoneController, bannerController } from '@/components/core';
import { ZoneDto } from '@/components/core/zones/dto/ZoneResponse.dto';
import { BannerDto } from '@/components/core/banners/dto/BannerResponse.dto';

interface Banner {
  id: string;
  title: string;
  image_url: string;
  link_url: string;
  active: boolean;
  zone_id: string;
  created_at: string;
}

interface ZonaBanner {
  id: string;
  codigo: string; // name del DTO
  nombre: string; // description del DTO
  banners: Banner[];
  expanded: boolean;
}

const BannerPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [zonaSearchTerm, setZonaSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<BannerDto | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<BannerDto | null>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'Activo' | 'Inactivo'>('Todos');
  const filterOpen = Boolean(filterAnchorEl);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerDto | null>(null);
  const [viewZonaModalOpen, setViewZonaModalOpen] = useState(false);
  const [selectedZona, setSelectedZona] = useState<ZonaBanner | null>(null);
  const [showEditWarning, setShowEditWarning] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [createZonaDialogOpen, setCreateZonaDialogOpen] = useState(false);
  const [zonaFormData, setZonaFormData] = useState({ codigo: '', nombre: '' });
  const [loading, setLoading] = useState(true);
  const [zonas, setZonas] = useState<ZonaBanner[]>([]);
  const [banners, setBanners] = useState<BannerDto[]>([]);

  // Cargar datos
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar zonas
      const zonesResponse = await zoneController.getAll();
      if (zonesResponse?.success && zonesResponse.data) {
        const zonesData = zonesResponse.data;
        
        // Cargar banners
        const bannersResponse = await bannerController.getAll();
        if (bannersResponse?.success && bannersResponse.data) {
          setBanners(bannersResponse.data);
          
          // Agrupar banners por zona
          const zonasWithBanners: ZonaBanner[] = zonesData.map(zone => ({
            id: zone.id,
            codigo: zone.name, // name del DTO es el código
            nombre: zone.description, // description del DTO es el nombre
            expanded: false,
            banners: bannersResponse.data.filter(banner => banner.zone_id === zone.id),
          }));
          
          setZonas(zonasWithBanners);
        } else {
          // Si no hay banners, solo mostrar zonas
          const zonasList: ZonaBanner[] = zonesData.map(zone => ({
            id: zone.id,
            codigo: zone.name,
            nombre: zone.description,
            expanded: false,
            banners: [],
          }));
          setZonas(zonasList);
        }
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleEstadoChange = (estado: 'Todos' | 'Activo' | 'Inactivo') => {
    setFiltroEstado(estado);
    handleFilterClose();
  };

  const handleViewZona = (zona: ZonaBanner) => {
    setSelectedZona(zona);
    setViewZonaModalOpen(true);
  };

  const handleCloseViewZonaModal = () => {
    setViewZonaModalOpen(false);
    setSelectedZona(null);
  };

  const handleEditZona = () => {
    setShowEditWarning(true);
  };

  const handleDeleteZona = () => {
    setShowDeleteWarning(true);
  };

  const handleOpenCreateZona = () => {
    setCreateZonaDialogOpen(true);
  };

  const handleCloseCreateZona = () => {
    setCreateZonaDialogOpen(false);
    setZonaFormData({ codigo: '', nombre: '' });
  };

  const handleCreateZona = async () => {
    if (zonaFormData.codigo.trim() && zonaFormData.nombre.trim()) {
      try {
        const response = await zoneController.create({
          name: zonaFormData.codigo, // name es el código
          description: zonaFormData.nombre, // description es el nombre
        });
        
        if (response?.success) {
          await loadData(); // Recargar datos
          handleCloseCreateZona();
        }
      } catch (error) {
        console.error('Error al crear zona:', error);
      }
    }
  };

  const handleEditBanner = (banner: BannerDto) => {
    setEditingBanner(banner);
    setIsEditMode(true);
    setCreateDialogOpen(true);
  };

  const handleCreateBanner = async (data: BannerFormData) => {
    try {
      if (isEditMode && editingBanner) {
        // Modo edición: actualizar banner existente
        const response = await bannerController.update(editingBanner.id, {
          zone_id: data.zonaId,
          title: data.titulo,
          subtitles: data.subtitles || '',
          image_url: data.urlWeb || '',
          link_url: data.redireccion || '#',
          active: data.estado === 'Activo',
        });
        
        if (response?.success) {
          await loadData(); // Recargar datos
        }
      } else {
        // Modo crear: nuevo banner
        const response = await bannerController.create({
          zone_id: data.zonaId,
          title: data.titulo,
          subtitles: data.subtitles || '',
          image_url: data.urlWeb || '',
          link_url: data.redireccion || '#',
          active: data.estado === 'Activo',
        });
        
        if (response?.success) {
          await loadData(); // Recargar datos
        }
      }

      setCreateDialogOpen(false);
      setIsEditMode(false);
      setEditingBanner(null);
    } catch (error) {
      console.error('Error al guardar banner:', error);
    }
  };

  // Helper para obtener estado de banner
  const getBannerEstado = (active: boolean): 'Activo' | 'Inactivo' => {
    return active ? 'Activo' : 'Inactivo';
  };

  const handleToggleZona = (zonaId: string) => {
    setZonas(zonas.map(zona => 
      zona.id === zonaId ? { ...zona, expanded: !zona.expanded } : zona
    ));
  };

  const handleViewBanner = (banner: BannerDto) => {
    setSelectedBanner(banner);
    setViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedBanner(null);
  };

  const handleDeleteBanner = (banner: BannerDto) => {
    setBannerToDelete(banner);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setBannerToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (bannerToDelete) {
      try {
        const response = await bannerController.delete(bannerToDelete.id);
        if (response?.success) {
          await loadData(); // Recargar datos
          handleCloseDeleteModal();
        }
      } catch (error) {
        console.error('Error al eliminar banner:', error);
      }
    }
  };

  // Filtrar zonas y banners según el término de búsqueda y filtros
  const zonasFiltered = zonas.map(zona => ({
    ...zona,
    banners: zona.banners.filter(banner => {
      // Filtro de búsqueda
      const matchesSearch = searchTerm === '' || 
        banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        banner.link_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getBannerEstado(banner.active).toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro de estado
      const matchesEstado = filtroEstado === 'Todos' || getBannerEstado(banner.active) === filtroEstado;
      
      return matchesSearch && matchesEstado;
    })
  })).filter(zona => zona.banners.length > 0 || (searchTerm === '' && filtroEstado === 'Todos'));

  const totalBanners = zonas.reduce((acc, zona) => acc + zona.banners.length, 0);
  const totalBannersFiltrados = zonasFiltered.reduce((acc, zona) => acc + zona.banners.length, 0);

  // Mostrar skeleton mientras carga
  if (loading) {
    return <BannerPageSkeleton />;
  }

  // Si no hay banners, mostrar estado vacío
  if (totalBanners === 0) {
    return (
      <Box sx={{ 
        px: { xs: 2, sm: 3, md: 6 }, 
        py: 2, 
        backgroundColor: 'white', 
        height: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          textAlign: 'center',
          maxWidth: { xs: '320px', sm: '380px' },
          px: { xs: 2, sm: 3 }
        }}>
          {/* Icono */}
          <Box sx={{ mb: 2 }}>
            <ImageIcon 
              sx={{ 
                fontSize: { xs: 60, sm: 70 }, 
                color: '#bdbdbd',
                opacity: 0.6
              }} 
            />
          </Box>

          {/* Título */}
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#424242',
              mb: 1.5,
              fontSize: { xs: '20px', sm: '22px' }
            }}
          >
            No hay banners
          </Typography>

          {/* Descripción */}
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#757575',
              mb: 3,
              fontSize: { xs: '14px', sm: '15px' },
              lineHeight: 1.4
            }}
          >
            Comienza a promocionar tus productos creando banners publicitarios
          </Typography>

          {/* Botón Añadir banner */}
          <Button
            variant="contained"
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              backgroundColor: '#424242',
              fontSize: { xs: '14px', sm: '15px' },
              px: { xs: 2.5, sm: 3.5 },
              py: { xs: 1, sm: 1.2 },
              borderRadius: 2,
              textTransform: 'capitalize',
              fontWeight: 'medium',
              boxShadow: 'none',
              width: { xs: '100%', sm: 'auto' },
              '&:hover': { 
                backgroundColor: '#303030',
                boxShadow: 'none'
              },
            }}
          >
            Añadir banner
          </Button>

          {/* Enlace de ayuda */}
          <Box sx={{ mt: 3 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#757575',
                fontSize: { xs: '12px', sm: '13px' },
                cursor: 'pointer',
                '&:hover': {
                  color: '#424242',
                  textDecoration: 'underline'
                }
              }}
            >
              ¿Necesitas ayuda?
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 6 }, py: 2, backgroundColor: 'white', height: 'calc(100vh - 64px)', overflow: 'auto' }}>
      {/* Header con Tabs */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        {/* Tabs ocupando todo el ancho */}
        <Box sx={{ 
          display: 'flex', 
          flex: 1, 
          backgroundColor: '#f5f5f5', 
          borderRadius: { xs: 1, sm: 2 }, 
          p: 0.5,
          mb: 2
        }}>
          <Button
            onClick={() => setTabValue(0)}
            sx={{
              flex: 1,
              textTransform: 'none',
              fontSize: { xs: '13px', sm: '14px' },
              fontWeight: tabValue === 0 ? 'medium' : 'normal',
              color: tabValue === 0 ? '#424242' : '#757575',
              backgroundColor: tabValue === 0 ? 'white' : 'transparent',
              minHeight: { xs: '36px', sm: '40px' },
              borderRadius: 1.5,
              boxShadow: tabValue === 0 ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              '&:hover': {
                backgroundColor: tabValue === 0 ? 'white' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            Banners
          </Button>
          <Button
            onClick={() => setTabValue(1)}
            sx={{
              flex: 1,
              textTransform: 'none',
              fontSize: { xs: '13px', sm: '14px' },
              fontWeight: tabValue === 1 ? 'medium' : 'normal',
              color: tabValue === 1 ? '#424242' : '#757575',
              backgroundColor: tabValue === 1 ? 'white' : 'transparent',
              minHeight: { xs: '36px', sm: '40px' },
              borderRadius: 1.5,
              boxShadow: tabValue === 1 ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              '&:hover': {
                backgroundColor: tabValue === 1 ? 'white' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            Zonas
          </Button>
        </Box>

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: { xs: 0.75, sm: 1 }, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {tabValue === 0 && (
            <>
              <Button
                variant="outlined"
                startIcon={<ImportIcon sx={{ fontSize: { xs: 16, sm: 18 }, display: { xs: 'none', sm: 'flex' } }} />}
                size="small"
                sx={{
                  borderColor: '#e0e0e0',
                  color: '#424242',
                  fontSize: { xs: '12px', sm: '13px' },
                  px: { xs: 1.5, sm: 2 },
                  py: 0.75,
                  textTransform: 'none',
                  backgroundColor: 'white',
                  whiteSpace: 'nowrap',
                  minWidth: { xs: 'auto', sm: 'auto' },
                  '&:hover': { borderColor: '#bdbdbd', backgroundColor: '#fafafa' },
                }}
              >
                Importar
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: { xs: 16, sm: 18 }, display: { xs: 'none', sm: 'flex' } }} />}
                size="small"
                onClick={() => setCreateDialogOpen(true)}
                sx={{
                  backgroundColor: '#1a1a1a',
                  fontSize: { xs: '12px', sm: '13px' },
                  px: { xs: 1.5, sm: 2 },
                  py: 0.75,
                  textTransform: 'none',
                  boxShadow: 'none',
                  whiteSpace: 'nowrap',
                  minWidth: { xs: 'auto', sm: 'auto' },
                  '&:hover': { backgroundColor: '#000', boxShadow: 'none' },
                }}
              >
                Añadir banner
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Contenido según tab */}
      {tabValue === 0 && (
        <Box>
          {/* Barra de búsqueda y filtros */}
          <Box sx={{ display: 'flex', gap: { xs: 0.75, sm: 1 }, mb: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            <TextField
              fullWidth
              placeholder="Buscar en todos los campos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: '#757575', mr: 1, fontSize: { xs: 16, sm: 18 } }} />,
              }}
              sx={{
                flex: { xs: '1 1 100%', sm: '1 1 auto' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  fontSize: { xs: '12px', sm: '13px' },
                  backgroundColor: 'white',
                },
              }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterIcon sx={{ fontSize: { xs: 16, sm: 18 }, display: { xs: 'none', sm: 'flex' } }} />}
              size="small"
              onClick={handleFilterClick}
              sx={{
                borderColor: '#e0e0e0',
                color: '#424242',
                fontSize: { xs: '12px', sm: '13px' },
                px: { xs: 1.5, sm: 2 },
                textTransform: 'none',
                whiteSpace: 'nowrap',
                minWidth: { xs: 'auto', sm: 'auto' },
                flexShrink: 0,
                backgroundColor: filtroEstado !== 'Todos' ? '#e3f2fd' : 'white',
                '&:hover': { borderColor: '#bdbdbd', backgroundColor: filtroEstado !== 'Todos' ? '#bbdefb' : '#f5f5f5' },
              }}
            >
              Filtros
            </Button>
            <Button
              variant="outlined"
              startIcon={<ExportIcon sx={{ fontSize: { xs: 16, sm: 18 }, display: { xs: 'none', sm: 'flex' } }} />}
              size="small"
              sx={{
                borderColor: '#e0e0e0',
                color: '#424242',
                fontSize: { xs: '12px', sm: '13px' },
                px: { xs: 1.5, sm: 2 },
                textTransform: 'none',
                whiteSpace: 'nowrap',
                minWidth: { xs: 'auto', sm: 'auto' },
                flexShrink: 0,
                '&:hover': { borderColor: '#bdbdbd', backgroundColor: '#f5f5f5' },
              }}
            >
              Exportar
            </Button>
            
            {/* Popover de Filtros */}
            <Popover
              open={filterOpen}
              anchorEl={filterAnchorEl}
              onClose={handleFilterClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              sx={{
                mt: 1,
              }}
            >
              <Box sx={{ width: 200, p: 2 }}>
                {/* Header con X */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '13px', color: '#424242' }}>
                    Filtros
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handleFilterClose}
                    sx={{ p: 0.5 }}
                  >
                    <CloseIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
                
                <Divider sx={{ mb: 1.5 }} />
                
                {/* Filtro por Estado */}
                <Typography variant="body2" sx={{ fontWeight: '500', fontSize: '12px', color: '#757575', mb: 1 }}>
                  Estado
                </Typography>
                
                <List sx={{ p: 0 }}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleEstadoChange('Todos')}
                      selected={filtroEstado === 'Todos'}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        py: 0.75,
                        '&.Mui-selected': {
                          backgroundColor: '#e3f2fd',
                          '&:hover': {
                            backgroundColor: '#bbdefb',
                          },
                        },
                      }}
                    >
                      <ListItemText 
                        primary="Todos" 
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            fontSize: '13px',
                            fontWeight: filtroEstado === 'Todos' ? '500' : 'normal',
                          } 
                        }} 
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleEstadoChange('Activo')}
                      selected={filtroEstado === 'Activo'}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        py: 0.75,
                        '&.Mui-selected': {
                          backgroundColor: '#e3f2fd',
                          '&:hover': {
                            backgroundColor: '#bbdefb',
                          },
                        },
                      }}
                    >
                      <ListItemText 
                        primary="Activo" 
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            fontSize: '13px',
                            fontWeight: filtroEstado === 'Activo' ? '500' : 'normal',
                          } 
                        }} 
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleEstadoChange('Inactivo')}
                      selected={filtroEstado === 'Inactivo'}
                      sx={{
                        borderRadius: 1,
                        py: 0.75,
                        '&.Mui-selected': {
                          backgroundColor: '#e3f2fd',
                          '&:hover': {
                            backgroundColor: '#bbdefb',
                          },
                        },
                      }}
                    >
                      <ListItemText 
                        primary="Inactivo" 
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            fontSize: '13px',
                            fontWeight: filtroEstado === 'Inactivo' ? '500' : 'normal',
                          } 
                        }} 
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Box>
            </Popover>
          </Box>

          {/* Mensaje si no hay resultados */}
          {totalBannersFiltrados === 0 && searchTerm !== '' && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" sx={{ color: '#757575', fontSize: '14px' }}>
                No se encontraron resultados para "{searchTerm}"
              </Typography>
            </Box>
          )}

          {/* Zonas colapsables */}
          {zonasFiltered.map((zona) => (
            <Box key={zona.id} sx={{ mb: 2 }}>
              {/* Header de la zona */}
              <Box
                onClick={() => handleToggleZona(zona.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 1,
                  px: 2,
                  backgroundColor: '#fafafa',
                  borderRadius: 1,
                  cursor: 'pointer',
                  border: '1px solid #e0e0e0',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                {zona.expanded ? <ExpandMoreIcon /> : <ExpandLessIcon sx={{ transform: 'rotate(-90deg)' }} />}
                <Typography variant="body1" sx={{ fontWeight: '500', fontSize: '14px', color: '#424242' }}>
                  {zona.nombre}
                </Typography>
                <Chip
                  label={`${zona.banners.length} registros`}
                  size="small"
                  sx={{
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    fontWeight: 'medium',
                    fontSize: '11px',
                    height: 20,
                  }}
                />
              </Box>

              {/* Tabla de banners de la zona */}
              <Collapse in={zona.expanded}>
                {zona.banners.length > 0 ? (
                  <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', borderTop: 'none', mt: 0, overflowX: { xs: 'auto', sm: 'visible' } }}>
                    <Table size="small" sx={{ minWidth: { xs: 600, sm: 'auto' } }}>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: '#f8f8f8' }}>
                          <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 1, fontSize: '13px' }}>Título</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 1, fontSize: '13px' }}>Redirección</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 1, fontSize: '13px' }}>Estado</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 1, fontSize: '13px', textAlign: 'center' }}>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {zona.banners.map((banner) => (
                          <TableRow key={banner.id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                            <TableCell sx={{ py: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                  component="img"
                                  src={banner.image_url}
                                  alt={banner.title}
                                  sx={{
                                    width: 50,
                                    height: 32,
                                    borderRadius: 0.5,
                                    objectFit: 'cover',
                                  }}
                                />
                                <Typography variant="body2" sx={{ fontSize: '13px', color: '#424242' }}>
                                  {banner.title}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <Typography variant="body2" sx={{ fontSize: '13px', color: '#757575' }}>
                                {banner.link_url}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 1 }}>
                              <Chip
                                label={getBannerEstado(banner.active)}
                                size="small"
                                sx={{
                                  backgroundColor: banner.active ? '#e8f5e9' : '#ffebee',
                                  color: banner.active ? '#4caf50' : '#f44336',
                                  fontWeight: 'medium',
                                  fontSize: '11px',
                                  height: 22,
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ py: 1, textAlign: 'center' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewBanner(banner)}
                                  sx={{
                                    border: '1px solid #e0e0e0',
                                    borderRight: 'none',
                                    borderRadius: '4px 0 0 4px',
                                    color: '#757575',
                                    p: 1,
                                    '&:hover': { 
                                      backgroundColor: '#f5f5f5',
                                      borderColor: '#bdbdbd'
                                    },
                                  }}
                                >
                                  <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditBanner(banner)}
                                  sx={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 0,
                                    color: '#757575',
                                    p: 1,
                                    '&:hover': { 
                                      backgroundColor: '#f5f5f5',
                                      borderColor: '#bdbdbd'
                                    },
                                  }}
                                >
                                  <EditOutlinedIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteBanner(banner)}
                                  sx={{
                                    border: '1px solid #f44336',
                                    borderLeft: 'none',
                                    borderRadius: '0 4px 4px 0',
                                    backgroundColor: '#f44336',
                                    color: 'white',
                                    p: 1,
                                    '&:hover': { 
                                      backgroundColor: '#ff5252',
                                      borderColor: '#ff5252'
                                    },
                                  }}
                                >
                                  <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderTop: 'none', textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                      No hay banners en esta zona
                    </Typography>
                  </Box>
                )}
              </Collapse>
            </Box>
          ))}
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          {/* Título de Zonas con contador */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: '500', 
                fontSize: '16px', 
                color: '#424242',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <ExpandMoreIcon /> Zonas
            </Typography>
            <Chip
              label={`${zonas.length} registros`}
              size="small"
              sx={{
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                fontWeight: 'medium',
                fontSize: '11px',
                height: 20,
                ml: 1,
              }}
            />
          </Box>

          {/* Barra de búsqueda y botones */}
          <Box sx={{ display: 'flex', gap: { xs: 0.75, sm: 1 }, mb: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            <TextField
              fullWidth
              placeholder="Buscar en todos los campos..."
              value={zonaSearchTerm}
              onChange={(e) => setZonaSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: '#757575', mr: 1, fontSize: { xs: 16, sm: 18 } }} />,
              }}
              sx={{
                flex: { xs: '1 1 100%', sm: '1 1 auto' },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  fontSize: { xs: '12px', sm: '13px' },
                  backgroundColor: 'white',
                },
              }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon sx={{ fontSize: { xs: 16, sm: 18 }, display: { xs: 'none', sm: 'flex' } }} />}
              size="small"
              onClick={handleOpenCreateZona}
              sx={{
                backgroundColor: '#1a1a1a',
                fontSize: { xs: '12px', sm: '13px' },
                px: { xs: 1.5, sm: 2 },
                textTransform: 'none',
                whiteSpace: 'nowrap',
                minWidth: { xs: 'auto', sm: 'auto' },
                flexShrink: 0,
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#000', boxShadow: 'none' },
              }}
            >
              Nuevo
            </Button>
            <Button
              variant="outlined"
              startIcon={<ExportIcon sx={{ fontSize: { xs: 16, sm: 18 }, display: { xs: 'none', sm: 'flex' } }} />}
              size="small"
              sx={{
                borderColor: '#e0e0e0',
                color: '#424242',
                fontSize: { xs: '12px', sm: '13px' },
                px: { xs: 1.5, sm: 2 },
                textTransform: 'none',
                whiteSpace: 'nowrap',
                minWidth: { xs: 'auto', sm: 'auto' },
                flexShrink: 0,
                '&:hover': { borderColor: '#bdbdbd', backgroundColor: '#f5f5f5' },
              }}
            >
              Exportar
            </Button>
          </Box>

          {/* Tabla de Zonas */}
          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', overflowX: { xs: 'auto', sm: 'visible' } }}>
            <Table size="small" sx={{ minWidth: { xs: 500, sm: 'auto' } }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f8f8' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 1, fontSize: '13px' }}>Código</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 1, fontSize: '13px' }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 1, fontSize: '13px', textAlign: 'center' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {zonas.filter((zona) => {
                  if (zonaSearchTerm === '') return true;
                  return (
                    zona.codigo.toLowerCase().includes(zonaSearchTerm.toLowerCase()) ||
                    zona.nombre.toLowerCase().includes(zonaSearchTerm.toLowerCase())
                  );
                }).map((zona) => (
                  <TableRow key={zona.id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                    <TableCell sx={{ py: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: '4px', 
                          backgroundColor: '#f5f5f5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <FmdGoodOutlinedIcon sx={{ fontSize: 18, color: '#757575' }} />
                        </Box>
                        <Typography variant="body2" sx={{ fontSize: '13px', color: '#424242', fontFamily: 'monospace' }}>
                          {zona.codigo}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Typography variant="body2" sx={{ fontSize: '13px', color: '#424242' }}>
                        {zona.nombre}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1, textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewZona(zona)}
                          sx={{
                            border: '1px solid #e0e0e0',
                            borderRight: 'none',
                            borderRadius: '4px 0 0 4px',
                            color: '#757575',
                            p: 1,
                            '&:hover': { 
                              backgroundColor: '#f5f5f5',
                              borderColor: '#bdbdbd'
                            },
                          }}
                        >
                          <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                         <IconButton
                           size="small"
                           onClick={handleEditZona}
                           sx={{
                             border: '1px solid #e0e0e0',
                             borderRadius: 0,
                             color: '#757575',
                             p: 1,
                             '&:hover': { 
                               backgroundColor: '#f5f5f5',
                               borderColor: '#bdbdbd'
                             },
                           }}
                         >
                           <EditOutlinedIcon sx={{ fontSize: 16 }} />
                         </IconButton>
                        <IconButton
                          size="small"
                          onClick={handleDeleteZona}
                          sx={{
                            border: '1px solid #f44336',
                            borderLeft: 'none',
                            borderRadius: '0 4px 4px 0',
                            backgroundColor: '#f44336',
                            color: 'white',
                            p: 1,
                            '&:hover': { 
                              backgroundColor: '#ff5252',
                              borderColor: '#ff5252'
                            },
                          }}
                        >
                          <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Modal de Ver Banner */}
      <Dialog
        open={viewModalOpen}
        onClose={handleCloseViewModal}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            maxWidth: '600px',
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <DialogTitle sx={{ 
            pb: 1,
            px: 2,
            pt: 2,
            fontWeight: 'bold',
            color: '#424242',
            fontSize: '16px',
          }}>
            {selectedBanner?.title}
          </DialogTitle>
          <IconButton
            onClick={handleCloseViewModal}
            size="small"
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#757575',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: 3, pb: 3, pt: 2 }}>
          {selectedBanner && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography component="span" sx={{ fontWeight: 'bold', color: '#000', fontSize: '14px' }}>
                  Título:{' '}
                </Typography>
                <Typography component="span" sx={{ color: '#424242', fontSize: '14px' }}>
                  {selectedBanner.title}
                </Typography>
              </Box>

              <Box>
                <Typography component="span" sx={{ fontWeight: 'bold', color: '#000', fontSize: '14px' }}>
                  Redirección:{' '}
                </Typography>
                <Typography 
                  component="a" 
                  href={selectedBanner.link_url}
                  sx={{ 
                    color: '#1976d2', 
                    fontSize: '14px',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  {selectedBanner.link_url}
                </Typography>
              </Box>

              <Box>
                <Typography component="span" sx={{ fontWeight: 'bold', color: '#000', fontSize: '14px' }}>
                  Estado:{' '}
                </Typography>
                <Typography component="span" sx={{ color: '#424242', fontSize: '14px' }}>
                  {getBannerEstado(selectedBanner.active)}
                </Typography>
              </Box>

              <Box>
                <Typography component="div" sx={{ fontWeight: 'bold', color: '#000', fontSize: '14px', mb: 0.5 }}>
                  Imagen:
                </Typography>
                <Box
                  component="img"
                  src={selectedBanner.image_url}
                  alt={selectedBanner.title}
                  sx={{
                    maxWidth: '100%',
                    borderRadius: 1,
                    mb: 1,
                  }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'flex-end' }}>
          <Button
            onClick={handleCloseViewModal}
            variant="contained"
            sx={{
              backgroundColor: '#1a1a1a',
              color: 'white',
              textTransform: 'none',
              px: 3,
              py: 1,
              fontSize: '14px',
              '&:hover': {
                backgroundColor: '#000',
              },
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Eliminar Banner */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            maxWidth: '420px',
            padding: '12px',
          },
        }}
      >
        <DialogTitle sx={{ 
          pb: 0.5,
          px: 1.5,
          pt: 1,
          fontWeight: 'bold',
          color: '#424242',
          fontSize: '16px',
        }}>
          Eliminar Banner
        </DialogTitle>

        <DialogContent sx={{ px: 1.5, py: 1 }}>
          <Typography variant="body2" sx={{ color: '#424242', fontSize: '13px', lineHeight: 1.4 }}>
            ¿Estás seguro de que deseas eliminar el banner{' '}
            <Typography component="span" sx={{ fontWeight: 'bold', color: '#f44336', fontSize: '13px' }}>
              {bannerToDelete?.title}
            </Typography>
            ?
          </Typography>
          <Typography variant="body2" sx={{ color: '#757575', fontSize: '12px', mt: 0.5 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 1.5, pb: 1, pt: 0.5, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={handleCloseDeleteModal}
            sx={{
              borderColor: '#e0e0e0',
              color: '#424242',
              textTransform: 'capitalize',
              boxShadow: 'none',
              fontSize: '13px',
              px: 2,
              py: 0.5,
              '&:hover': {
                borderColor: '#bdbdbd',
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmDelete}
            sx={{
              backgroundColor: '#f44336',
              textTransform: 'capitalize',
              boxShadow: 'none',
              fontSize: '13px',
              px: 2,
              py: 0.5,
              '&:hover': {
                backgroundColor: '#d32f2f',
                boxShadow: 'none',
              },
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Ver Zona */}
      <Dialog
        open={viewZonaModalOpen}
        onClose={handleCloseViewZonaModal}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            maxWidth: '500px',
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <DialogTitle sx={{ 
            pb: 2,
            px: 3,
            pt: 2.5,
            fontWeight: 'bold',
            color: '#424242',
            fontSize: '18px',
          }}>
            Detalles de la Zona
          </DialogTitle>
          <IconButton
            onClick={handleCloseViewZonaModal}
            size="small"
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: '#757575',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: 3, pb: 3, pt: 1 }}>
          {selectedZona && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography component="span" sx={{ fontWeight: 'bold', color: '#000', fontSize: '14px' }}>
                  Código:{' '}
                </Typography>
                <Typography component="span" sx={{ color: '#424242', fontSize: '14px' }}>
                  {selectedZona.codigo}
                </Typography>
              </Box>

              <Box>
                <Typography component="span" sx={{ fontWeight: 'bold', color: '#000', fontSize: '14px' }}>
                  Nombre:{' '}
                </Typography>
                <Typography component="span" sx={{ color: '#424242', fontSize: '14px' }}>
                  {selectedZona.nombre}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: 'flex-end' }}>
          <Button
            onClick={handleCloseViewZonaModal}
            variant="contained"
            sx={{
              backgroundColor: '#1a1a1a',
              color: 'white',
              textTransform: 'none',
              px: 3,
              py: 1,
              fontSize: '14px',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#000',
                boxShadow: 'none',
              },
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de advertencia para editar */}
      <Snackbar
        open={showEditWarning}
        autoHideDuration={4000}
        onClose={() => setShowEditWarning(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ mb: 2, mr: 2 }}
      >
        <Alert 
          onClose={() => setShowEditWarning(false)} 
          severity="info"
          variant="standard"
          sx={{ 
            width: '100%',
            fontSize: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            '& .MuiAlert-icon': {
              color: '#424242',
            },
            '& .MuiAlert-message': {
              color: '#424242',
            },
          }}
        >
          Para realizar esta acción, por favor comuníquese
          <br />
          con el administrador del sistema
        </Alert>
      </Snackbar>

      {/* Snackbar de advertencia para eliminar */}
      <Snackbar
        open={showDeleteWarning}
        autoHideDuration={4000}
        onClose={() => setShowDeleteWarning(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ mb: 2, mr: 2 }}
      >
        <Alert 
          onClose={() => setShowDeleteWarning(false)} 
          severity="info"
          variant="standard"
          sx={{ 
            width: '100%',
            fontSize: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            '& .MuiAlert-icon': {
              color: '#424242',
            },
            '& .MuiAlert-message': {
              color: '#424242',
            },
          }}
        >
          Para realizar esta acción, por favor comuníquese
          <br />
          con el administrador del sistema
        </Alert>
      </Snackbar>

      {/* Modal de Crear Nueva Zona */}
      <Dialog
        open={createZonaDialogOpen}
        onClose={handleCloseCreateZona}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            maxWidth: '500px',
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <DialogTitle sx={{ 
            pb: 2,
            px: 3,
            pt: 2.5,
            fontWeight: 'bold',
            color: '#424242',
            fontSize: '18px',
          }}>
            Crear Nueva Zona
          </DialogTitle>
          <IconButton
            onClick={handleCloseCreateZona}
            size="small"
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: '#757575',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: 3, pb: 2, pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <Typography sx={{ fontWeight: 'bold', color: '#000', fontSize: '14px', mb: 0.75 }}>
                Código
              </Typography>
              <TextField
                fullWidth
                placeholder="Código"
                value={zonaFormData.codigo}
                onChange={(e) => setZonaFormData({ ...zonaFormData, codigo: e.target.value })}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '14px',
                  },
                }}
              />
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 'bold', color: '#000', fontSize: '14px', mb: 0.75 }}>
                Nombre
              </Typography>
              <TextField
                fullWidth
                placeholder="Nombre"
                value={zonaFormData.nombre}
                onChange={(e) => setZonaFormData({ ...zonaFormData, nombre: e.target.value })}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '14px',
                  },
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1 }}>
          <Button
            onClick={handleCloseCreateZona}
            variant="outlined"
            sx={{
              borderColor: '#e0e0e0',
              color: '#424242',
              textTransform: 'none',
              px: 3,
              py: 0.75,
              fontSize: '14px',
              '&:hover': {
                borderColor: '#bdbdbd',
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreateZona}
            variant="contained"
            disabled={!zonaFormData.codigo.trim() || !zonaFormData.nombre.trim()}
            sx={{
              backgroundColor: zonaFormData.codigo.trim() && zonaFormData.nombre.trim() 
                ? '#1a1a1a' 
                : '#bdbdbd',
              color: 'white',
              textTransform: 'none',
              px: 3,
              py: 0.75,
              fontSize: '14px',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: zonaFormData.codigo.trim() && zonaFormData.nombre.trim()
                  ? '#000'
                  : '#bdbdbd',
                boxShadow: 'none',
              },
              '&.Mui-disabled': {
                backgroundColor: '#bdbdbd',
                color: 'white',
              },
            }}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para crear nuevo banner */}
      <BannerDialog
        open={createDialogOpen}
        onClose={() => {
          setCreateDialogOpen(false);
          setIsEditMode(false);
          setEditingBanner(null);
        }}
        onSave={handleCreateBanner}
        zonas={zonas.map(z => ({ id: z.id, nombre: z.nombre }))}
        isEditing={isEditMode}
        initialData={
          isEditMode && editingBanner
            ? {
                titulo: editingBanner.title,
                subtitles: editingBanner.subtitles || '',
                redireccion: editingBanner.link_url,
                zonaId: editingBanner.zone_id,
                estado: getBannerEstado(editingBanner.active),
                urlWeb: editingBanner.image_url || '',
              }
            : undefined
        }
      />
    </Box>
  );
};

export default BannerPage;
