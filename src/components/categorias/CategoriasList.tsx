"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CategoriaDialog from "./CategoriaDialog";
import CategoriaEditDialog from "./CategoriaEditDialog";
import CategoriasListSkeleton from "./CategoriasListSkeleton";
import { categoryController, subcategoryController } from "@/components/core";

interface Subcategoria {
  id: string;
  nombre: string;
  descripcion?: string;
  categoriaId?: string;
  estado?: string;
  prioridad?: number;
}

interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  subcategorias?: Subcategoria[];
  estado?: string;
  prioridad?: number;
}

export default function CategoriasList() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [isSubcategoria, setIsSubcategoria] = useState(false);
  const [currentCategoriaId, setCurrentCategoriaId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string; nombre: string; isSubcat: boolean} | null>(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{open: boolean; message: string; severity: 'success' | 'error'}>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Cargar categorías y subcategorías desde la API
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      
      // Cargar categorías
      const categoriesResponse = await categoryController.getAll();
      
      // Cargar subcategorías
      const subcategoriesResponse = await subcategoryController.getAll();
      
      if (categoriesResponse?.success && categoriesResponse.data) {
        // Mapear categorías de la API al formato del componente
        const mappedCategories: Categoria[] = categoriesResponse.data.map(cat => ({
          id: cat.id,
          nombre: cat.name,
          descripcion: cat.description,
        }));

        // Si hay subcategorías, agruparlas por categoría
        if (subcategoriesResponse?.success && subcategoriesResponse.data) {
          const subcategories = subcategoriesResponse.data.map(sub => ({
            id: sub.id,
            nombre: sub.name,
            descripcion: sub.description,
            categoriaId: sub.category_id,
          }));

          // Agrupar subcategorías por categoría
          mappedCategories.forEach(cat => {
            cat.subcategorias = subcategories.filter(sub => sub.categoriaId === cat.id);
          });
        }

        setCategorias(mappedCategories);
      } else {
        setCategorias([]);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar las categorías',
        severity: 'error'
      });
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNuevo = () => {
    setIsSubcategoria(false);
    setCurrentCategoriaId(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsSubcategoria(false);
    setCurrentCategoriaId(null);
  };

  const handleSave = async (data: { 
    nombre: string; 
    descripcion: string; 
    categoriaId?: string;
  }) => {
    try {
      if (isSubcategoria) {
        // Validar que haya una categoría asignada
        if (!currentCategoriaId) {
          setSnackbar({
            open: true,
            message: 'Error: Debe seleccionar una categoría para la subcategoría',
            severity: 'error'
          });
          return;
        }
        // Crear subcategoría
        const response = await subcategoryController.create({
          category_id: currentCategoriaId,
          name: data.nombre,
          description: data.descripcion,
        });

        if (response?.success) {
          setSnackbar({
            open: true,
            message: 'Subcategoría creada exitosamente',
            severity: 'success'
          });
          handleCloseDialog(); // Cerrar diálogo y limpiar estado
          await loadCategories(); // Recargar datos
        } else {
          setSnackbar({
            open: true,
            message: 'Error al crear la subcategoría',
            severity: 'error'
          });
        }
      } else {
        // Crear categoría
        const response = await categoryController.create({
          name: data.nombre,
          description: data.descripcion,
        });

        if (response?.success) {
          setSnackbar({
            open: true,
            message: 'Categoría creada exitosamente',
            severity: 'success'
          });
          handleCloseDialog(); // Cerrar diálogo y limpiar estado
          await loadCategories(); // Recargar datos
        } else {
          setSnackbar({
            open: true,
            message: 'Error al crear la categoría',
            severity: 'error'
          });
        }
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      setSnackbar({
        open: true,
        message: 'Error al guardar. Por favor, intenta de nuevo',
        severity: 'error'
      });
    }
  };

  const handleSaveEdit = async (data: { 
    id: string;
    nombre: string; 
    descripcion: string; 
    categoriaId?: string;
    estado: string;
    prioridad: number;
  }) => {
    try {
      if (isSubcategoria) {
        // Actualizar subcategoría
        if (!data.categoriaId) {
          setSnackbar({
            open: true,
            message: 'Error: No se encontró la categoría',
            severity: 'error'
          });
          return;
        }

        const response = await subcategoryController.update(data.id, {
          category_id: data.categoriaId,
          name: data.nombre,
          description: data.descripcion,
        });

        if (response?.success) {
          setSnackbar({
            open: true,
            message: 'Subcategoría actualizada exitosamente',
            severity: 'success'
          });
          setOpenEditDialog(false); // Cerrar diálogo
          setEditingData(null);
          await loadCategories(); // Recargar datos
        } else {
          setSnackbar({
            open: true,
            message: 'Error al actualizar la subcategoría',
            severity: 'error'
          });
        }
      } else {
        // Actualizar categoría
        const response = await categoryController.update(data.id, {
          name: data.nombre,
          description: data.descripcion,
        });

        if (response?.success) {
          setSnackbar({
            open: true,
            message: 'Categoría actualizada exitosamente',
            severity: 'success'
          });
          setOpenEditDialog(false); // Cerrar diálogo
          setEditingData(null);
          await loadCategories(); // Recargar datos
        } else {
          setSnackbar({
            open: true,
            message: 'Error al actualizar la categoría',
            severity: 'error'
          });
        }
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      setSnackbar({
        open: true,
        message: 'Error al actualizar. Por favor, intenta de nuevo',
        severity: 'error'
      });
    }
  };

  const handleEditar = (id: string, isSubcat: boolean = false) => {
    let dataToEdit: any = null;
    
    if (isSubcat) {
      // Buscar subcategoría
      for (const cat of categorias) {
        const sub = cat.subcategorias?.find(s => s.id === id);
        if (sub) {
          dataToEdit = { 
            ...sub, 
            categoriaId: cat.id,
            estado: sub.estado || 'Activo',
            prioridad: sub.prioridad || 10,
          };
          break;
        }
      }
    } else {
      // Buscar categoría
      const cat = categorias.find(c => c.id === id);
      if (cat) {
        dataToEdit = {
          ...cat,
          estado: cat.estado || 'Activo',
          prioridad: cat.prioridad || 10,
        };
      }
    }

    if (dataToEdit) {
      setEditingData(dataToEdit);
      setIsSubcategoria(isSubcat);
      setOpenEditDialog(true);
    }
  };

  const handleEliminar = (id: string, nombre: string, isSubcat: boolean = false) => {
    setItemToDelete({ id, nombre, isSubcat });
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.isSubcat) {
        // Eliminar subcategoría
        const response = await subcategoryController.delete(itemToDelete.id);

        if (response?.success) {
          setSnackbar({
            open: true,
            message: 'Subcategoría eliminada exitosamente',
            severity: 'success'
          });
          await loadCategories(); // Recargar datos
        } else {
          setSnackbar({
            open: true,
            message: 'Error al eliminar la subcategoría',
            severity: 'error'
          });
        }
      } else {
        // Eliminar categoría
        const response = await categoryController.delete(itemToDelete.id);

        if (response?.success) {
          setSnackbar({
            open: true,
            message: 'Categoría eliminada exitosamente',
            severity: 'success'
          });
          await loadCategories(); // Recargar datos
        } else {
          setSnackbar({
            open: true,
            message: 'Error al eliminar la categoría',
            severity: 'error'
          });
        }
      }

      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error al eliminar:', error);
      setSnackbar({
        open: true,
        message: 'Error al eliminar. Por favor, intenta de nuevo',
        severity: 'error'
      });
    }
  };

  const handleAddSubcategoria = (categoriaId: string) => {
    setCurrentCategoriaId(categoriaId);
    setIsSubcategoria(true);
    setOpenDialog(true);
  };

  // Mostrar skeleton mientras carga
  if (loading) {
    return <CategoriasListSkeleton />;
  }

  // Si no hay categorías, mostrar estado vacío
  if (categorias.length === 0) {
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
            <FolderIcon 
              sx={{ 
                fontSize: { xs: 60, sm: 70 }, 
                color: '#fdd835',
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
            No hay categorías
          </Typography>

          {/* Descripción */}
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#757575',
              mb: 3,
              fontSize: '15px',
              lineHeight: 1.4
            }}
          >
            Comienza organizando tus productos creando categorías y subcategorías
          </Typography>

          {/* Botón Añadir categoría */}
          <Button
            variant="contained"
            onClick={handleNuevo}
            sx={{
              backgroundColor: '#424242',
              fontSize: '15px',
              px: 3.5,
              py: 1.2,
              borderRadius: 2,
              textTransform: 'capitalize',
              fontWeight: 'medium',
              boxShadow: 'none',
              '&:hover': { 
                backgroundColor: '#303030',
                boxShadow: 'none'
              },
            }}
          >
            Añadir categoría
          </Button>

          {/* Enlace de ayuda */}
          <Box sx={{ mt: 3 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#757575',
                fontSize: '13px',
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

        {/* Dialog para crear nueva categoría */}
        <CategoriaDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onSave={handleSave}
          isSubcategoria={isSubcategoria}
          categorias={categorias.map(c => ({ id: c.id, nombre: c.nombre }))}
          categoriaIdFija={isSubcategoria && currentCategoriaId ? currentCategoriaId : undefined}
        />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#424242', fontSize: { xs: '18px', sm: '20px' } }}>
          Categorías
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          onClick={handleNuevo}
          sx={{
            bgcolor: "#1a1a1a",
            "&:hover": { bgcolor: "#000" },
            textTransform: "none",
            borderRadius: 1,
            py: 0.5,
            px: 1.5,
            fontSize: { xs: "12px", sm: "13px" },
            minHeight: "32px",
          }}
        >
          Nuevo
        </Button>
      </Box>

      {/* Lista de Categorías */}
      <Stack spacing={1}>
        {categorias.map((categoria) => (
          <Paper
            key={categoria.id}
            elevation={0}
            sx={{
              border: "1px solid #e5e5e5",
              borderRadius: 1,
              overflow: "hidden",
              bgcolor: "white",
            }}
          >
            {/* Categoría Principal */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 1.25,
                px: { xs: 1.5, sm: 2 },
                "&:hover": { bgcolor: "#fafafa" },
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                gap: { xs: 1, sm: 0 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: { xs: '1 1 100%', sm: '1 1 auto' } }}>
                <Box 
                  sx={{ 
                    width: { xs: 28, sm: 32 }, 
                    height: { xs: 28, sm: 32 }, 
                    borderRadius: 1, 
                    bgcolor: "#f5f5f5", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FolderIcon sx={{ color: "#fdd835", fontSize: { xs: 18, sm: 22 } }} />
                </Box>
                <Box sx={{ lineHeight: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight="500" sx={{ fontSize: { xs: "13px", sm: "14px" }, color: "#333", lineHeight: 1.2, mb: 0 }}>
                    {categoria.nombre}
                  </Typography>
                  {categoria.descripcion && (
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "11px", sm: "12px" }, lineHeight: 1.2, display: { xs: 'block', sm: 'block' }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {categoria.descripcion}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                <Button
                  size="small"
                  startIcon={<AddIcon sx={{ fontSize: { xs: 14, sm: 15 }, display: { xs: 'none', sm: 'flex' } }} />}
                  onClick={() => handleAddSubcategoria(categoria.id)}
                  sx={{ 
                    textTransform: "none", 
                    fontSize: { xs: "11px", sm: "13px" },
                    py: 0.5,
                    px: { xs: 1, sm: 1.5 },
                    minWidth: "auto",
                    color: "#666",
                    border: "1px solid #e0e0e0",
                    borderRadius: 0.5,
                    bgcolor: "white",
                    "&:hover": { bgcolor: "#f5f5f5", borderColor: "#d0d0d0" },
                  }}
                >
                  Subcategoría
                </Button>
                <IconButton
                  size="small"
                  onClick={() => handleEditar(categoria.id, false)}
                  sx={{ 
                    color: "#666",
                    p: { xs: 0.5, sm: 1 },
                    border: "1px solid #e0e0e0",
                    borderRadius: 0.5,
                    bgcolor: "white",
                    "&:hover": { bgcolor: "#f5f5f5", borderColor: "#d0d0d0" },
                  }}
                >
                  <EditIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleEliminar(categoria.id, categoria.nombre, false)}
                  sx={{ 
                    color: "#f44336",
                    p: { xs: 0.5, sm: 1 },
                    border: "1px solid #e0e0e0",
                    borderRadius: 0.5,
                    bgcolor: "white",
                    "&:hover": { bgcolor: "#fef5f5", borderColor: "#d0d0d0" },
                  }}
                >
                  <DeleteIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                </IconButton>
              </Box>
            </Box>

            {/* Subcategorías */}
            {categoria.subcategorias && categoria.subcategorias.length > 0 && (
              <Box>
                {categoria.subcategorias.map((sub) => (
                  <Box
                    key={sub.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      py: 1.25,
                      px: { xs: 1.5, sm: 2 },
                      pl: { xs: 3, sm: 5 },
                      borderTop: "1px solid #f5f5f5",
                      "&:hover": { bgcolor: "#fafafa" },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, minWidth: 0, flex: 1 }}>
                      <Box 
                        sx={{ 
                          width: { xs: 24, sm: 28 }, 
                          height: { xs: 24, sm: 28 }, 
                          borderRadius: 1, 
                          bgcolor: "#f5f5f5", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FolderIcon sx={{ color: "#fdd835", fontSize: { xs: 16, sm: 20 } }} />
                      </Box>
                      <Box sx={{ lineHeight: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight="500" sx={{ fontSize: { xs: "12px", sm: "13px" }, color: "#333", lineHeight: 1.2, mb: 0 }}>
                          {sub.nombre}
                        </Typography>
                        {sub.descripcion && (
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "10.5px", sm: "11.5px" }, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                            {sub.descripcion}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditar(sub.id, true)}
                        sx={{ 
                          color: "#666",
                          p: { xs: 0.5, sm: 1 },
                          border: "1px solid #e0e0e0",
                          borderRadius: 0.5,
                          bgcolor: "white",
                          "&:hover": { bgcolor: "#f5f5f5", borderColor: "#d0d0d0" },
                        }}
                      >
                        <EditIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEliminar(sub.id, sub.nombre, true)}
                        sx={{ 
                          color: "#f44336",
                          p: { xs: 0.5, sm: 1 },
                          border: "1px solid #e0e0e0",
                          borderRadius: 0.5,
                          bgcolor: "white",
                          "&:hover": { bgcolor: "#fef5f5", borderColor: "#d0d0d0" },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        ))}
      </Stack>

      {/* Dialog para crear nueva categoría/subcategoría */}
      <CategoriaDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSave}
        isSubcategoria={isSubcategoria}
        categorias={categorias.map(c => ({ id: c.id, nombre: c.nombre }))}
        categoriaIdFija={isSubcategoria && currentCategoriaId ? currentCategoriaId : undefined}
      />

      {/* Dialog para editar categoría/subcategoría */}
      {editingData && (
        <CategoriaEditDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          onSave={handleSaveEdit}
          categoriaInicial={editingData}
          isSubcategoria={isSubcategoria}
          categorias={categorias.map(c => ({ id: c.id, nombre: c.nombre }))}
        />
      )}

      {/* Modal de Eliminar */}
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
          fontSize: '16px'
        }}>
          Eliminar {itemToDelete?.isSubcat ? 'Subcategoría' : 'Categoría'}
        </DialogTitle>

        <DialogContent sx={{ px: 1.5, py: 1 }}>
          <Typography variant="body2" sx={{ color: '#424242', fontSize: '13px', lineHeight: 1.4 }}>
            ¿Estás seguro de que deseas eliminar {itemToDelete?.isSubcat ? 'la subcategoría' : 'la categoría'}{' '}
            <Typography component="span" sx={{ fontWeight: 'bold', color: '#f44336', fontSize: '13px' }}>
              {itemToDelete?.nombre}
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

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

