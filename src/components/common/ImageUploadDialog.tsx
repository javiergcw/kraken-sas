'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import GridViewIcon from '@mui/icons-material/GridView';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';

interface ImageUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (imageUrl: string) => void;
  title?: string;
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  open,
  onClose,
  onUpload,
  title = 'Añadir nueva imagen',
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        onUpload(imageUrl);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        onUpload(imageUrl);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxWidth: '550px',
        },
      }}
    >
      <Box sx={{ position: 'relative', p: 2 }}>
        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1a1a1a',
            mb: 0.5,
          }}
        >
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#757575',
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 0 }}>
        <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px', mb: 2 }}>
          Escoge una imagen de la biblioteca.
        </Typography>

        {/* Barra de búsqueda */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Buscar imagen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '13px',
                backgroundColor: '#fafafa',
              },
            }}
          />
          <IconButton
            size="small"
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              color: '#757575',
            }}
          >
            <SwapVertIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              color: '#757575',
            }}
          >
            <GridViewIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Área de subida */}
        <Box
          component="label"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #e0e0e0',
            borderRadius: 2,
            p: 4,
            cursor: 'pointer',
            backgroundColor: '#fafafa',
            '&:hover': {
              borderColor: '#bdbdbd',
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/svg+xml"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <UploadFileOutlinedIcon sx={{ fontSize: 48, color: '#bdbdbd', mb: 2 }} />
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
            Añadir multimedia
          </Typography>
          <Typography variant="caption" sx={{ color: '#757575', fontSize: '12px', mb: 1 }}>
            Arrastrar y soltar archivos aquí
          </Typography>
          <Typography variant="caption" sx={{ color: '#9e9e9e', fontSize: '11px' }}>
            Formatos permitidos: jpg, jpeg, png, svg
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadDialog;

