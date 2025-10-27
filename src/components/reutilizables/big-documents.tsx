import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/reservation/dialog";
import { Card, CardContent, CardTitle } from "@/components/reservation/card";
import { Trash, Upload, FileText, Download } from "lucide-react";
import { Button } from "@/components/reservation/button";
import { useState, useEffect } from "react";
import DocumentUploader from "@/components/reutilizables/document-uploader";

interface Document {
    id: string;
    name: string;
    url: string;
    type: string;
    size?: number;
}

export default function DocumentManager({ 
    onDocumentSelect, 
    initialDocument, 
    onInputChange, 
    resetOnDiscard = false 
}: { 
    onDocumentSelect: (document: Document | null) => void, 
    initialDocument?: Document,
    onInputChange?: () => void,
    resetOnDiscard?: boolean
}) {
    const [preview, setPreview] = useState<Document | null>(initialDocument || null);
    const [document, setDocument] = useState<Document | null>(initialDocument || null);

    useEffect(() => {
        console.log("DocumentManager - initialDocument recibido:", initialDocument);
        if (initialDocument) {
            console.log("DocumentManager - Estableciendo documento inicial:", initialDocument);
            setPreview(initialDocument);
            setDocument(initialDocument);
        } else {
            console.log("DocumentManager - No hay documento inicial");
            setPreview(null);
            setDocument(null);
        }
    }, [initialDocument]);

    // Efecto para reiniciar cuando se descartan los cambios
    useEffect(() => {
        if (resetOnDiscard) {
            setPreview(null);
            setDocument(null);
        }
    }, [resetOnDiscard]);

    const removeDocument = () => {
        setDocument(null);
        setPreview(null);
        if (onInputChange) {
            onInputChange();
        }
        onDocumentSelect(null);
    };

    const handleDocumentSelect = (selectedDocument: Document | null) => {
        if (onInputChange) {
            onInputChange();
        }
        onDocumentSelect(selectedDocument);
        if (selectedDocument) {
            setPreview(selectedDocument);
            setDocument(selectedDocument);
        } else {
            setPreview(null);
            setDocument(null);
        }
    };

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'docx':
                return '📝';
            case 'doc':
                return '📝';
            case 'pdf':
                return '📄';
            case 'xls':
            case 'xlsx':
                return '📊';
            case 'ppt':
            case 'pptx':
                return '📈';
            case 'txt':
                return '📄';
            default:
                return '📝'; // Por defecto muestra icono de documento
        }
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return '';
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <Card className="shadow-none">
            <CardContent className="p-4 space-y-4 flex flex-col">
                <CardTitle>
                    Documento de Plantilla
                </CardTitle>
                {preview ? (
                    <div className="relative w-full max-w-md">
                        <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-2xl">{getFileIcon(preview.name)}</span>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {preview.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {preview.type} {preview.size && `• ${formatFileSize(preview.size)}`}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(preview.url, '_blank')}
                                    className="flex items-center gap-1"
                                >
                                    <Download size={14} />
                                    Ver
                                </Button>
                                <Button
                                    className="p-1 bg-red-500 text-white rounded-full"
                                    size="icon"
                                    variant="destructive"
                                    onClick={removeDocument}
                                >
                                    <Trash size={14} />
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 w-full text-center">
                        <Upload size={32} className="mb-2 text-gray-500" />
                        <p className="text-sm text-gray-600">
                            Acepta documentos con extensiones docx, doc, xls, xlsx, ppt, pptx, txt
                        </p>
                        <div className="flex flex-wrap gap-4 gap-y-2 mt-4 w-full justify-center sm:justify-start">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="w-full">
                                        <Upload size={16} className="mr-2" />
                                        Subir nuevo documento
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogTitle>Subir nuevo documento</DialogTitle>
                                    <DialogDescription>
                                        Sube un documento de plantilla para el contrato.
                                    </DialogDescription>
                                    <DocumentUploader 
                                        onSelectDocument={(doc) => handleDocumentSelect({
                                            id: doc.id,
                                            name: doc.name,
                                            url: doc.src,
                                            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                        })} 
                                    />
                                </DialogContent>
                            </Dialog>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full">
                                        <FileText size={16} className="mr-2" />
                                        Seleccionar existente
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogTitle>Seleccionar documento existente</DialogTitle>
                                    <DialogDescription>
                                        Escoge un documento de la biblioteca.
                                    </DialogDescription>
                                    <DocumentUploader 
                                        onSelectDocument={(doc) => handleDocumentSelect({
                                            id: doc.id,
                                            name: doc.name,
                                            url: doc.src,
                                            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                        })} 
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 