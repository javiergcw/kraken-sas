"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Paper,
  Select,
  MenuItem,
  FormControl,
  Slider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface CategoriaEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { 
    id: string;
    nombre: string; 
    descripcion: string; 
    categoriaId?: string;
    estado: string;
    prioridad: number;
  }) => void;
  categoriaInicial: {
    id: string;
    nombre: string;
    slug: string;
    descripcion?: string;
    imagen?: string;
    categoriaId?: string;
    estado?: string;
    prioridad?: number;
  };
  isSubcategoria?: boolean;
  categorias?: Array<{ id: string; nombre: string }>;
}

export default function CategoriaEditDialog({
  open,
  onClose,
  onSave,
  categoriaInicial,
  isSubcategoria = false,
  categorias = [],
}: CategoriaEditDialogProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [estado, setEstado] = useState("Activo");
  const [prioridad, setPrioridad] = useState(10);

  // Actualizar campos cuando se abre el diálogo
  useEffect(() => {
    if (open && categoriaInicial) {
      setNombre(categoriaInicial.nombre || "");
      setDescripcion(categoriaInicial.descripcion || "");
      setCategoriaId(categoriaInicial.categoriaId || "");
      setEstado(categoriaInicial.estado || "Activo");
      setPrioridad(categoriaInicial.prioridad || 10);
    }
  }, [open, categoriaInicial]);

  const handleSave = () => {
    if (!nombre.trim()) {
      return; // No guardar si no hay nombre
    }

    onSave({ 
      id: categoriaInicial.id,
      nombre: nombre.trim(), 
      descripcion: descripcion.trim(), 
      categoriaId: isSubcategoria ? categoriaId : undefined,
      estado,
      prioridad,
    });
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          maxWidth: "520px"
        }
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, pb: 1.5, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="h6" sx={{ fontSize: "17px", fontWeight: 600 }}>
            Editar {isSubcategoria ? "subcategoría" : "categoría"}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ mt: -0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 2, py: 1.5, overflow: 'hidden' }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Columna Izquierda */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1.25, minWidth: 0 }}>
            {/* Nombre */}
            <Box>
              <Typography variant="body2" sx={{ fontSize: "12px", fontWeight: 500, mb: 0.5 }}>
                Nombre
              </Typography>
              <TextField
                fullWidth
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiInputBase-input": { fontSize: "13px", py: 1 },
                }}
              />
            </Box>

            {/* Descripción */}
            <Box>
              <Typography variant="body2" sx={{ fontSize: "12px", fontWeight: 500, mb: 0.5 }}>
                Descripción
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                variant="outlined"
                sx={{
                  "& .MuiInputBase-input": { fontSize: "13px" },
                }}
              />
            </Box>

            {/* Categoría (solo para subcategorías) */}
            {isSubcategoria && (
              <Box>
                <Typography variant="body2" sx={{ fontSize: "12px", fontWeight: 500, mb: 0.5 }}>
                  Categoría
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    disabled
                    sx={{
                      fontSize: "13px",
                      "& .MuiSelect-select": { py: 1 },
                      bgcolor: "#f5f5f5",
                    }}
                  >
                    {categorias.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id} sx={{ fontSize: "13px" }}>
                        {cat.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          </Box>

          {/* Columna Derecha */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1.25, minWidth: 0 }}>

            {/* Estado */}
            <Box>
              <Typography variant="body2" sx={{ fontSize: "12px", fontWeight: 500, mb: 0.5 }}>
                Estado
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  sx={{
                    fontSize: "13px",
                    "& .MuiSelect-select": { py: 1 },
                  }}
                >
                  <MenuItem value="Activo" sx={{ fontSize: "13px" }}>Activo</MenuItem>
                  <MenuItem value="Inactivo" sx={{ fontSize: "13px" }}>Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Prioridad */}
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontSize: "12px", fontWeight: 500 }}>
                  Prioridad
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "12px", color: "#666" }}>
                  {prioridad}
                </Typography>
              </Box>
              <Slider
                value={prioridad}
                onChange={(e, newValue) => setPrioridad(newValue as number)}
                min={1}
                max={10}
                step={1}
                sx={{
                  color: "#1a1a1a",
                  "& .MuiSlider-thumb": {
                    width: 16,
                    height: 16,
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
        <Button 
          onClick={handleClose} 
          sx={{ 
            textTransform: "none",
            fontSize: "12px",
            py: 0.65,
            px: 1.75,
            color: "#666",
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            bgcolor: "#1a1a1a",
            "&:hover": { bgcolor: "#000", boxShadow: "none" },
            textTransform: "none",
            fontSize: "12px",
            py: 0.65,
            px: 1.75,
            boxShadow: "none",
          }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}

