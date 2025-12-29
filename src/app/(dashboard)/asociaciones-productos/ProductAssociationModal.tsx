import React, { useState, useEffect } from 'react';
import { tokenService } from '@/utils/token.service';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    MenuItem,
    Autocomplete,
    CircularProgress,
    Box,
    Typography,
} from '@mui/material';
import {
    productAssociationService,
    contractTemplateController,
    productService,
    activityService,
    ProductAssociation,
    CreateProductAssociationDto,
    UpdateProductAssociationDto,
    Product,
    Activity,
} from '@/components/core';
import { ContractTemplateDto } from '@/components/core/contracts/dto';

// Assuming Contract and Activity types are exported from core
// If not, I'll use `any` initially or define interfaces here based on my DTO file.
// But I saw `export * from './contracts'` and `./activities` in core index, so they should be there.

interface ProductAssociationModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    associationToEdit?: ProductAssociation | null;
}

const ProductAssociationModal: React.FC<ProductAssociationModalProps> = ({
    open,
    onClose,
    onSuccess,
    associationToEdit,
}) => {
    const isEditMode = !!associationToEdit;
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Data for dropdowns
    const [products, setProducts] = useState<Product[]>([]);
    const [contracts, setContracts] = useState<ContractTemplateDto[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);

    // Form state
    const [formData, setFormData] = useState<CreateProductAssociationDto>({
        product_id: '',
        contract_template_id: '',
        activity_id: '',
    });

    useEffect(() => {
        if (open) {
            loadDependencies();
            if (associationToEdit) {
                setFormData({
                    product_id: associationToEdit.product_id,
                    contract_template_id: associationToEdit.contract_template_id,
                    activity_id: associationToEdit.activity_id,
                });
            } else {
                setFormData({
                    product_id: '',
                    contract_template_id: '',
                    activity_id: '',
                });
            }
        }
    }, [open, associationToEdit]);

    const loadDependencies = async () => {
        setLoading(true);
        try {
            const token = tokenService.getToken() || undefined;
            const [productsRes, contractsRes, activitiesRes] = await Promise.all([
                productService.getAll(token),
                contractTemplateController.getAll(),
                activityService.getAll(undefined, token),
            ]);

            // Assuming standard response structure { data: [...] } or direct array
            setProducts((productsRes as any).data || productsRes || []);
            setContracts(contractsRes?.data || []);
            setActivities((activitiesRes as any).data || activitiesRes || []);

        } catch (error) {
            console.error('Error loading dependencies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof CreateProductAssociationDto, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            if (isEditMode && associationToEdit) {
                // Edit: only contract_template_id and activity_id are updatable as per requirements
                const updateData: UpdateProductAssociationDto = {
                    contract_template_id: formData.contract_template_id,
                    activity_id: formData.activity_id,
                };

                // Using id as the identifier for update as per requirements
                await productAssociationService.update(associationToEdit.id, updateData);
            } else {
                await productAssociationService.create(formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving association:', error);
            // Optionally show error message
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditMode ? 'Editar Asociación' : 'Nueva Asociación'}</DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid size={12}>
                            <Autocomplete
                                options={products}
                                getOptionLabel={(option) => `${option.sku} - ${option.name}`}
                                value={products.find((p) => p.id === formData.product_id) || null}
                                onChange={(_, newValue) => handleChange('product_id', newValue?.id || '')}
                                disabled={isEditMode} // Disable product selection in edit mode as creation uses it as key
                                renderInput={(params) => <TextField {...params} label="Producto" fullWidth required />}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Autocomplete
                                options={contracts}
                                getOptionLabel={(option) => `${option.sku} - ${option.name}`}
                                value={contracts.find((c) => c.id === formData.contract_template_id) || null}
                                onChange={(_, newValue) => handleChange('contract_template_id', newValue?.id || '')}
                                renderInput={(params) => <TextField {...params} label="Contrato" fullWidth />}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Autocomplete
                                options={activities}
                                getOptionLabel={(option) => `${option.code} - ${option.description}`}
                                value={activities.find((a) => a.id === formData.activity_id) || null}
                                onChange={(_, newValue) => handleChange('activity_id', newValue?.id || '')}
                                renderInput={(params) => <TextField {...params} label="Actividad" fullWidth />}
                            />
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={loading || saving || !formData.product_id}
                >
                    {saving ? 'Guardando...' : 'Guardar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductAssociationModal;
