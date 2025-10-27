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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CategoriaDialog from "./CategoriaDialog";
import CategoriaEditDialog from "./CategoriaEditDialog";
import CategoriasListSkeleton from "./CategoriasListSkeleton";

interface Subcategoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion?: string;
  imagen?: string;
  categoriaId?: string;
  estado?: string;
  prioridad?: number;
}

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion?: string;
  subcategorias?: Subcategoria[];
  imagen?: string;
  estado?: string;
  prioridad?: number;
}

const initialCategorias: Categoria[] = [
  {
    id: "1",
    nombre: "Otros",
    slug: "Otros",
    subcategorias: [
      { id: "1-1", nombre: "Otros servicios", slug: "Otros servicios" },
      { id: "1-2", nombre: "Especialidades Ambientales", slug: "Especialidades ambientales" },
    ],
  },
  {
    id: "2",
    nombre: "Aventuras",
    slug: "Aventuras",
    subcategorias: [
      { id: "2-1", nombre: "#SomosOcsano", slug: "Somos ocsano" },
      { id: "2-2", nombre: "Principales", slug: "principales" },
    ],
  },
  {
    id: "3",
    nombre: "Otros servicios",
    slug: "Mis cursos, formaciones y otros servicios",
    subcategorias: [
      { id: "3-1", nombre: "¿Aún no eres buzo? Inicia aquí", slug: "¿Aún no eres buzo?" },
      { id: "3-2", nombre: "¡Formación PADI a otro nivel!", slug: "¡Formación PADI a otro nivel!" },
      { id: "3-3", nombre: "¿Ya eres buzo?", slug: "¿Ya eres buzo?" },
    ],
  },
];

export default function CategoriasList() {
  const [categorias, setCategorias] = useState<Categoria[]>(initialCategorias);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [isSubcategoria, setIsSubcategoria] = useState(false);
  const [currentCategoriaId, setCurrentCategoriaId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string; nombre: string; isSubcat: boolean} | null>(null);
  const [loading, setLoading] = useState(true);

  // Simular carga de datos (puedes reemplazar esto con una llamada API real)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleNuevo = () => {
    setIsSubcategoria(false);
    setCurrentCategoriaId(null);
    setOpenDialog(true);
  };

  const handleSave = (data: { 
    nombre: string; 
    slug: string; 
    descripcion: string; 
    imagen?: string;
    categoriaId?: string;
  }) => {
    if (isSubcategoria && currentCategoriaId) {
      // Agregar subcategoría
      setCategorias(prevCategorias => 
        prevCategorias.map(cat => 
          cat.id === currentCategoriaId 
            ? {
                ...cat,
                subcategorias: [
                  ...(cat.subcategorias || []),
                  {
                    id: Date.now().toString(),
                    nombre: data.nombre,
                    slug: data.slug,
                    descripcion: data.descripcion,
                    imagen: data.imagen,
                    categoriaId: currentCategoriaId,
                  }
                ]
              }
            : cat
        )
      );
    } else {
      // Agregar categoría nueva
      const nuevaCategoria: Categoria = {
        id: Date.now().toString(),
        nombre: data.nombre,
        slug: data.slug,
        descripcion: data.descripcion,
        imagen: data.imagen,
        subcategorias: [],
      };
      setCategorias(prev => [...prev, nuevaCategoria]);
    }
  };

  const handleSaveEdit = (data: { 
    id: string;
    nombre: string; 
    slug: string; 
    descripcion: string; 
    imagen?: string;
    categoriaId?: string;
    estado: string;
    prioridad: number;
  }) => {
    // Editar categoría o subcategoría
    if (isSubcategoria) {
      setCategorias(prevCategorias => 
        prevCategorias.map(cat => ({
          ...cat,
          subcategorias: cat.subcategorias?.map(sub => 
            sub.id === data.id 
              ? {
                  ...sub,
                  nombre: data.nombre,
                  slug: data.slug,
                  descripcion: data.descripcion,
                  imagen: data.imagen,
                  categoriaId: data.categoriaId,
                  estado: data.estado,
                  prioridad: data.prioridad,
                }
              : sub
          )
        }))
      );
    } else {
      setCategorias(prevCategorias => 
        prevCategorias.map(cat => 
          cat.id === data.id 
            ? {
                ...cat,
                nombre: data.nombre,
                slug: data.slug,
                descripcion: data.descripcion,
                imagen: data.imagen,
                estado: data.estado,
                prioridad: data.prioridad,
              }
            : cat
        )
      );
    }
  };

  const handleEditar = (id: string, isSubcat: boolean = false) => {
    let dataToEdit: any = null;
    
    if (isSubcat) {
      // Buscar subcategoría
      for (const cat of categorias) {
        const sub = cat.subcategorias?.find(s => s.id === id);
        if (sub) {
          dataToEdit = { ...sub, categoriaId: cat.id };
          break;
        }
      }
    } else {
      // Buscar categoría
      dataToEdit = categorias.find(c => c.id === id);
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

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.isSubcat) {
      // Eliminar subcategoría
      setCategorias(prevCategorias =>
        prevCategorias.map(cat => ({
          ...cat,
          subcategorias: cat.subcategorias?.filter(sub => sub.id !== itemToDelete.id)
        }))
      );
    } else {
      // Eliminar categoría
      setCategorias(prevCategorias =>
        prevCategorias.filter(cat => cat.id !== itemToDelete.id)
      );
    }

    handleCloseDeleteModal();
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
          onClose={() => setOpenDialog(false)}
          onSave={handleSave}
          isSubcategoria={isSubcategoria}
          categorias={categorias.map(c => ({ id: c.id, nombre: c.nombre }))}
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
                {categoria.imagen ? (
                  <Box 
                    sx={{ 
                      width: { xs: 28, sm: 32 }, 
                      height: { xs: 28, sm: 32 }, 
                      borderRadius: 1, 
                      overflow: "hidden",
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <img 
                      src={categoria.imagen} 
                      alt={categoria.nombre}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                ) : (
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
                )}
                <Box sx={{ lineHeight: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight="500" sx={{ fontSize: { xs: "13px", sm: "14px" }, color: "#333", lineHeight: 1.2, mb: 0 }}>
                    {categoria.nombre}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "11px", sm: "12px" }, lineHeight: 1.2, display: { xs: 'block', sm: 'block' }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {categoria.slug}
                  </Typography>
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
                      {sub.imagen ? (
                        <Box 
                          sx={{ 
                            width: { xs: 24, sm: 28 }, 
                            height: { xs: 24, sm: 28 }, 
                            borderRadius: 1, 
                            overflow: "hidden",
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <img 
                            src={sub.imagen} 
                            alt={sub.nombre}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </Box>
                      ) : (
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
                      )}
                      <Box sx={{ lineHeight: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight="500" sx={{ fontSize: { xs: "12px", sm: "13px" }, color: "#333", lineHeight: 1.2, mb: 0 }}>
                          {sub.nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "10.5px", sm: "11.5px" }, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                          {sub.slug}
                        </Typography>
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
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        isSubcategoria={isSubcategoria}
        categorias={categorias.map(c => ({ id: c.id, nombre: c.nombre }))}
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
        }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#424242', fontSize: '16px' }}>
            Eliminar {itemToDelete?.isSubcat ? 'Subcategoría' : 'Categoría'}
          </Typography>
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
    </Box>
  );
}

