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
import UploadFileIcon from "@mui/icons-material/UploadFile";

interface CategoriaEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { 
    id: string;
    nombre: string; 
    slug: string; 
    descripcion: string; 
    imagen?: string;
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
  const [slug, setSlug] = useState("");
  const [imagen, setImagen] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [estado, setEstado] = useState("Activo");
  const [prioridad, setPrioridad] = useState(10);

  // Actualizar campos cuando se abre el diálogo
  useEffect(() => {
    if (open && categoriaInicial) {
      setNombre(categoriaInicial.nombre || "");
      setDescripcion(categoriaInicial.descripcion || "");
      setSlug(categoriaInicial.slug || "");
      setImagen(categoriaInicial.imagen || "");
      setCategoriaId(categoriaInicial.categoriaId || "");
      setEstado(categoriaInicial.estado || "Activo");
      setPrioridad(categoriaInicial.prioridad || 10);
    }
  }, [open, categoriaInicial]);

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
      id: categoriaInicial.id,
      nombre, 
      slug, 
      descripcion, 
      imagen,
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
                      id="upload-image-input-edit"
                      type="file"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="upload-image-input-edit" style={{ margin: 0 }}>
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

