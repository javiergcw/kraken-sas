'use client';

import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SignatureCanvas from 'react-signature-canvas';

interface ContractSignDialogProps {
  open: boolean;
  onClose: () => void;
  onSign: (signatureData: {
    signed_by_name: string;
    signed_by_email: string;
    signature_image: string;
  }) => void;
  contractCode?: string;
}

const ContractSignDialog: React.FC<ContractSignDialogProps> = ({
  open,
  onClose,
  onSign,
  contractCode,
}) => {
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const sigPadRef = useRef<SignatureCanvas>(null);

  const handleClear = () => {
    sigPadRef.current?.clear();
  };

  const handleSign = () => {
    if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
      const signatureImage = sigPadRef.current.toDataURL();
      onSign({
        signed_by_name: signerName,
        signed_by_email: signerEmail,
        signature_image: signatureImage,
      });
      handleClear();
      setSignerName('');
      setSignerEmail('');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          maxWidth: '500px',
          borderRadius: 2,
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, pb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600, mb: 0.5 }}>
            Firmar contrato
          </Typography>
          {contractCode && (
            <Typography variant="body2" sx={{ fontSize: '12px', color: '#666' }}>
              Contrato: {contractCode}
            </Typography>
          )}
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ mt: -0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 2, py: 1.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Información del firmante */}
          <Box>
            <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 500, mb: 0.5 }}>
              Nombre completo *
            </Typography>
            <TextField
              fullWidth
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              variant="outlined"
              size="small"
              placeholder="Tu nombre completo"
              sx={{
                '& .MuiInputBase-input': { fontSize: '13px', py: 1 },
              }}
            />
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 500, mb: 0.5 }}>
              Correo electrónico *
            </Typography>
            <TextField
              fullWidth
              type="email"
              value={signerEmail}
              onChange={(e) => setSignerEmail(e.target.value)}
              variant="outlined"
              size="small"
              placeholder="tu@email.com"
              sx={{
                '& .MuiInputBase-input': { fontSize: '13px', py: 1 },
              }}
            />
          </Box>

          {/* Canvas de firma */}
          <Box>
            <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 500, mb: 0.5 }}>
              Firma *
            </Typography>
            <Box
              sx={{
                border: '2px dashed #e0e0e0',
                borderRadius: 1,
                overflow: 'hidden',
                backgroundColor: '#fafafa',
                position: 'relative',
              }}
            >
              <SignatureCanvas
                ref={sigPadRef}
                canvasProps={{
                  width: 468,
                  height: 150,
                  className: 'signature-canvas',
                  style: {
                    width: '100%',
                    height: '150px',
                  },
                }}
                backgroundColor="#fafafa"
              />
              <Button
                size="small"
                onClick={handleClear}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  minWidth: 'auto',
                  fontSize: '11px',
                  textTransform: 'none',
                  color: '#757575',
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  px: 1,
                  py: 0.5,
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    borderColor: '#bdbdbd',
                  },
                }}
              >
                Limpiar
              </Button>
            </Box>
            <Typography variant="caption" sx={{ fontSize: '11px', color: '#999', mt: 0.5, display: 'block' }}>
              Dibuja tu firma en el recuadro
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{
            textTransform: 'none',
            fontSize: '12px',
            py: 0.65,
            px: 1.75,
            color: '#666',
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSign}
          variant="contained"
          disabled={!signerName || !signerEmail || sigPadRef.current?.isEmpty()}
          sx={{
            bgcolor: '#424242',
            '&:hover': { bgcolor: '#303030', boxShadow: 'none' },
            textTransform: 'none',
            fontSize: '12px',
            py: 0.65,
            px: 1.75,
            boxShadow: 'none',
          }}
        >
          Firmar contrato
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContractSignDialog;

