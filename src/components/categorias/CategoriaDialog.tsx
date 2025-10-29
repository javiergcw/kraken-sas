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
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface CategoriaDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { 
    nombre: string; 
    descripcion: string; 
    categoriaId?: string;
  }) => void;
  isSubcategoria?: boolean;
  categorias?: Array<{ id: string; nombre: string }>;
  categoriaIdFija?: string; // Para subcategorías: categoría que no se puede cambiar
}

export default function CategoriaDialog({
  open,
  onClose,
  onSave,
  isSubcategoria = false,
  categorias = [],
  categoriaIdFija,
}: CategoriaDialogProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  // Cuando se abre el diálogo y es subcategoría, establecer la categoría fija
  useEffect(() => {
    if (open && isSubcategoria && categoriaIdFija) {
      setCategoriaId(categoriaIdFija);
    } else if (open && !isSubcategoria) {
      setCategoriaId("");
    }
  }, [open, isSubcategoria, categoriaIdFija]);

  const handleSave = () => {
    if (!nombre.trim()) {
      return; // No guardar si no hay nombre
    }

    // Para subcategorías, usar la categoría fija si está disponible
    const categoriaIdFinal = isSubcategoria 
      ? (categoriaIdFija || categoriaId)
      : undefined;

    onSave({ 
      nombre: nombre.trim(), 
      descripcion: descripcion.trim(), 
      categoriaId: categoriaIdFinal,
    });
    setNombre("");
    setDescripcion("");
    setCategoriaId("");
    onClose();
  };

  const handleClose = () => {
    setNombre("");
    setDescripcion("");
    setCategoriaId("");
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: {
          maxWidth: "380px"
        }
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, pb: 1.5, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 600, mb: 0.5 }}>
            Nueva {isSubcategoria ? "Subcategoría" : "Categoría"}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "12px", color: "#666" }}>
            Ingresa los detalles de la nueva categoría
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ mt: -0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 2, py: 1.5, overflow: 'hidden' }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
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

          {/* Categoría (solo para subcategorías) - Mostrada pero deshabilitada */}
          {isSubcategoria && (
            <Box>
              <Typography variant="body2" sx={{ fontSize: "12px", fontWeight: 500, mb: 0.5 }}>
                Categoría
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={categoriaIdFija || categoriaId}
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
              <Typography variant="caption" sx={{ fontSize: "11px", color: "#999", mt: 0.5, display: "block" }}>
                La categoría está asignada automáticamente
              </Typography>
            </Box>
          )}
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
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
}

