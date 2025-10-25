"use client";

import { Box } from "@mui/material";
import CategoriasList from "@/components/categorias/CategoriasList";

export default function CategoriasPage() {
  return (
    <Box sx={{ px: 6, py: 2, backgroundColor: 'white', height: 'calc(100vh - 64px)', overflow: 'auto' }}>
      <CategoriasList />
    </Box>
  );
}

