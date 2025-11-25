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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  ModeEditOutlineOutlined as ModeEditOutlineOutlinedIcon,
  SchoolOutlined as SchoolOutlinedIcon,
  EventOutlined as EventOutlinedIcon,
  Anchor as AnchorIcon,
  DirectionsBoat as DirectionsBoatIcon,
} from '@mui/icons-material';
import { peopleController, activityController, marinaController, vesselController } from '@/components/core';
import { PeopleDto, PeopleCreateRequestDto, PeopleUpdateRequestDto } from '@/components/core/people/dto';
import { ActivityDto, ActivityCreateRequestDto, ActivityUpdateRequestDto } from '@/components/core/activities/dto';
import { MarinaDto, MarinaCreateRequestDto, MarinaUpdateRequestDto } from '@/components/core/marinas/dto';
import { VesselDto, VesselCreateRequestDto, VesselUpdateRequestDto } from '@/components/core/vessels/dto';

const MaestrosPage: React.FC = () => {
  // Tab state
  const [currentTab, setCurrentTab] = useState(0);

  // People states
  const [peopleSearchTerm, setPeopleSearchTerm] = useState('');
  const [peopleCurrentPage, setPeopleCurrentPage] = useState(1);
  const [peopleDialogOpen, setPeopleDialogOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<PeopleDto | null>(null);
  const [peopleLoading, setPeopleLoading] = useState(true);
  const [peopleSaving, setPeopleSaving] = useState(false);
  const [people, setPeople] = useState<PeopleDto[]>([]);

  // Activity states
  const [activitySearchTerm, setActivitySearchTerm] = useState('');
  const [activityCurrentPage, setActivityCurrentPage] = useState(1);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityDto | null>(null);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activitySaving, setActivitySaving] = useState(false);
  const [activities, setActivities] = useState<ActivityDto[]>([]);
  const [showOnlyActive, setShowOnlyActive] = useState(true);

  // Marina states
  const [marinaSearchTerm, setMarinaSearchTerm] = useState('');
  const [marinaCurrentPage, setMarinaCurrentPage] = useState(1);
  const [marinaDialogOpen, setMarinaDialogOpen] = useState(false);
  const [editingMarina, setEditingMarina] = useState<MarinaDto | null>(null);
  const [marinaLoading, setMarinaLoading] = useState(true);
  const [marinaSaving, setMarinaSaving] = useState(false);
  const [marinas, setMarinas] = useState<MarinaDto[]>([]);
  const [showOnlyActiveMarinas, setShowOnlyActiveMarinas] = useState(true);

  // Vessel states
  const [vesselSearchTerm, setVesselSearchTerm] = useState('');
  const [vesselCurrentPage, setVesselCurrentPage] = useState(1);
  const [vesselDialogOpen, setVesselDialogOpen] = useState(false);
  const [editingVessel, setEditingVessel] = useState<VesselDto | null>(null);
  const [vesselLoading, setVesselLoading] = useState(true);
  const [vesselSaving, setVesselSaving] = useState(false);
  const [vessels, setVessels] = useState<VesselDto[]>([]);
  const [showOnlyActiveVessels, setShowOnlyActiveVessels] = useState(true);

  const itemsPerPage = 8;
  const [snackbar, setSnackbar] = useState<{open: boolean; message: string; severity: 'success' | 'error'}>({
    open: false,
    message: '',
    severity: 'success'
  });

  // People form state
  const [peopleFormData, setPeopleFormData] = useState<PeopleCreateRequestDto>({
    full_name: '',
    default_role: 'DIVER',
    document_number: '',
    phone: '',
    email: '',
    default_note_color: '#FFE599',
    default_highlight: '#8E7CC3',
    notes: '',
  });

  // Activity form state
  const [activityFormData, setActivityFormData] = useState<ActivityCreateRequestDto>({
    code: '',
    description: '',
    color: '#FF8A65',
    is_active: true,
  });

  // Marina form state
  const [marinaFormData, setMarinaFormData] = useState<MarinaCreateRequestDto>({
    name: '',
    is_active: true,
  });

  // Vessel form state
  const [vesselFormData, setVesselFormData] = useState<VesselCreateRequestDto>({
    name: '',
    capacity: undefined,
    is_active: true,
  });

  // Cargar datos
  useEffect(() => {
    if (currentTab === 0) {
      loadPeople();
    } else if (currentTab === 1) {
      loadActivities();
    } else if (currentTab === 2) {
      loadMarinas();
    } else {
      loadVessels();
    }
  }, [currentTab, showOnlyActive, showOnlyActiveMarinas, showOnlyActiveVessels]);

  const loadPeople = async () => {
    try {
      setPeopleLoading(true);
      const response = await peopleController.getAll();
      if (response?.success && response.data) {
        setPeople(response.data);
      }
    } catch (error) {
      console.error('Error al cargar personas:', error);
      showSnackbar('Error al cargar los maestros', 'error');
    } finally {
      setPeopleLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      setActivityLoading(true);
      const response = await activityController.getAll(showOnlyActive ? true : undefined);
      if (response?.success && response.data) {
        setActivities(response.data);
      }
    } catch (error) {
      console.error('Error al cargar actividades:', error);
      showSnackbar('Error al cargar las actividades', 'error');
    } finally {
      setActivityLoading(false);
    }
  };

  const loadMarinas = async () => {
    try {
      setMarinaLoading(true);
      const response = await marinaController.getAll(showOnlyActiveMarinas ? true : undefined);
      if (response?.success && response.data) {
        setMarinas(response.data);
      }
    } catch (error) {
      console.error('Error al cargar marinas:', error);
      showSnackbar('Error al cargar las marinas', 'error');
    } finally {
      setMarinaLoading(false);
    }
  };

  const loadVessels = async () => {
    try {
      setVesselLoading(true);
      const response = await vesselController.getAll(showOnlyActiveVessels ? true : undefined);
      if (response?.success && response.data) {
        setVessels(response.data);
      }
    } catch (error) {
      console.error('Error al cargar buques:', error);
      showSnackbar('Error al cargar los buques', 'error');
    } finally {
      setVesselLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  // ========== PEOPLE HANDLERS ==========
  const handleOpenPeopleDialog = (person?: PeopleDto) => {
    if (person) {
      setEditingPerson(person);
      setPeopleFormData({
        full_name: person.full_name || '',
        default_role: person.default_role || 'DIVER',
        document_number: person.document_number || '',
        phone: person.phone || '',
        email: person.email || '',
        default_note_color: person.default_note_color || '#FFE599',
        default_highlight: person.default_highlight || '#8E7CC3',
        notes: person.notes || '',
      });
    } else {
      setEditingPerson(null);
      setPeopleFormData({
        full_name: '',
        default_role: 'DIVER',
        document_number: '',
        phone: '',
        email: '',
        default_note_color: '#FFE599',
        default_highlight: '#8E7CC3',
        notes: '',
      });
    }
    setPeopleDialogOpen(true);
  };

  const handleClosePeopleDialog = () => {
    setPeopleDialogOpen(false);
    setEditingPerson(null);
    setPeopleFormData({
      full_name: '',
      default_role: 'DIVER',
      document_number: '',
      phone: '',
      email: '',
      default_note_color: '#FFE599',
      default_highlight: '#8E7CC3',
      notes: '',
    });
  };

  const handlePeopleInputChange = (field: keyof PeopleCreateRequestDto, value: any) => {
    setPeopleFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePeople = async () => {
    if (!peopleFormData.full_name.trim()) {
      showSnackbar('El nombre completo es requerido', 'error');
      return;
    }

    try {
      setPeopleSaving(true);
      if (editingPerson) {
        const updateData: PeopleUpdateRequestDto = { ...peopleFormData };
        const response = await peopleController.update(editingPerson.id, updateData);
        if (response?.success) {
          showSnackbar('Maestro actualizado exitosamente', 'success');
          await loadPeople();
          handleClosePeopleDialog();
        } else {
          showSnackbar('Error al actualizar el maestro', 'error');
        }
      } else {
        const response = await peopleController.create(peopleFormData);
        if (response?.success) {
          showSnackbar('Maestro creado exitosamente', 'success');
          await loadPeople();
          handleClosePeopleDialog();
        } else {
          showSnackbar('Error al crear el maestro', 'error');
        }
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      showSnackbar('Error al guardar el maestro', 'error');
    } finally {
      setPeopleSaving(false);
    }
  };

  // ========== ACTIVITY HANDLERS ==========
  const handleOpenActivityDialog = (activity?: ActivityDto) => {
    if (activity) {
      setEditingActivity(activity);
      setActivityFormData({
        code: activity.code || '',
        description: activity.description || '',
        color: activity.color || '#FF8A65',
        is_active: activity.is_active ?? true,
      });
    } else {
      setEditingActivity(null);
      setActivityFormData({
        code: '',
        description: '',
        color: '#FF8A65',
        is_active: true,
      });
    }
    setActivityDialogOpen(true);
  };

  const handleCloseActivityDialog = () => {
    setActivityDialogOpen(false);
    setEditingActivity(null);
    setActivityFormData({
      code: '',
      description: '',
      color: '#FF8A65',
      is_active: true,
    });
  };

  const handleActivityInputChange = (field: keyof ActivityCreateRequestDto, value: any) => {
    setActivityFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveActivity = async () => {
    if (!activityFormData.code.trim()) {
      showSnackbar('El código es requerido', 'error');
      return;
    }

    try {
      setActivitySaving(true);
      if (editingActivity) {
        const updateData: ActivityUpdateRequestDto = { ...activityFormData };
        const response = await activityController.update(editingActivity.id, updateData);
        if (response?.success) {
          showSnackbar('Actividad actualizada exitosamente', 'success');
          await loadActivities();
          handleCloseActivityDialog();
        } else {
          showSnackbar('Error al actualizar la actividad', 'error');
        }
      } else {
        const response = await activityController.create(activityFormData);
        if (response?.success) {
          showSnackbar('Actividad creada exitosamente', 'success');
          await loadActivities();
          handleCloseActivityDialog();
        } else {
          showSnackbar('Error al crear la actividad', 'error');
        }
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      showSnackbar('Error al guardar la actividad', 'error');
    } finally {
      setActivitySaving(false);
    }
  };

  // ========== MARINA HANDLERS ==========
  const handleOpenMarinaDialog = (marina?: MarinaDto) => {
    if (marina) {
      setEditingMarina(marina);
      setMarinaFormData({
        name: marina.name || '',
        is_active: marina.is_active ?? true,
      });
    } else {
      setEditingMarina(null);
      setMarinaFormData({
        name: '',
        is_active: true,
      });
    }
    setMarinaDialogOpen(true);
  };

  const handleCloseMarinaDialog = () => {
    setMarinaDialogOpen(false);
    setEditingMarina(null);
    setMarinaFormData({
      name: '',
      is_active: true,
    });
  };

  const handleMarinaInputChange = (field: keyof MarinaCreateRequestDto, value: any) => {
    setMarinaFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveMarina = async () => {
    if (!marinaFormData.name.trim()) {
      showSnackbar('El nombre es requerido', 'error');
      return;
    }

    try {
      setMarinaSaving(true);
      if (editingMarina) {
        const updateData: MarinaUpdateRequestDto = { ...marinaFormData };
        const response = await marinaController.update(editingMarina.id, updateData);
        if (response?.success) {
          showSnackbar('Marina actualizada exitosamente', 'success');
          await loadMarinas();
          handleCloseMarinaDialog();
        } else {
          showSnackbar('Error al actualizar la marina', 'error');
        }
      } else {
        const response = await marinaController.create(marinaFormData);
        if (response?.success) {
          showSnackbar('Marina creada exitosamente', 'success');
          await loadMarinas();
          handleCloseMarinaDialog();
        } else {
          showSnackbar('Error al crear la marina', 'error');
        }
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      showSnackbar('Error al guardar la marina', 'error');
    } finally {
      setMarinaSaving(false);
    }
  };

  // ========== VESSEL HANDLERS ==========
  const handleOpenVesselDialog = (vessel?: VesselDto) => {
    if (vessel) {
      setEditingVessel(vessel);
      setVesselFormData({
        name: vessel.name || '',
        capacity: vessel.capacity,
        is_active: vessel.is_active ?? true,
      });
    } else {
      setEditingVessel(null);
      setVesselFormData({
        name: '',
        capacity: undefined,
        is_active: true,
      });
    }
    setVesselDialogOpen(true);
  };

  const handleCloseVesselDialog = () => {
    setVesselDialogOpen(false);
    setEditingVessel(null);
    setVesselFormData({
      name: '',
      capacity: undefined,
      is_active: true,
    });
  };

  const handleVesselInputChange = (field: keyof VesselCreateRequestDto, value: any) => {
    setVesselFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveVessel = async () => {
    if (!vesselFormData.name.trim()) {
      showSnackbar('El nombre es requerido', 'error');
      return;
    }

    try {
      setVesselSaving(true);
      if (editingVessel) {
        const updateData: VesselUpdateRequestDto = { ...vesselFormData };
        const response = await vesselController.update(editingVessel.id, updateData);
        if (response?.success) {
          showSnackbar('Buque actualizado exitosamente', 'success');
          await loadVessels();
          handleCloseVesselDialog();
        } else {
          showSnackbar('Error al actualizar el buque', 'error');
        }
      } else {
        const response = await vesselController.create(vesselFormData);
        if (response?.success) {
          showSnackbar('Buque creado exitosamente', 'success');
          await loadVessels();
          handleCloseVesselDialog();
        } else {
          showSnackbar('Error al crear el buque', 'error');
        }
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      showSnackbar('Error al guardar el buque', 'error');
    } finally {
      setVesselSaving(false);
    }
  };

  // ========== HELPERS ==========
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'INSTRUCTOR':
        return { bg: '#e3f2fd', color: '#1976d2' };
      case 'CREW':
        return { bg: '#fff3e0', color: '#f57c00' };
      default:
        return { bg: '#f3e5f5', color: '#7b1fa2' };
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'INSTRUCTOR':
        return 'Instructor';
      case 'CREW':
        return 'Tripulación';
      default:
        return 'Buzo';
    }
  };

  // ========== FILTERS & PAGINATION ==========
  const filteredPeople = people.filter(person =>
    person.full_name.toLowerCase().includes(peopleSearchTerm.toLowerCase()) ||
    (person.email && person.email.toLowerCase().includes(peopleSearchTerm.toLowerCase())) ||
    (person.phone && person.phone.includes(peopleSearchTerm)) ||
    (person.document_number && person.document_number.includes(peopleSearchTerm))
  );

  const filteredActivities = activities.filter(activity =>
    activity.code.toLowerCase().includes(activitySearchTerm.toLowerCase()) ||
    (activity.description && activity.description.toLowerCase().includes(activitySearchTerm.toLowerCase()))
  );

  const filteredMarinas = marinas.filter(marina =>
    marina.name.toLowerCase().includes(marinaSearchTerm.toLowerCase())
  );

  const filteredVessels = vessels.filter(vessel =>
    vessel.name.toLowerCase().includes(vesselSearchTerm.toLowerCase())
  );

  const peopleTotalPages = Math.ceil(filteredPeople.length / itemsPerPage);
  const peopleStartIndex = (peopleCurrentPage - 1) * itemsPerPage;
  const peopleEndIndex = peopleStartIndex + itemsPerPage;
  const currentPeople = filteredPeople.slice(peopleStartIndex, peopleEndIndex);

  const activityTotalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const activityStartIndex = (activityCurrentPage - 1) * itemsPerPage;
  const activityEndIndex = activityStartIndex + itemsPerPage;
  const currentActivities = filteredActivities.slice(activityStartIndex, activityEndIndex);

  const marinaTotalPages = Math.ceil(filteredMarinas.length / itemsPerPage);
  const marinaStartIndex = (marinaCurrentPage - 1) * itemsPerPage;
  const marinaEndIndex = marinaStartIndex + itemsPerPage;
  const currentMarinas = filteredMarinas.slice(marinaStartIndex, marinaEndIndex);

  const vesselTotalPages = Math.ceil(filteredVessels.length / itemsPerPage);
  const vesselStartIndex = (vesselCurrentPage - 1) * itemsPerPage;
  const vesselEndIndex = vesselStartIndex + itemsPerPage;
  const currentVessels = filteredVessels.slice(vesselStartIndex, vesselEndIndex);

  const handlePeoplePageChange = (event: React.ChangeEvent<unknown> | null, page: number) => {
    setPeopleCurrentPage(page);
  };

  const handleActivityPageChange = (event: React.ChangeEvent<unknown> | null, page: number) => {
    setActivityCurrentPage(page);
  };

  const handleMarinaPageChange = (event: React.ChangeEvent<unknown> | null, page: number) => {
    setMarinaCurrentPage(page);
  };

  const handleVesselPageChange = (event: React.ChangeEvent<unknown> | null, page: number) => {
    setVesselCurrentPage(page);
  };

  // ========== RENDER PEOPLE SECTION ==========
  const renderPeopleSection = () => {
    if (peopleLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (filteredPeople.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <SchoolOutlinedIcon sx={{ fontSize: 80, color: '#bdbdbd', opacity: 0.6, mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#424242', mb: 1 }}>
            No hay maestros
          </Typography>
          <Typography variant="body2" sx={{ color: '#757575', mb: 3 }}>
            Comienza agregando maestros e instructores a tu sistema
          </Typography>
          <Button
            variant="contained"
            onClick={() => handleOpenPeopleDialog()}
            sx={{ backgroundColor: '#424242', '&:hover': { backgroundColor: '#303030' } }}
          >
            Agregar Maestro
          </Button>
        </Box>
      );
    }

    return (
      <>
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Buscar por nombre, email, teléfono o documento..."
          value={peopleSearchTerm}
          onChange={(e) => setPeopleSearchTerm(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: '#757575', mr: 1, fontSize: 20 }} />,
          }}
          sx={{
            maxWidth: { xs: '100%', sm: '70%' },
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
              fontSize: '14px',
            },
          }}
        />

        {/* Table */}
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f8f8' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Rol</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Teléfono</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Documento</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', textAlign: 'center', py: 0.5, fontSize: '14px' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPeople.map((person) => {
                const roleColors = getRoleColor(person.default_role);
                return (
                  <TableRow key={person.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <TableCell sx={{ py: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: person.default_highlight || '#8E7CC3',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '12px',
                          }}
                        >
                          {person.full_name.charAt(0).toUpperCase()}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '14px' }}>
                          {person.full_name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      <Chip
                        label={getRoleLabel(person.default_role)}
                        size="small"
                        sx={{
                          backgroundColor: roleColors.bg,
                          color: roleColors.color,
                          fontWeight: 'medium',
                          fontSize: '12px',
                          height: 20,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                        {person.email || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                        {person.phone || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 0.5 }}>
                      <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                        {person.document_number || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', py: 0.5 }}>
                      <IconButton 
                        size="small"
                        onClick={() => handleOpenPeopleDialog(person)}
                        sx={{ 
                          border: '1px solid #e0e0e0',
                          borderRadius: '4px',
                          color: '#757575',
                          p: 1,
                          '&:hover': { 
                            backgroundColor: '#f5f5f5',
                            borderColor: '#bdbdbd'
                          },
                        }}
                      >
                        <ModeEditOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, flexWrap: 'wrap', gap: 1.5 }}>
          <Typography variant="body2" sx={{ color: '#757575', fontSize: '14px' }}>
            Mostrando {peopleStartIndex + 1} - {Math.min(peopleEndIndex, filteredPeople.length)} de {filteredPeople.length} registros
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button
              variant="outlined"
              size="small"
              disabled={peopleCurrentPage === 1}
              onClick={() => handlePeoplePageChange(null, peopleCurrentPage - 1)}
              sx={{ border: '1px solid #e0e0e0', color: '#757575', textTransform: 'capitalize' }}
            >
              anterior
            </Button>
            {Array.from({ length: peopleTotalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant="text"
                size="small"
                onClick={() => handlePeoplePageChange(null, page)}
                sx={{
                  border: peopleCurrentPage === page ? 'none' : '1px solid #e0e0e0',
                  color: peopleCurrentPage === page ? 'white' : '#757575',
                  backgroundColor: peopleCurrentPage === page ? '#424242' : 'white',
                  minWidth: 36,
                  textTransform: 'capitalize',
                }}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outlined"
              size="small"
              disabled={peopleCurrentPage === peopleTotalPages}
              onClick={() => handlePeoplePageChange(null, peopleCurrentPage + 1)}
              sx={{ border: '1px solid #e0e0e0', color: '#757575', textTransform: 'capitalize' }}
            >
              siguiente
            </Button>
          </Box>
        </Box>
      </>
    );
  };

  // ========== RENDER ACTIVITY SECTION ==========
  const renderActivitySection = () => {
    if (activityLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (filteredActivities.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <EventOutlinedIcon sx={{ fontSize: 80, color: '#bdbdbd', opacity: 0.6, mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#424242', mb: 1 }}>
            No hay actividades
          </Typography>
          <Typography variant="body2" sx={{ color: '#757575', mb: 3 }}>
            Comienza agregando actividades a tu sistema
          </Typography>
          <Button
            variant="contained"
            onClick={() => handleOpenActivityDialog()}
            sx={{ backgroundColor: '#424242', '&:hover': { backgroundColor: '#303030' } }}
          >
            Agregar Actividad
          </Button>
        </Box>
      );
    }

    return (
      <>
        {/* Search Bar and Filter */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            placeholder="Buscar por código o descripción..."
            value={activitySearchTerm}
            onChange={(e) => setActivitySearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: '#757575', mr: 1, fontSize: 20 }} />,
            }}
            sx={{
              maxWidth: { xs: '100%', sm: '70%' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                fontSize: '14px',
              },
            }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={showOnlyActive}
                onChange={(e) => {
                  setShowOnlyActive(e.target.checked);
                  setActivityCurrentPage(1);
                }}
              />
            }
            label="Solo activas"
          />
        </Box>

        {/* Table */}
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f8f8' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Código</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Descripción</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Color</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', textAlign: 'center', py: 0.5, fontSize: '14px' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentActivities.map((activity) => (
                <TableRow key={activity.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell sx={{ py: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '14px' }}>
                      {activity.code}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 0.5 }}>
                    <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                      {activity.description || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 0.5 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '4px',
                        backgroundColor: activity.color || '#FF8A65',
                        border: '1px solid #e0e0e0',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 0.5 }}>
                    <Chip
                      label={activity.is_active ? 'Activa' : 'Inactiva'}
                      size="small"
                      sx={{
                        backgroundColor: activity.is_active ? '#e8f5e9' : '#ffebee',
                        color: activity.is_active ? '#2e7d32' : '#c62828',
                        fontWeight: 'medium',
                        fontSize: '12px',
                        height: 20,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', py: 0.5 }}>
                    <IconButton 
                      size="small"
                      onClick={() => handleOpenActivityDialog(activity)}
                      sx={{ 
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        color: '#757575',
                        p: 1,
                        '&:hover': { 
                          backgroundColor: '#f5f5f5',
                          borderColor: '#bdbdbd'
                        },
                      }}
                    >
                      <ModeEditOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, flexWrap: 'wrap', gap: 1.5 }}>
          <Typography variant="body2" sx={{ color: '#757575', fontSize: '14px' }}>
            Mostrando {activityStartIndex + 1} - {Math.min(activityEndIndex, filteredActivities.length)} de {filteredActivities.length} registros
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button
              variant="outlined"
              size="small"
              disabled={activityCurrentPage === 1}
              onClick={() => handleActivityPageChange(null, activityCurrentPage - 1)}
              sx={{ border: '1px solid #e0e0e0', color: '#757575', textTransform: 'capitalize' }}
            >
              anterior
            </Button>
            {Array.from({ length: activityTotalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant="text"
                size="small"
                onClick={() => handleActivityPageChange(null, page)}
                sx={{
                  border: activityCurrentPage === page ? 'none' : '1px solid #e0e0e0',
                  color: activityCurrentPage === page ? 'white' : '#757575',
                  backgroundColor: activityCurrentPage === page ? '#424242' : 'white',
                  minWidth: 36,
                  textTransform: 'capitalize',
                }}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outlined"
              size="small"
              disabled={activityCurrentPage === activityTotalPages}
              onClick={() => handleActivityPageChange(null, activityCurrentPage + 1)}
              sx={{ border: '1px solid #e0e0e0', color: '#757575', textTransform: 'capitalize' }}
            >
              siguiente
            </Button>
          </Box>
        </Box>
      </>
    );
  };

  // ========== RENDER MARINA SECTION ==========
  const renderMarinaSection = () => {
    if (marinaLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (filteredMarinas.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <AnchorIcon sx={{ fontSize: 80, color: '#bdbdbd', opacity: 0.6, mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#424242', mb: 1 }}>
            No hay marinas
          </Typography>
          <Typography variant="body2" sx={{ color: '#757575', mb: 3 }}>
            Comienza agregando marinas a tu sistema
          </Typography>
          <Button
            variant="contained"
            onClick={() => handleOpenMarinaDialog()}
            sx={{ backgroundColor: '#424242', '&:hover': { backgroundColor: '#303030' } }}
          >
            Agregar Marina
          </Button>
        </Box>
      );
    }

    return (
      <>
        {/* Search Bar and Filter */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            placeholder="Buscar por nombre..."
            value={marinaSearchTerm}
            onChange={(e) => setMarinaSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: '#757575', mr: 1, fontSize: 20 }} />,
            }}
            sx={{
              maxWidth: { xs: '100%', sm: '70%' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                fontSize: '14px',
              },
            }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={showOnlyActiveMarinas}
                onChange={(e) => {
                  setShowOnlyActiveMarinas(e.target.checked);
                  setMarinaCurrentPage(1);
                }}
              />
            }
            label="Solo activas"
          />
        </Box>

        {/* Table */}
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f8f8' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', textAlign: 'center', py: 0.5, fontSize: '14px' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentMarinas.map((marina) => (
                <TableRow key={marina.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell sx={{ py: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '14px' }}>
                      {marina.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 0.5 }}>
                    <Chip
                      label={marina.is_active ? 'Activa' : 'Inactiva'}
                      size="small"
                      sx={{
                        backgroundColor: marina.is_active ? '#e8f5e9' : '#ffebee',
                        color: marina.is_active ? '#2e7d32' : '#c62828',
                        fontWeight: 'medium',
                        fontSize: '12px',
                        height: 20,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', py: 0.5 }}>
                    <IconButton 
                      size="small"
                      onClick={() => handleOpenMarinaDialog(marina)}
                      sx={{ 
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        color: '#757575',
                        p: 1,
                        '&:hover': { 
                          backgroundColor: '#f5f5f5',
                          borderColor: '#bdbdbd'
                        },
                      }}
                    >
                      <ModeEditOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, flexWrap: 'wrap', gap: 1.5 }}>
          <Typography variant="body2" sx={{ color: '#757575', fontSize: '14px' }}>
            Mostrando {marinaStartIndex + 1} - {Math.min(marinaEndIndex, filteredMarinas.length)} de {filteredMarinas.length} registros
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button
              variant="outlined"
              size="small"
              disabled={marinaCurrentPage === 1}
              onClick={() => handleMarinaPageChange(null, marinaCurrentPage - 1)}
              sx={{ border: '1px solid #e0e0e0', color: '#757575', textTransform: 'capitalize' }}
            >
              anterior
            </Button>
            {Array.from({ length: marinaTotalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant="text"
                size="small"
                onClick={() => handleMarinaPageChange(null, page)}
                sx={{
                  border: marinaCurrentPage === page ? 'none' : '1px solid #e0e0e0',
                  color: marinaCurrentPage === page ? 'white' : '#757575',
                  backgroundColor: marinaCurrentPage === page ? '#424242' : 'white',
                  minWidth: 36,
                  textTransform: 'capitalize',
                }}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outlined"
              size="small"
              disabled={marinaCurrentPage === marinaTotalPages}
              onClick={() => handleMarinaPageChange(null, marinaCurrentPage + 1)}
              sx={{ border: '1px solid #e0e0e0', color: '#757575', textTransform: 'capitalize' }}
            >
              siguiente
            </Button>
          </Box>
        </Box>
      </>
    );
  };

  // ========== RENDER VESSEL SECTION ==========
  const renderVesselSection = () => {
    if (vesselLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (filteredVessels.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <DirectionsBoatIcon sx={{ fontSize: 80, color: '#bdbdbd', opacity: 0.6, mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#424242', mb: 1 }}>
            No hay buques
          </Typography>
          <Typography variant="body2" sx={{ color: '#757575', mb: 3 }}>
            Comienza agregando buques a tu sistema
          </Typography>
          <Button
            variant="contained"
            onClick={() => handleOpenVesselDialog()}
            sx={{ backgroundColor: '#424242', '&:hover': { backgroundColor: '#303030' } }}
          >
            Agregar Buque
          </Button>
        </Box>
      );
    }

    return (
      <>
        {/* Search Bar and Filter */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            placeholder="Buscar por nombre..."
            value={vesselSearchTerm}
            onChange={(e) => setVesselSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: '#757575', mr: 1, fontSize: 20 }} />,
            }}
            sx={{
              maxWidth: { xs: '100%', sm: '70%' },
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                fontSize: '14px',
              },
            }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={showOnlyActiveVessels}
                onChange={(e) => {
                  setShowOnlyActiveVessels(e.target.checked);
                  setVesselCurrentPage(1);
                }}
              />
            }
            label="Solo activos"
          />
        </Box>

        {/* Table */}
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f8f8' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Capacidad</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', py: 0.5, fontSize: '14px' }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', textAlign: 'center', py: 0.5, fontSize: '14px' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentVessels.map((vessel) => (
                <TableRow key={vessel.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell sx={{ py: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '14px' }}>
                      {vessel.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 0.5 }}>
                    <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px' }}>
                      {vessel.capacity ? `${vessel.capacity} personas` : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 0.5 }}>
                    <Chip
                      label={vessel.is_active ? 'Activo' : 'Inactivo'}
                      size="small"
                      sx={{
                        backgroundColor: vessel.is_active ? '#e8f5e9' : '#ffebee',
                        color: vessel.is_active ? '#2e7d32' : '#c62828',
                        fontWeight: 'medium',
                        fontSize: '12px',
                        height: 20,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', py: 0.5 }}>
                    <IconButton 
                      size="small"
                      onClick={() => handleOpenVesselDialog(vessel)}
                      sx={{ 
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        color: '#757575',
                        p: 1,
                        '&:hover': { 
                          backgroundColor: '#f5f5f5',
                          borderColor: '#bdbdbd'
                        },
                      }}
                    >
                      <ModeEditOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, flexWrap: 'wrap', gap: 1.5 }}>
          <Typography variant="body2" sx={{ color: '#757575', fontSize: '14px' }}>
            Mostrando {vesselStartIndex + 1} - {Math.min(vesselEndIndex, filteredVessels.length)} de {filteredVessels.length} registros
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button
              variant="outlined"
              size="small"
              disabled={vesselCurrentPage === 1}
              onClick={() => handleVesselPageChange(null, vesselCurrentPage - 1)}
              sx={{ border: '1px solid #e0e0e0', color: '#757575', textTransform: 'capitalize' }}
            >
              anterior
            </Button>
            {Array.from({ length: vesselTotalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant="text"
                size="small"
                onClick={() => handleVesselPageChange(null, page)}
                sx={{
                  border: vesselCurrentPage === page ? 'none' : '1px solid #e0e0e0',
                  color: vesselCurrentPage === page ? 'white' : '#757575',
                  backgroundColor: vesselCurrentPage === page ? '#424242' : 'white',
                  minWidth: 36,
                  textTransform: 'capitalize',
                }}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outlined"
              size="small"
              disabled={vesselCurrentPage === vesselTotalPages}
              onClick={() => handleVesselPageChange(null, vesselCurrentPage + 1)}
              sx={{ border: '1px solid #e0e0e0', color: '#757575', textTransform: 'capitalize' }}
            >
              siguiente
            </Button>
          </Box>
        </Box>
      </>
    );
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 6 }, py: 2, backgroundColor: 'white', height: 'calc(100vh - 64px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Tabs */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#424242', fontSize: { xs: '18px', sm: '20px' } }}>
              {currentTab === 0 ? 'Maestros' : currentTab === 1 ? 'Actividades' : currentTab === 2 ? 'Marinas' : 'Buques'}
            </Typography>
            <Chip
              label={`${currentTab === 0 ? filteredPeople.length : currentTab === 1 ? filteredActivities.length : currentTab === 2 ? filteredMarinas.length : filteredVessels.length} registros`}
              size="small"
              sx={{
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                fontWeight: 'medium',
                fontSize: { xs: '11px', sm: '12px' },
                height: { xs: 22, sm: 24 },
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 } }}>
            <Button
              variant="contained"
              startIcon={<AddIcon sx={{ fontSize: { xs: 18, sm: 20 }, display: { xs: 'none', sm: 'flex' } }} />}
              size="small"
              onClick={() => {
                if (currentTab === 0) handleOpenPeopleDialog();
                else if (currentTab === 1) handleOpenActivityDialog();
                else if (currentTab === 2) handleOpenMarinaDialog();
                else handleOpenVesselDialog();
              }}
              sx={{
                backgroundColor: '#424242',
                fontSize: { xs: '13px', sm: '14px' },
                px: { xs: 1.5, sm: 2 },
                py: 0.5,
                textTransform: 'capitalize',
                '&:hover': { backgroundColor: '#303030' },
              }}
            >
              Nuevo
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon sx={{ fontSize: { xs: 18, sm: 20 }, display: { xs: 'none', sm: 'flex' } }} />}
              size="small"
              sx={{
                borderColor: '#e0e0e0',
                color: '#424242',
                fontSize: { xs: '13px', sm: '14px' },
                px: { xs: 1.5, sm: 2 },
                py: 0.5,
                textTransform: 'capitalize',
                '&:hover': { borderColor: '#bdbdbd' },
              }}
            >
              Exportar
            </Button>
          </Box>
        </Box>

        {/* Tabs */}
        <Tabs value={currentTab} onChange={(e, newValue) => {
          setCurrentTab(newValue);
          setPeopleCurrentPage(1);
          setActivityCurrentPage(1);
          setMarinaCurrentPage(1);
          setVesselCurrentPage(1);
        }} sx={{ borderBottom: '1px solid #e0e0e0', mb: 2 }}>
          <Tab label="Maestros" icon={<SchoolOutlinedIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
          <Tab label="Actividades" icon={<EventOutlinedIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
          <Tab label="Marinas" icon={<AnchorIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
          <Tab label="Buques" icon={<DirectionsBoatIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {currentTab === 0 ? renderPeopleSection() : currentTab === 1 ? renderActivitySection() : currentTab === 2 ? renderMarinaSection() : renderVesselSection()}
      </Box>

      {/* People Dialog */}
      <Dialog
        open={peopleDialogOpen}
        onClose={handleClosePeopleDialog}
        maxWidth="sm"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: 2, maxWidth: '500px' } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, px: 2, pt: 2 }}>
          {editingPerson ? 'Editar Maestro' : 'Nuevo Maestro'}
          <IconButton onClick={handleClosePeopleDialog} size="small" sx={{ color: '#757575' }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 2, pb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField fullWidth label="Nombre completo *" value={peopleFormData.full_name} onChange={(e) => handlePeopleInputChange('full_name', e.target.value)} size="small" required />
            <FormControl fullWidth size="small">
              <InputLabel>Rol *</InputLabel>
              <Select value={peopleFormData.default_role} label="Rol *" onChange={(e) => handlePeopleInputChange('default_role', e.target.value)}>
                <MenuItem value="DIVER">Buzo</MenuItem>
                <MenuItem value="INSTRUCTOR">Instructor</MenuItem>
                <MenuItem value="CREW">Tripulación</MenuItem>
              </Select>
            </FormControl>
            <TextField fullWidth label="Número de documento" value={peopleFormData.document_number} onChange={(e) => handlePeopleInputChange('document_number', e.target.value)} size="small" />
            <TextField fullWidth label="Teléfono" value={peopleFormData.phone} onChange={(e) => handlePeopleInputChange('phone', e.target.value)} size="small" />
            <TextField fullWidth label="Email" type="email" value={peopleFormData.email} onChange={(e) => handlePeopleInputChange('email', e.target.value)} size="small" />
            <TextField fullWidth label="Color de nota" type="color" value={peopleFormData.default_note_color} onChange={(e) => handlePeopleInputChange('default_note_color', e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
            <TextField fullWidth label="Color de resaltado" type="color" value={peopleFormData.default_highlight} onChange={(e) => handlePeopleInputChange('default_highlight', e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
            <TextField fullWidth label="Notas" value={peopleFormData.notes} onChange={(e) => handlePeopleInputChange('notes', e.target.value)} size="small" multiline rows={3} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, pt: 1, gap: 1 }}>
          <Button variant="outlined" onClick={handleClosePeopleDialog} disabled={peopleSaving} sx={{ borderColor: '#e0e0e0', color: '#424242', textTransform: 'capitalize' }}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSavePeople} disabled={peopleSaving} sx={{ backgroundColor: '#424242', textTransform: 'capitalize', '&:hover': { backgroundColor: '#303030' } }}>
            {peopleSaving ? <CircularProgress size={20} /> : (editingPerson ? 'Actualizar' : 'Crear')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Activity Dialog */}
      <Dialog
        open={activityDialogOpen}
        onClose={handleCloseActivityDialog}
        maxWidth="sm"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: 2, maxWidth: '500px' } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, px: 2, pt: 2 }}>
          {editingActivity ? 'Editar Actividad' : 'Nueva Actividad'}
          <IconButton onClick={handleCloseActivityDialog} size="small" sx={{ color: '#757575' }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 2, pb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField fullWidth label="Código *" value={activityFormData.code} onChange={(e) => handleActivityInputChange('code', e.target.value)} size="small" required />
            <TextField fullWidth label="Descripción" value={activityFormData.description} onChange={(e) => handleActivityInputChange('description', e.target.value)} size="small" />
            <TextField fullWidth label="Color" type="color" value={activityFormData.color} onChange={(e) => handleActivityInputChange('color', e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
            <FormControlLabel
              control={
                <Switch
                  checked={activityFormData.is_active ?? true}
                  onChange={(e) => handleActivityInputChange('is_active', e.target.checked)}
                />
              }
              label="Activa"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, pt: 1, gap: 1 }}>
          <Button variant="outlined" onClick={handleCloseActivityDialog} disabled={activitySaving} sx={{ borderColor: '#e0e0e0', color: '#424242', textTransform: 'capitalize' }}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSaveActivity} disabled={activitySaving} sx={{ backgroundColor: '#424242', textTransform: 'capitalize', '&:hover': { backgroundColor: '#303030' } }}>
            {activitySaving ? <CircularProgress size={20} /> : (editingActivity ? 'Actualizar' : 'Crear')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Marina Dialog */}
      <Dialog
        open={marinaDialogOpen}
        onClose={handleCloseMarinaDialog}
        maxWidth="sm"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: 2, maxWidth: '500px' } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, px: 2, pt: 2 }}>
          {editingMarina ? 'Editar Marina' : 'Nueva Marina'}
          <IconButton onClick={handleCloseMarinaDialog} size="small" sx={{ color: '#757575' }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 2, pb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField fullWidth label="Nombre *" value={marinaFormData.name} onChange={(e) => handleMarinaInputChange('name', e.target.value)} size="small" required />
            <FormControlLabel
              control={
                <Switch
                  checked={marinaFormData.is_active ?? true}
                  onChange={(e) => handleMarinaInputChange('is_active', e.target.checked)}
                />
              }
              label="Activa"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, pt: 1, gap: 1 }}>
          <Button variant="outlined" onClick={handleCloseMarinaDialog} disabled={marinaSaving} sx={{ borderColor: '#e0e0e0', color: '#424242', textTransform: 'capitalize' }}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSaveMarina} disabled={marinaSaving} sx={{ backgroundColor: '#424242', textTransform: 'capitalize', '&:hover': { backgroundColor: '#303030' } }}>
            {marinaSaving ? <CircularProgress size={20} /> : (editingMarina ? 'Actualizar' : 'Crear')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Vessel Dialog */}
      <Dialog
        open={vesselDialogOpen}
        onClose={handleCloseVesselDialog}
        maxWidth="sm"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: 2, maxWidth: '500px' } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, px: 2, pt: 2 }}>
          {editingVessel ? 'Editar Buque' : 'Nuevo Buque'}
          <IconButton onClick={handleCloseVesselDialog} size="small" sx={{ color: '#757575' }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 2, pb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField fullWidth label="Nombre *" value={vesselFormData.name} onChange={(e) => handleVesselInputChange('name', e.target.value)} size="small" required />
            <TextField 
              fullWidth 
              label="Capacidad" 
              type="number"
              value={vesselFormData.capacity || ''} 
              onChange={(e) => handleVesselInputChange('capacity', e.target.value ? parseInt(e.target.value) : undefined)} 
              size="small"
              inputProps={{ min: 0 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={vesselFormData.is_active ?? true}
                  onChange={(e) => handleVesselInputChange('is_active', e.target.checked)}
                />
              }
              label="Activo"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, pt: 1, gap: 1 }}>
          <Button variant="outlined" onClick={handleCloseVesselDialog} disabled={vesselSaving} sx={{ borderColor: '#e0e0e0', color: '#424242', textTransform: 'capitalize' }}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSaveVessel} disabled={vesselSaving} sx={{ backgroundColor: '#424242', textTransform: 'capitalize', '&:hover': { backgroundColor: '#303030' } }}>
            {vesselSaving ? <CircularProgress size={20} /> : (editingVessel ? 'Actualizar' : 'Crear')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MaestrosPage;
