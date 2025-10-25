"use client";

import { useState } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";

interface CategoriaDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { 
    nombre: string; 
    slug: string; 
    descripcion: string; 
    imagen?: string;
    categoriaId?: string;
  }) => void;
  isSubcategoria?: boolean;
  categorias?: Array<{ id: string; nombre: string }>;
}

export default function CategoriaDialog({
  open,
  onClose,
  onSave,
  isSubcategoria = false,
  categorias = [],
}: CategoriaDialogProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [slug, setSlug] = useState("");
  const [imagen, setImagen] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagen(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave({ 
      nombre, 
      slug, 
      descripcion, 
      imagen,
      categoriaId: isSubcategoria ? categoriaId : undefined,
    });
    setNombre("");
    setDescripcion("");
    setSlug("");
    setImagen("");
    setCategoriaId("");
    onClose();
  };

  const handleClose = () => {
    setNombre("");
    setDescripcion("");
    setSlug("");
    setImagen("");
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

          {/* Slug */}
          <Box>
            <Typography variant="body2" sx={{ fontSize: "12px", fontWeight: 500, mb: 0.5 }}>
              Slug
            </Typography>
            <TextField
              fullWidth
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                "& .MuiInputBase-input": { fontSize: "13px", py: 1 },
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
                  sx={{
                    fontSize: "13px",
                    "& .MuiSelect-select": { py: 1 },
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

          {/* Imagen */}
          <Box>
            <Typography variant="body2" sx={{ fontSize: "12px", fontWeight: 500, mb: 0.5 }}>
              Imagen
            </Typography>
            
            <Box sx={{ border: "1px solid #e0e0e0", borderRadius: 1, p: 1.25 }}>
              <Typography variant="body2" sx={{ fontSize: "12px", fontWeight: 600, mb: 0.75 }}>
                Multimedia
              </Typography>
              
              <Paper
                variant="outlined"
                sx={{
                  p: 1.25,
                  textAlign: "center",
                  borderRadius: 1,
                  borderStyle: "dashed",
                  borderColor: "#d0d0d0",
                  bgcolor: "white",
                }}
              >
                {imagen ? (
                  <Box sx={{ mb: 1.5 }}>
                    <Box 
                      sx={{ 
                        width: 70, 
                        height: 70, 
                        margin: "0 auto",
                        borderRadius: 1,
                        overflow: "hidden",
                        mb: 0.75
                      }}
                    >
                      <img 
                        src={imagen} 
                        alt="Preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </Box>
                    <Button
                      size="small"
                      onClick={() => setImagen("")}
                      sx={{
                        textTransform: "none",
                        fontSize: "11px",
                        color: "#f44336",
                      }}
                    >
                      Eliminar imagen
                    </Button>
                  </Box>
                ) : (
                  <>
                    <UploadFileIcon sx={{ fontSize: 28, color: "#999", mb: 0.75 }} />
                    <Typography variant="body2" sx={{ fontSize: "11px", color: "#666", mb: 1.5 }}>
                      Acepta imágenes con extensiones jpg, jpeg, png, svg
                    </Typography>
                  </>
                )}

                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="upload-image-input"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="upload-image-input" style={{ margin: 0 }}>
                    <Button
                      variant="contained"
                      component="span"
                      sx={{
                        bgcolor: "#1a1a1a",
                        "&:hover": { bgcolor: "#000", boxShadow: "none" },
                        textTransform: "none",
                        fontSize: "12px",
                        py: 0.6,
                        borderRadius: 1,
                        boxShadow: "none",
                        width: "100%",
                      }}
                    >
                      {imagen ? "Cambiar imagen" : "Agregar nueva imagen"}
                    </Button>
                  </label>
                  <Button
                    variant="outlined"
                    sx={{
                      color: "#333",
                      borderColor: "#d0d0d0",
                      textTransform: "none",
                      fontSize: "12px",
                      py: 0.6,
                      "&:hover": { borderColor: "#999", bgcolor: "#f5f5f5", boxShadow: "none" },
                      boxShadow: "none",
                    }}
                  >
                    Seleccionar existente
                  </Button>
                </Box>
              </Paper>
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
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  );
}

