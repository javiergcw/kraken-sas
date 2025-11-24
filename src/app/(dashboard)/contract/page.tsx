'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  FormControl,
  Select,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Description as DescriptionIcon,
  FileCopy as FileCopyIcon,
  CalendarToday as CalendarIcon,
  Code as CodeIcon,
  MoreVert as MoreVertIcon,
  PictureAsPdf as PdfIcon,
  Block as BlockIcon,
  GetApp as DownloadIcon,
  PlayArrow as CreateIcon,
  NoteAdd as NoteAddIcon,
  Draw as DrawIcon,
  Upload as UploadIcon,
  Clear as ClearIcon,
  Link as LinkIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import { contractTemplateController, contractController, companySettingsController } from '@/components/core';
import type { ContractTemplateDto, ContractDto } from '@/components/core/contracts/dto';

// Función helper para traducir tipos de relación al español
const translateRelatedType = (type: string | undefined): string => {
  if (!type) return '-';
  const translations: Record<string, string> = {
    'RESERVATION': 'Reserva',
    'PRODUCT': 'Producto',
    'VESSEL': 'Embarcación',
    'RENT': 'Alquiler',
  };
  return translations[type] || type;
};

const ContractPage: React.FC = () => {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplateFilter, setSelectedTemplateFilter] = useState<string>('');
  const [signatureStatusFilter, setSignatureStatusFilter] = useState<string>('all'); // 'all', 'signed', 'unsigned'
  const [createdDateFilter, setCreatedDateFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<ContractTemplateDto[]>([]);
  const [contracts, setContracts] = useState<ContractDto[]>([]);

  // Modales
  const [viewContractModalOpen, setViewContractModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ContractDto | null>(null);
  const [invalidateModalOpen, setInvalidateModalOpen] = useState(false);
  const [contractToInvalidate, setContractToInvalidate] = useState<{ id: string; code: string } | null>(null);
  const [invalidateReason, setInvalidateReason] = useState('');
  const [invalidateAllTokens, setInvalidateAllTokens] = useState(true);
  
  // Modal de firma
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [contractToSign, setContractToSign] = useState<{ id: string; code: string } | null>(null);
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [signatureImage, setSignatureImage] = useState<string>('');
  const [signatureMode, setSignatureMode] = useState<'draw' | 'upload'>('draw');

  // Notificaciones
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Menú contextual
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  // Modal de vista previa
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewContractId, setPreviewContractId] = useState<string | null>(null);
  const [previewHtmlContent, setPreviewHtmlContent] = useState<string>('');
  const [loadingPreview, setLoadingPreview] = useState(false);
  
  // Website URL para construir la URL del contrato
  const [websiteURL, setWebsiteURL] = useState<string>('');

  useEffect(() => {
    loadData();
    loadCompanySettings();
  }, []);

  const loadCompanySettings = async () => {
    try {
      const response = await companySettingsController.get();
      if (response?.success && response.data) {
        setWebsiteURL(response.data.WebsiteURL || '');
      }
    } catch (error) {
      console.error('Error al cargar configuración de compañía:', error);
    }
  };

  // Inicializar el canvas cuando se abre el modal
  useEffect(() => {
    if (!signModalOpen || signatureMode !== 'draw') return;

    // Usar setTimeout para asegurar que el canvas esté renderizado
    const initCanvas = setTimeout(() => {
      const canvas = document.getElementById('signature-canvas') as HTMLCanvasElement;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Limpiar el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let isDrawing = false;
      let lastX = 0;
      let lastY = 0;

      const getCoordinates = (e: MouseEvent | TouchEvent, rect: DOMRect) => {
        if (e instanceof MouseEvent) {
          return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          };
        } else {
          e.preventDefault(); // Prevenir scroll en touch
          return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top
          };
        }
      };

      const startDrawing = (e: MouseEvent | TouchEvent) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const coords = getCoordinates(e, rect);
        lastX = coords.x;
        lastY = coords.y;
      };

      const draw = (e: MouseEvent | TouchEvent) => {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const coords = getCoordinates(e, rect);

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(coords.x, coords.y);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        lastX = coords.x;
        lastY = coords.y;
      };

      const stopDrawing = () => {
        isDrawing = false;
      };

      // Event listeners
      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mouseleave', stopDrawing);
      
      canvas.addEventListener('touchstart', startDrawing, { passive: false });
      canvas.addEventListener('touchmove', draw, { passive: false });
      canvas.addEventListener('touchend', stopDrawing);
      canvas.addEventListener('touchcancel', stopDrawing);

      // Cleanup function
      return () => {
        canvas.removeEventListener('mousedown', startDrawing);
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('mouseup', stopDrawing);
        canvas.removeEventListener('mouseleave', stopDrawing);
        canvas.removeEventListener('touchstart', startDrawing);
        canvas.removeEventListener('touchmove', draw);
        canvas.removeEventListener('touchend', stopDrawing);
        canvas.removeEventListener('touchcancel', stopDrawing);
      };
    }, 100); // Pequeño delay para asegurar renderizado

    return () => clearTimeout(initCanvas);
  }, [signModalOpen, signatureMode]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Cargar plantillas
      const templatesResponse = await contractTemplateController.getAll();
      if (templatesResponse?.success && templatesResponse.data) {
        setTemplates(templatesResponse.data);
      }

      // Cargar contratos
      const contractsResponse = await contractController.getAll();
      if (contractsResponse?.success && contractsResponse.data) {
        setContracts(contractsResponse.data);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };


  // Nuevas funciones
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleViewContract = async (contract: ContractDto) => {
    router.push(`/contract/view/${contract.id}`);
  };

  const handlePreviewContract = async (contractId: string) => {
    try {
      setLoadingPreview(true);
      setPreviewContractId(contractId);
      setPreviewModalOpen(true);
      
      // Cargar el HTML del contrato
      const htmlContent = await contractController.downloadPDF(contractId);
      if (htmlContent) {
        setPreviewHtmlContent(htmlContent);
      } else {
        showSnackbar('No se pudo cargar la vista previa del contrato', 'error');
        setPreviewModalOpen(false);
      }
    } catch (error) {
      console.error('Error al cargar vista previa:', error);
      showSnackbar('Error al cargar la vista previa del contrato', 'error');
      setPreviewModalOpen(false);
    } finally {
      setLoadingPreview(false);
      handleMenuClose();
    }
  };

  const handleClosePreviewModal = () => {
    setPreviewModalOpen(false);
    setPreviewContractId(null);
    setPreviewHtmlContent('');
  };

  const handleCopyContractURL = async (contractId: string) => {
    try {
      const contract = contracts.find(c => c.id === contractId);
      if (!contract) {
        showSnackbar('Contrato no encontrado', 'error');
        handleMenuClose();
        return;
      }

      if (!contract.access_token) {
        showSnackbar('Este contrato no tiene un token de acceso', 'warning');
        handleMenuClose();
        return;
      }

      if (!websiteURL) {
        showSnackbar('No se ha configurado la URL del sitio web', 'warning');
        handleMenuClose();
        return;
      }

      // Construir la URL: WebsiteURL + /consultar-contrato/ + access_token
      const contractURL = `${websiteURL.replace(/\/$/, '')}/consultar-contrato/${contract.access_token}`;

      // Copiar al portapapeles
      await navigator.clipboard.writeText(contractURL);
      showSnackbar('URL del contrato copiada al portapapeles', 'success');
      handleMenuClose();
    } catch (error) {
      console.error('Error al copiar URL:', error);
      showSnackbar('Error al copiar la URL del contrato', 'error');
      handleMenuClose();
    }
  };

  const handleCloseViewContractModal = () => {
    setViewContractModalOpen(false);
    setSelectedContract(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, contractId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedContractId(contractId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContractId(null);
  };

  const handleDownloadPDF = async (contractId: string) => {
    let tempDiv: HTMLElement | null = null;

    try {
      // Buscar el contrato para validar que esté firmado
      const contract = contracts.find(c => c.id === contractId);
      
      // Validar que el contrato esté firmado
      if (!contract?.signed_at) {
        showSnackbar('Este contrato no puede descargarse porque aún no ha sido firmado', 'warning');
        handleMenuClose();
        return;
      }

      showSnackbar('Generando PDF...', 'info');
      handleMenuClose();

      const fileName = contract ? `${contract.code}.pdf` : `contrato-${contractId}.pdf`;

      // Obtener el HTML del contrato desde la API
      const htmlContent = await contractController.downloadPDF(contractId);

      console.log('[PDF] HTML recibido, longitud:', htmlContent?.length);
      console.log('[PDF] Muestra del HTML:', htmlContent?.substring(0, 500));

      if (!htmlContent || htmlContent.trim().length === 0) {
        throw new Error('El contenido HTML del contrato está vacío');
      }

      // Importar librerías
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // Crear contenedor del documento (oculto fuera de la pantalla)
      tempDiv = document.createElement('div');
      tempDiv.style.cssText = `
        position: fixed;
        top: -10000px;
        left: -10000px;
        width: 794px;
        background: white;
        padding: 60px;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
        color: #000;
      `;

      // El HTML ya viene completo del API, no agregar wrappers adicionales
      tempDiv.innerHTML = htmlContent;

      document.body.appendChild(tempDiv);

      // Esperar renderizado
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('[PDF] Elemento renderizado. Capturando...');
      console.log('[PDF] Contenido del elemento:', tempDiv.textContent?.substring(0, 300));

      // Capturar con html2canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: tempDiv.offsetWidth,
        height: tempDiv.offsetHeight
      });

      console.log('[PDF] Canvas generado:', canvas.width, 'x', canvas.height);

      // Crear PDF
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Agregar primera página
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Agregar páginas adicionales si es necesario
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      // Guardar PDF
      pdf.save(fileName);

      console.log('[PDF] PDF guardado exitosamente');
      showSnackbar('PDF descargado exitosamente', 'success');

    } catch (error) {
      console.error('[PDF] ERROR:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      showSnackbar(`Error al generar PDF: ${errorMessage}`, 'error');
    } finally {
      // Limpiar SIEMPRE
      if (tempDiv && document.body.contains(tempDiv)) {
        document.body.removeChild(tempDiv);
      }
    }
  };

  const handleInvalidateClick = (contractId: string, contractCode: string) => {
    setContractToInvalidate({ id: contractId, code: contractCode });
    setInvalidateReason('');
    setInvalidateAllTokens(true);
    setInvalidateModalOpen(true);
    handleMenuClose();
  };

  const handleConfirmInvalidate = async () => {
    if (!contractToInvalidate) return;

    // Validar que se haya proporcionado una razón
    if (!invalidateReason.trim()) {
      showSnackbar('Por favor proporciona una razón para invalidar el contrato', 'warning');
      return;
    }

    try {
      const response = await contractController.invalidate(contractToInvalidate.id, {
        reason: invalidateReason,
        invalidate_all_tokens: invalidateAllTokens,
      });

      if (response?.success) {
        showSnackbar('Contrato invalidado exitosamente', 'success');
        await loadData();
        setInvalidateModalOpen(false);
        setContractToInvalidate(null);
        setInvalidateReason('');
        setInvalidateAllTokens(true);
      } else {
        showSnackbar('Error al invalidar el contrato', 'error');
      }
    } catch (error) {
      console.error('Error al invalidar:', error);
      showSnackbar('Error al invalidar el contrato', 'error');
    }
  };

  const handleSignClick = (contractId: string, contractCode: string) => {
    // Verificar el estado del contrato
    const contract = contracts.find(c => c.id === contractId);
    
    if (!contract) {
      showSnackbar('Contrato no encontrado', 'error');
      handleMenuClose();
      return;
    }

    // Validar estados que no permiten firma
    if (contract.status === 'SIGNED') {
      showSnackbar('Este contrato ya ha sido firmado', 'warning');
      handleMenuClose();
      return;
    }

    if (contract.status === 'CANCELLED') {
      showSnackbar('No se puede firmar un contrato cancelado', 'error');
      handleMenuClose();
      return;
    }

    if (contract.status === 'EXPIRED') {
      showSnackbar('No se puede firmar un contrato expirado', 'error');
      handleMenuClose();
      return;
    }

    // Solo permitir firma en estados DRAFT o PENDING_SIGN
    if (contract.status !== 'DRAFT' && contract.status !== 'PENDING_SIGN') {
      showSnackbar(`No se puede firmar un contrato en estado: ${getStatusLabel(contract.status)}`, 'warning');
      handleMenuClose();
      return;
    }
    
    setContractToSign({ id: contractId, code: contractCode });
    setSignerName('');
    setSignerEmail('');
    setSignatureImage('');
    setSignatureMode('draw');
    setSignModalOpen(true);
    handleMenuClose();
  };

  const handleClearSignature = () => {
    setSignatureImage('');
    const canvas = document.getElementById('signature-canvas') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSignatureImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmSign = async () => {
    if (!contractToSign) return;

    // Validaciones
    if (!signerName.trim()) {
      showSnackbar('Por favor ingresa el nombre del firmante', 'warning');
      return;
    }

    if (!signerEmail.trim()) {
      showSnackbar('Por favor ingresa el email del firmante', 'warning');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signerEmail)) {
      showSnackbar('Por favor ingresa un email válido', 'warning');
      return;
    }

    // Obtener la firma del canvas si está en modo dibujo
    let finalSignature = signatureImage;
    if (signatureMode === 'draw' && !signatureImage) {
      const canvas = document.getElementById('signature-canvas') as HTMLCanvasElement;
      if (canvas) {
        finalSignature = canvas.toDataURL('image/png');
      }
    }

    if (!finalSignature) {
      showSnackbar('Por favor dibuja o sube una firma', 'warning');
      return;
    }

    try {
      const response = await contractController.sign(contractToSign.id, {
        signed_by_name: signerName,
        signed_by_email: signerEmail,
        signature_client: finalSignature,
        signed_fields: {
          signature_client: finalSignature
        }
      });

      if (response?.success) {
        showSnackbar('Contrato firmado exitosamente', 'success');
        await loadData();
        setSignModalOpen(false);
        setContractToSign(null);
        setSignerName('');
        setSignerEmail('');
        setSignatureImage('');
      } else {
        // Mostrar mensaje de error específico del backend
        const errorMessage = (response as any)?.error || 'Error al firmar el contrato';
        
        // Traducir errores comunes
        let friendlyMessage = errorMessage;
        if (errorMessage.includes('already signed')) {
          friendlyMessage = 'El contrato ya ha sido firmado';
        } else if (errorMessage.includes('cancelled')) {
          friendlyMessage = 'El contrato ha sido cancelado';
        } else if (errorMessage.includes('expired')) {
          friendlyMessage = 'El contrato ha expirado';
        }
        
        showSnackbar(friendlyMessage, 'error');
      }
    } catch (error) {
      console.error('Error al firmar:', error);
      showSnackbar('Error al firmar el contrato. Por favor intenta nuevamente.', 'error');
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContracts = contracts.filter(contract => {
    const matchesTemplate = !selectedTemplateFilter || contract.template_id === selectedTemplateFilter;
    
    // Filtro por estado de firma
    const matchesSignatureStatus = 
      signatureStatusFilter === 'all' ||
      (signatureStatusFilter === 'signed' && contract.status === 'SIGNED') ||
      (signatureStatusFilter === 'unsigned' && contract.status !== 'SIGNED');
    
    // Filtro por fecha de creación
    let matchesDate = true;
    if (createdDateFilter) {
      const contractDate = new Date(contract.created_at);
      const filterDate = new Date(createdDateFilter);
      matchesDate = 
        contractDate.getDate() === filterDate.getDate() &&
        contractDate.getMonth() === filterDate.getMonth() &&
        contractDate.getFullYear() === filterDate.getFullYear();
    }
    
    return matchesTemplate && matchesSignatureStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SIGNED':
        return { bg: '#e8f5e9', color: '#4caf50' };
      case 'PENDING':
      case 'PENDING_SIGN':
        return { bg: '#fff3e0', color: '#ff9800' };
      case 'EXPIRED':
        return { bg: '#ffebee', color: '#f44336' };
      case 'CANCELLED':
        return { bg: '#f5f5f5', color: '#757575' };
      default:
        return { bg: '#e3f2fd', color: '#1976d2' };
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'DRAFT': 'Borrador',
      'PENDING': 'Pendiente',
      'PENDING_SIGN': 'Pendiente de Firma',
      'SIGNED': 'Firmado',
      'EXPIRED': 'Expirado',
      'CANCELLED': 'Cancelado',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <Box sx={{ px: { xs: 2, sm: 3, md: 6 }, py: 2, backgroundColor: 'white', height: 'calc(100vh - 64px)' }}>
        <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={400} />
      </Box>
    );
  }

  // Estado vacío para plantillas
  if (templates.length === 0 && tabValue === 0) {
    return (
      <Box sx={{
        px: { xs: 2, sm: 3, md: 6 },
        py: 2,
        backgroundColor: 'white',
        height: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{ textAlign: 'center', maxWidth: '400px' }}>
          <DescriptionIcon sx={{ fontSize: 70, color: '#bdbdbd', opacity: 0.6, mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#424242', mb: 1.5, fontSize: '22px' }}>
            No hay plantillas de contratos
          </Typography>
          <Typography variant="body1" sx={{ color: '#757575', mb: 3, fontSize: '15px', lineHeight: 1.5 }}>
            Crea tu primera plantilla de contrato para empezar a gestionar contratos digitales
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/contract/create')}
            sx={{
              backgroundColor: '#424242',
              fontSize: '15px',
              px: 3.5,
              py: 1.2,
              borderRadius: 2,
              textTransform: 'capitalize',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#303030',
                boxShadow: 'none'
              },
            }}
          >
            Crear plantilla
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 6 }, py: 3, backgroundColor: '#fafafa', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header Mejorado */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#424242', fontSize: { xs: '24px', sm: '28px' }, mb: 0.5 }}>
              Gestión de Contratos
            </Typography>
            <Typography sx={{ color: '#757575', fontSize: '14px' }}>
              {tabValue === 0
                ? 'Administra las plantillas de contratos que se utilizarán para generar nuevos contratos'
                : 'Visualiza y gestiona todos los contratos generados y firmados'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            {tabValue === 0 && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/contract/create')}
                sx={{
                  backgroundColor: '#1976d2',
                  fontSize: '14px',
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  boxShadow: '0 2px 8px rgba(25,118,210,0.3)',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                    boxShadow: '0 4px 12px rgba(25,118,210,0.4)'
                  },
                }}
              >
                Nueva Plantilla
              </Button>
            )}
          </Box>
        </Box>

        {/* Tabs Mejorados */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 2, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{
              backgroundColor: 'white',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '15px',
                fontWeight: 'medium',
                minHeight: 56,
                px: 3,
              },
              '& .Mui-selected': {
                color: '#1976d2',
              },
              '& .MuiTabs-indicator': {
                height: 3,
                backgroundColor: '#1976d2',
              },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DescriptionIcon sx={{ fontSize: 20 }} />
                  <span>Plantillas</span>
                  <Chip
                    label={filteredTemplates.length}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '11px',
                      backgroundColor: tabValue === 0 ? '#e3f2fd' : '#f5f5f5',
                      color: tabValue === 0 ? '#1976d2' : '#757575',
                    }}
                  />
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FileCopyIcon sx={{ fontSize: 20 }} />
                  <span>Contratos Emitidos</span>
                  <Chip
                    label={filteredContracts.length}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '11px',
                      backgroundColor: tabValue === 1 ? '#e3f2fd' : '#f5f5f5',
                      color: tabValue === 1 ? '#1976d2' : '#757575',
                    }}
                  />
                </Box>
              }
            />
          </Tabs>
        </Paper>

        {/* Search y Filtros */}
        <Paper sx={{ p: 2, borderRadius: 2, mb: 2, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
          {tabValue === 0 ? (
            <TextField
              fullWidth
              placeholder="Buscar plantillas por SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: '#757575', mr: 1, fontSize: 22 }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8f8f8',
                  borderRadius: 2,
                  fontSize: '14px',
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: '#1976d2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                  },
                },
              }}
            />
          ) : (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
              <FormControl sx={{ minWidth: { xs: '100%', md: 250 }, flexShrink: 0 }}>
                <InputLabel id="template-filter-label" sx={{ fontSize: '14px' }}>
                  Filtrar por Plantilla
                </InputLabel>
                <Select
                  labelId="template-filter-label"
                  value={selectedTemplateFilter}
                  onChange={(e) => setSelectedTemplateFilter(e.target.value)}
                  label="Filtrar por Plantilla"
                  sx={{
                    backgroundColor: '#f8f8f8',
                    fontSize: '14px',
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: '#1976d2',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Todas las plantillas</em>
                  </MenuItem>
                  {templates.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.name} ({template.sku})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: { xs: '100%', md: 200 }, flexShrink: 0 }}>
                <InputLabel id="signature-status-filter-label" sx={{ fontSize: '14px' }}>
                  Estado de Firma
                </InputLabel>
                <Select
                  labelId="signature-status-filter-label"
                  value={signatureStatusFilter}
                  onChange={(e) => setSignatureStatusFilter(e.target.value)}
                  label="Estado de Firma"
                  sx={{
                    backgroundColor: '#f8f8f8',
                    fontSize: '14px',
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: '#1976d2',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                    },
                  }}
                >
                  <MenuItem value="all">
                    <em>Todos</em>
                  </MenuItem>
                  <MenuItem value="signed">Firmados</MenuItem>
                  <MenuItem value="unsigned">No Firmados</MenuItem>
                </Select>
              </FormControl>
              <TextField
                type="date"
                label="Fecha de Creación"
                value={createdDateFilter}
                onChange={(e) => setCreatedDateFilter(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                  sx: { fontSize: '14px' }
                }}
                sx={{
                  flex: 1,
                  maxWidth: { xs: '100%', md: 200 },
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8f8f8',
                    borderRadius: 2,
                    fontSize: '14px',
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: '#1976d2',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                }}
              />
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={() => {
                  setSelectedTemplateFilter('');
                  setSignatureStatusFilter('all');
                  setCreatedDateFilter('');
                }}
                disabled={!selectedTemplateFilter && signatureStatusFilter === 'all' && !createdDateFilter}
                sx={{
                  textTransform: 'none',
                  borderColor: '#e0e0e0',
                  color: '#424242',
                  fontSize: '14px',
                  px: 2,
                  minWidth: { xs: '100%', md: 'auto' },
                  '&:hover': {
                    borderColor: '#757575',
                    backgroundColor: '#f5f5f5',
                  },
                  '&:disabled': {
                    borderColor: '#e0e0e0',
                    color: '#bdbdbd',
                  },
                }}
              >
                Limpiar Filtros
              </Button>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Contenido según tab */}
      {tabValue === 0 ? (
        // Tabla de plantillas mejorada
        <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 'none', border: '1px solid #e0e0e0' }}>
          {filteredTemplates.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '13px', py: 2 }}>
                      Plantilla
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '13px', py: 2 }}>
                      SKU
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '13px', py: 2, textAlign: 'center' }}>
                      Estado
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '13px', py: 2, textAlign: 'center' }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTemplates.map((template) => (
                    <TableRow 
                      key={template.id} 
                      sx={{ 
                        '&:hover': { backgroundColor: '#fafafa' },
                        borderBottom: '1px solid #f0f0f0'
                      }}
                    >
                      <TableCell sx={{ py: 2.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              backgroundColor: '#e3f2fd',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <DescriptionIcon sx={{ fontSize: 22, color: '#1976d2' }} />
                          </Box>
                          <Box>
                            <Typography sx={{ fontSize: '14px', fontWeight: 'medium', color: '#424242' }}>
                              {template.name}
                            </Typography>
                            {template.description && (
                              <Typography sx={{ fontSize: '12px', color: '#9e9e9e', maxWidth: 300 }}>
                                {template.description}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Chip 
                          icon={<CodeIcon sx={{ fontSize: 14 }} />}
                          label={template.sku}
                          size="small"
                          sx={{ 
                            fontSize: '12px', 
                            height: 28,
                            fontFamily: 'monospace',
                            backgroundColor: '#f5f5f5',
                            color: '#424242',
                            fontWeight: 'medium'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', py: 2.5 }}>
                        <Chip
                          label={template.is_active ? 'Activa' : 'Inactiva'}
                          size="small"
                          sx={{
                            backgroundColor: template.is_active ? '#e8f5e9' : '#ffebee',
                            color: template.is_active ? '#4caf50' : '#f44336',
                            fontSize: '12px',
                            height: 28,
                            fontWeight: 'medium',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', py: 2.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<NoteAddIcon sx={{ fontSize: 16 }} />}
                            onClick={() => router.push(`/contract/emit/${template.id}`)}
                            sx={{
                              backgroundColor: '#4caf50',
                              color: 'white',
                              textTransform: 'none',
                              fontSize: '13px',
                              px: 2,
                              py: 0.75,
                              fontWeight: 'medium',
                              boxShadow: '0 2px 4px rgba(76,175,80,0.3)',
                              '&:hover': { 
                                backgroundColor: '#45a049',
                                boxShadow: '0 4px 8px rgba(76,175,80,0.4)',
                              },
                            }}
                          >
                            Emitir Contrato
                          </Button>
                          <IconButton
                            size="small"
                            onClick={() => router.push(`/contract/template/${template.id}`)}
                            title="Ver detalles de la plantilla"
                            sx={{
                              border: '1px solid #e0e0e0',
                              borderRadius: 1.5,
                              color: '#757575',
                              p: 1,
                              '&:hover': { 
                                backgroundColor: '#e3f2fd', 
                                color: '#1976d2',
                                borderColor: '#1976d2' 
                              },
                            }}
                          >
                            <ViewIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => router.push(`/contract/edit/${template.id}`)}
                            title="Editar plantilla"
                            sx={{
                              border: '1px solid #e0e0e0',
                              borderRadius: 1.5,
                              color: '#757575',
                              p: 1,
                              '&:hover': { 
                                backgroundColor: '#fff3e0', 
                                color: '#ff9800',
                                borderColor: '#ff9800' 
                              },
                            }}
                          >
                            <EditIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <SearchIcon sx={{ fontSize: 60, color: '#bdbdbd', opacity: 0.5, mb: 2 }} />
              <Typography sx={{ fontSize: '16px', color: '#757575', fontWeight: 'medium' }}>
                No se encontraron plantillas
              </Typography>
              <Typography sx={{ fontSize: '14px', color: '#9e9e9e', mt: 0.5 }}>
                Intenta con otros términos de búsqueda
              </Typography>
            </Box>
          )}
        </Paper>
      ) : (
        // Tabla de contratos emitidos mejorada
        <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 'none', border: '1px solid #e0e0e0' }}>
          {filteredContracts.length > 0 ? (
            <TableContainer>
              <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f8f8' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>SKU / Código</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>Firmante</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>Vencimiento</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px' }}>Creado</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#424242', fontSize: '14px', textAlign: 'center' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContracts.map((contract) => {
                const statusStyle = getStatusColor(contract.status);
                const expiresAt = contract.expires_at ? new Date(contract.expires_at) : null;
                const isExpired = expiresAt && expiresAt < new Date();
                
                return (
                  <TableRow key={contract.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    {/* SKU / Código */}
                    <TableCell>
                      <Box>
                        <Typography sx={{ fontSize: '13px', fontFamily: 'monospace', color: '#424242', fontWeight: 'medium' }}>
                          {contract.sku}
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: '#9e9e9e', fontFamily: 'monospace' }}>
                          {contract.code}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Firmante */}
                    <TableCell>
                      <Box>
                        <Typography sx={{ fontSize: '14px', color: '#424242', fontWeight: 'medium' }}>
                          {contract.signed_by_name}
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: '#757575' }}>
                          {contract.signed_by_email}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Tipo */}
                    <TableCell>
                      {contract.related_type ? (
                        <Chip
                          label={translateRelatedType(contract.related_type)}
                          size="small"
                          sx={{
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            fontSize: '11px',
                            height: 20,
                            fontWeight: 'medium',
                          }}
                        />
                      ) : (
                        <Typography sx={{ fontSize: '12px', color: '#bdbdbd' }}>Sin tipo</Typography>
                      )}
                    </TableCell>

                    {/* Estado */}
                    <TableCell>
                      <Chip
                        label={getStatusLabel(contract.status)}
                        size="small"
                        sx={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          fontSize: '12px',
                          height: 22,
                          fontWeight: 'medium',
                        }}
                      />
                    </TableCell>

                    {/* Vencimiento */}
                    <TableCell>
                      {expiresAt ? (
                        <Box>
                          <Typography 
                            sx={{ 
                              fontSize: '13px', 
                              color: isExpired ? '#f44336' : '#424242',
                              fontWeight: isExpired ? 'bold' : 'normal'
                            }}
                          >
                            {expiresAt.toLocaleDateString('es-ES', { 
                              day: '2-digit', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </Typography>
                          {isExpired && (
                            <Chip 
                              label="Vencido" 
                              size="small" 
                              sx={{ 
                                backgroundColor: '#ffebee', 
                                color: '#f44336', 
                                fontSize: '10px', 
                                height: 18,
                                mt: 0.5
                              }} 
                            />
                          )}
                        </Box>
                      ) : (
                        <Typography sx={{ fontSize: '12px', color: '#9e9e9e' }}>Sin vencimiento</Typography>
                      )}
                    </TableCell>

                    {/* Creado */}
                    <TableCell sx={{ fontSize: '13px', color: '#757575' }}>
                      {new Date(contract.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </TableCell>

                    {/* Acciones */}
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handlePreviewContract(contract.id)}
                          sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            color: '#757575',
                            p: 0.75,
                            '&:hover': { backgroundColor: '#e3f2fd', color: '#1976d2', borderColor: '#1976d2' },
                          }}
                          title="Vista previa"
                        >
                          <DescriptionIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleViewContract(contract)}
                          sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            color: '#757575',
                            p: 0.75,
                            '&:hover': { backgroundColor: '#f5f5f5', color: '#1976d2' },
                          }}
                          title="Ver detalles"
                        >
                          <ViewIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, contract.id)}
                          sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            color: '#757575',
                            p: 0.75,
                            '&:hover': { backgroundColor: '#f5f5f5', color: '#424242' },
                          }}
                          title="Más acciones"
                        >
                          <MoreVertIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
          ) : (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <SearchIcon sx={{ fontSize: 60, color: '#bdbdbd', opacity: 0.5, mb: 2 }} />
              <Typography sx={{ fontSize: '16px', color: '#757575', fontWeight: 'medium' }}>
                No se encontraron contratos
              </Typography>
              <Typography sx={{ fontSize: '14px', color: '#9e9e9e', mt: 0.5 }}>
                Intenta con otros términos de búsqueda
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* Modal de Ver Contrato */}
      <Dialog
        open={viewContractModalOpen}
        onClose={handleCloseViewContractModal}
        maxWidth="md"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                backgroundColor: '#e3f2fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileCopyIcon sx={{ fontSize: 24, color: '#1976d2' }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 'bold', color: '#424242', fontSize: '18px' }}>
                Contrato: {selectedContract?.code}
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#9e9e9e' }}>
                ID: {selectedContract?.id.substring(0, 8)}...
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedContract && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* SKU y Código */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    SKU
                  </Typography>
                  <Typography sx={{ fontSize: '14px', fontFamily: 'monospace', color: '#424242', fontWeight: 'medium' }}>
                    {selectedContract.sku}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    Código
                  </Typography>
                  <Typography sx={{ fontSize: '14px', fontFamily: 'monospace', color: '#424242', fontWeight: 'medium' }}>
                    {selectedContract.code}
                  </Typography>
                </Box>
              </Box>

              {/* Firmante */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    Firmante
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: '#424242', fontWeight: 'medium' }}>
                    {selectedContract.signed_by_name}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    Email
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: '#424242' }}>
                    {selectedContract.signed_by_email}
                  </Typography>
                </Box>
              </Box>

              {/* Estado y Relación */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    Estado
                  </Typography>
                  <Chip
                    label={getStatusLabel(selectedContract.status)}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(selectedContract.status).bg,
                      color: getStatusColor(selectedContract.status).color,
                      fontSize: '12px',
                      height: 26,
                      fontWeight: 'medium',
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    Tipo de Relación
                  </Typography>
                  {selectedContract.related_type ? (
                    <Chip
                      label={translateRelatedType(selectedContract.related_type)}
                      size="small"
                      sx={{
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        fontSize: '12px',
                        height: 26,
                        fontWeight: 'medium',
                      }}
                    />
                  ) : (
                    <Typography sx={{ fontSize: '14px', color: '#bdbdbd' }}>
                      Sin relación
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Fechas */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    Fecha de creación
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: '#424242', fontWeight: 'medium' }}>
                    {new Date(selectedContract.created_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    Fecha de vencimiento
                  </Typography>
                  {selectedContract.expires_at ? (
                    <Typography sx={{ fontSize: '14px', color: '#424242', fontWeight: 'medium' }}>
                      {new Date(selectedContract.expires_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  ) : (
                    <Typography sx={{ fontSize: '14px', color: '#bdbdbd' }}>
                      Sin vencimiento
                    </Typography>
                  )}
                </Box>
              </Box>

              {selectedContract.signed_at && (
                <Box>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    Fecha de firma
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: '#424242', fontWeight: 'medium' }}>
                    {new Date(selectedContract.signed_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Box>
              )}

              {/* Access Token */}
              {selectedContract.access_token && (
                <Box>
                  <Typography sx={{ fontSize: '12px', color: '#9e9e9e', mb: 0.5 }}>
                    Token de Acceso
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontSize: '12px', fontFamily: 'monospace', color: '#757575', backgroundColor: '#f5f5f5', p: 1, borderRadius: 1, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {selectedContract.access_token}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={handleCloseViewContractModal}
            sx={{
              textTransform: 'capitalize',
              color: '#757575'
            }}
          >
            Cerrar
          </Button>
          {selectedContract && (
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownloadPDF(selectedContract.id)}
              disabled={!selectedContract.signed_at}
              sx={{
                backgroundColor: '#424242',
                textTransform: 'capitalize',
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#303030', boxShadow: 'none' },
                '&.Mui-disabled': {
                  backgroundColor: '#e0e0e0',
                  color: '#9e9e9e'
                }
              }}
            >
              Descargar PDF{!selectedContract.signed_at ? ' (no firmado)' : ''}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Modal de Invalidar Contrato */}
      <Dialog
        open={invalidateModalOpen}
        onClose={() => setInvalidateModalOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: 2, maxWidth: '500px' } }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 'bold', color: '#424242', fontSize: '18px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              backgroundColor: '#fff3e0', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <BlockIcon sx={{ fontSize: 22, color: '#ff9800' }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 'bold', fontSize: '18px', color: '#424242' }}>
                Invalidar Contrato
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Typography variant="body2" sx={{ color: '#424242', fontSize: '14px', lineHeight: 1.5, mb: 2 }}>
            ¿Estás seguro de que deseas invalidar el contrato{' '}
            <Typography component="span" sx={{ fontWeight: 'bold', color: '#ff9800', fontSize: '14px' }}>
              {contractToInvalidate?.code}
            </Typography>
            ?
          </Typography>
          <Typography variant="body2" sx={{ color: '#757575', fontSize: '13px', mb: 3 }}>
            Esta acción marcará el contrato como inválido y no podrá ser utilizado.
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Razón de invalidación *"
            placeholder="Ej: Contrato reemplazado por una versión actualizada"
            value={invalidateReason}
            onChange={(e) => setInvalidateReason(e.target.value)}
            sx={{ mb: 2 }}
            required
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={invalidateAllTokens}
                onChange={(e) => setInvalidateAllTokens(e.target.checked)}
                sx={{
                  color: '#ff9800',
                  '&.Mui-checked': {
                    color: '#ff9800',
                  },
                }}
              />
            }
            label={
              <Box>
                <Typography sx={{ fontSize: '14px', fontWeight: 'medium', color: '#424242' }}>
                  Invalidar todos los tokens de acceso
                </Typography>
                <Typography sx={{ fontSize: '12px', color: '#757575' }}>
                  Revocar acceso a todas las URLs públicas asociadas
                </Typography>
              </Box>
            }
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setInvalidateModalOpen(false);
              setInvalidateReason('');
              setInvalidateAllTokens(true);
            }}
            sx={{
              borderColor: '#e0e0e0',
              color: '#424242',
              textTransform: 'none',
              fontSize: '14px',
              px: 3,
              '&:hover': { borderColor: '#bdbdbd', backgroundColor: '#f5f5f5' },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmInvalidate}
            disabled={!invalidateReason.trim()}
            sx={{
              backgroundColor: '#ff9800',
              textTransform: 'none',
              fontSize: '14px',
              px: 3,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#f57c00', boxShadow: 'none' },
              '&:disabled': {
                backgroundColor: '#e0e0e0',
                color: '#9e9e9e',
              },
            }}
          >
            Invalidar Contrato
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Registrar Firma */}
      <Dialog
        open={signModalOpen}
        onClose={() => setSignModalOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: 2, maxWidth: '600px' } }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 'bold', color: '#424242', fontSize: '18px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              backgroundColor: '#e8f5e9', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <DrawIcon sx={{ fontSize: 22, color: '#4caf50' }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 'bold', fontSize: '18px', color: '#424242' }}>
                Registrar Firma del Cliente
              </Typography>
              <Typography sx={{ fontSize: '13px', color: '#757575' }}>
                Contrato: {contractToSign?.code}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {/* Datos del firmante */}
            <TextField
              fullWidth
              label="Nombre del firmante *"
              placeholder="Ej: Juan Pérez"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="Email del firmante *"
              type="email"
              placeholder="Ej: juan.perez@example.com"
              value={signerEmail}
              onChange={(e) => setSignerEmail(e.target.value)}
              required
            />

            {/* Tabs para modo de firma */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
              <Tabs 
                value={signatureMode} 
                onChange={(_, newValue) => setSignatureMode(newValue)}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontSize: '14px',
                  }
                }}
              >
                <Tab value="draw" label="Dibujar firma" icon={<DrawIcon />} iconPosition="start" />
                <Tab value="upload" label="Subir imagen" icon={<UploadIcon />} iconPosition="start" />
              </Tabs>
            </Box>

            {/* Canvas para dibujar */}
            {signatureMode === 'draw' && (
              <Box>
                <Box sx={{ 
                  border: '2px dashed #e0e0e0', 
                  borderRadius: 2, 
                  p: 2, 
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <canvas
                    id="signature-canvas"
                    width={500}
                    height={200}
                    style={{
                      border: '1px solid #e0e0e0',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      cursor: 'crosshair',
                      maxWidth: '100%'
                    }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ClearIcon />}
                    onClick={handleClearSignature}
                    sx={{ textTransform: 'none' }}
                  >
                    Limpiar firma
                  </Button>
                </Box>
                <Typography sx={{ fontSize: '12px', color: '#757575', mt: 1 }}>
                  Dibuja tu firma usando el mouse o el dedo (en dispositivos táctiles)
                </Typography>
              </Box>
            )}

            {/* Upload de imagen */}
            {signatureMode === 'upload' && (
              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<UploadIcon />}
                  sx={{
                    textTransform: 'none',
                    py: 2,
                    borderStyle: 'dashed',
                    borderWidth: 2,
                    backgroundColor: '#fafafa',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      borderStyle: 'dashed',
                    }
                  }}
                >
                  {signatureImage ? 'Cambiar imagen' : 'Seleccionar imagen de firma'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
                {signatureImage && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <img
                      src={signatureImage}
                      alt="Firma"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px'
                      }}
                    />
                    <Button
                      variant="text"
                      size="small"
                      startIcon={<ClearIcon />}
                      onClick={handleClearSignature}
                      sx={{ mt: 1, textTransform: 'none' }}
                    >
                      Eliminar imagen
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setSignModalOpen(false);
              setContractToSign(null);
              setSignerName('');
              setSignerEmail('');
              setSignatureImage('');
            }}
            sx={{
              borderColor: '#e0e0e0',
              color: '#424242',
              textTransform: 'none',
              fontSize: '14px',
              px: 3,
              '&:hover': { borderColor: '#bdbdbd', backgroundColor: '#f5f5f5' },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmSign}
            disabled={!signerName.trim() || !signerEmail.trim()}
            sx={{
              backgroundColor: '#4caf50',
              textTransform: 'none',
              fontSize: '14px',
              px: 3,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#45a049', boxShadow: 'none' },
              '&:disabled': {
                backgroundColor: '#e0e0e0',
                color: '#9e9e9e',
              },
            }}
          >
            Registrar Firma
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menú Contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            borderRadius: 1,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            mt: 0.5,
          }
        }}
      >
        <MenuItem
          onClick={() => {
            if (selectedContractId) {
              handleCopyContractURL(selectedContractId);
            }
          }}
          disabled={(() => {
            if (!selectedContractId) return false;
            const contract = contracts.find(c => c.id === selectedContractId);
            return !contract?.access_token || !websiteURL;
          })()}
          sx={{ 
            fontSize: '14px', 
            py: 1,
            '&.Mui-disabled': {
              opacity: 0.5
            }
          }}
        >
          <ListItemIcon>
            <LinkIcon sx={{ fontSize: 20, color: '#4caf50' }} />
          </ListItemIcon>
          <ListItemText>Copiar URL del contrato</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedContractId) {
              handleDownloadPDF(selectedContractId);
            }
          }}
          disabled={(() => {
            if (!selectedContractId) return false;
            const contract = contracts.find(c => c.id === selectedContractId);
            return !contract?.signed_at;
          })()}
          sx={{ 
            fontSize: '14px', 
            py: 1,
            '&.Mui-disabled': {
              opacity: 0.5
            }
          }}
        >
          <ListItemIcon>
            <PdfIcon sx={{ fontSize: 20, color: '#f44336' }} />
          </ListItemIcon>
          <ListItemText>Descargar PDF{(() => {
            if (!selectedContractId) return '';
            const contract = contracts.find(c => c.id === selectedContractId);
            return !contract?.signed_at ? ' (no firmado)' : '';
          })()}</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedContractId) {
              const contract = contracts.find(c => c.id === selectedContractId);
              if (contract) {
                handleSignClick(contract.id, contract.code);
              }
            }
          }}
          disabled={(() => {
            if (!selectedContractId) return false;
            const contract = contracts.find(c => c.id === selectedContractId);
            if (!contract) return true;
            // Deshabilitar si NO está en estado DRAFT o PENDING_SIGN
            return contract.status !== 'DRAFT' && contract.status !== 'PENDING_SIGN';
          })()}
          sx={{ 
            fontSize: '14px', 
            py: 1,
            '&.Mui-disabled': {
              opacity: 0.5
            }
          }}
        >
          <ListItemIcon>
            <DrawIcon sx={{ fontSize: 20, color: '#4caf50' }} />
          </ListItemIcon>
          <ListItemText>
            {(() => {
              if (!selectedContractId) return 'Registrar firma';
              const contract = contracts.find(c => c.id === selectedContractId);
              if (!contract) return 'Registrar firma';
              
              if (contract.status === 'SIGNED') return 'Ya firmado';
              if (contract.status === 'CANCELLED') return 'Cancelado';
              if (contract.status === 'EXPIRED') return 'Expirado';
              if (contract.status === 'DRAFT' || contract.status === 'PENDING_SIGN') return 'Registrar firma';
              
              return 'No disponible';
            })()}
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedContractId) {
              const contract = contracts.find(c => c.id === selectedContractId);
              if (contract && contract.status !== 'CANCELLED') {
                handleInvalidateClick(contract.id, contract.code);
              }
            }
          }}
          disabled={(() => {
            if (!selectedContractId) return false;
            const contract = contracts.find(c => c.id === selectedContractId);
            return contract?.status === 'CANCELLED';
          })()}
          sx={{ 
            fontSize: '14px', 
            py: 1,
            '&.Mui-disabled': {
              opacity: 0.5
            }
          }}
        >
          <ListItemIcon>
            <BlockIcon sx={{ fontSize: 20, color: '#ff9800' }} />
          </ListItemIcon>
          <ListItemText>
            {(() => {
              if (!selectedContractId) return 'Invalidar contrato';
              const contract = contracts.find(c => c.id === selectedContractId);
              if (!contract) return 'Invalidar contrato';
              
              if (contract.status === 'CANCELLED') return 'Invalidado';
              return 'Invalidar contrato';
            })()}
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* Modal de Vista Previa del Contrato */}
      <Dialog
        open={previewModalOpen}
        onClose={handleClosePreviewModal}
        maxWidth="lg"
        fullWidth
        sx={{ 
          '& .MuiDialog-paper': { 
            borderRadius: 2,
            maxHeight: '90vh'
          } 
        }}
      >
        <DialogTitle sx={{ 
          pb: 1, 
          fontWeight: 'bold', 
          color: '#424242', 
          fontSize: '18px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              backgroundColor: '#e3f2fd', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <ViewIcon sx={{ fontSize: 22, color: '#1976d2' }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 'bold', fontSize: '18px', color: '#424242' }}>
                Vista Previa del Contrato
              </Typography>
              {previewContractId && (
                <Typography sx={{ fontSize: '13px', color: '#757575' }}>
                  {contracts.find(c => c.id === previewContractId)?.code || previewContractId}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ 
          p: 0,
          backgroundColor: '#fafafa',
          position: 'relative',
          minHeight: '400px'
        }}>
          {loadingPreview ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '400px',
              flexDirection: 'column',
              gap: 2
            }}>
              <CircularProgress />
              <Typography sx={{ color: '#757575', fontSize: '14px' }}>
                Cargando vista previa...
              </Typography>
            </Box>
          ) : previewHtmlContent ? (
            <Box 
              sx={{ 
                p: 3, 
                backgroundColor: 'white', 
                minHeight: '400px',
                maxHeight: 'calc(90vh - 120px)',
                overflow: 'auto',
                '& *': {
                  maxWidth: '100%'
                }
              }}
              dangerouslySetInnerHTML={{ __html: previewHtmlContent }}
            />
          ) : (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '400px',
              flexDirection: 'column',
              gap: 2
            }}>
              <DescriptionIcon sx={{ fontSize: 60, color: '#bdbdbd', opacity: 0.5 }} />
              <Typography sx={{ color: '#757575', fontSize: '14px' }}>
                No se pudo cargar la vista previa
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          px: 3, 
          pb: 2, 
          pt: 2,
          borderTop: '1px solid #e0e0e0',
          gap: 1 
        }}>
          <Button
            variant="outlined"
            onClick={handleClosePreviewModal}
            sx={{
              borderColor: '#e0e0e0',
              color: '#424242',
              textTransform: 'none',
              fontSize: '14px',
              px: 3,
              '&:hover': { borderColor: '#bdbdbd', backgroundColor: '#f5f5f5' },
            }}
          >
            Cerrar
          </Button>
          {previewContractId && (() => {
            const contract = contracts.find(c => c.id === previewContractId);
            return (
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => {
                  if (previewContractId) {
                    handleDownloadPDF(previewContractId);
                  }
                }}
                disabled={!contract?.signed_at}
                sx={{
                  backgroundColor: '#424242',
                  textTransform: 'none',
                  fontSize: '14px',
                  px: 3,
                  boxShadow: 'none',
                  '&:hover': { backgroundColor: '#303030', boxShadow: 'none' },
                  '&.Mui-disabled': {
                    backgroundColor: '#e0e0e0',
                    color: '#9e9e9e'
                  }
                }}
              >
                Descargar PDF{!contract?.signed_at ? ' (no firmado)' : ''}
              </Button>
            );
          })()}
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: 1,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContractPage;
