"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/reservation/button"
import { Input } from "@/components/reutilizables/input"
import { ScrollArea } from "@/components/reutilizables/scroll-area"
import { FileText, Upload } from "lucide-react"
import { toast } from "sonner"

interface Document {
    id: string;
    name: string;
    src: string;
}

interface DocumentUploaderProps {
    onSelectDocument: (document: Document) => void;
    onUploadStart?: () => void;
    onUploadError?: () => void;
    accept?: string;
}

// Mock data - documentos de ejemplo
const MOCK_DOCUMENTS: Document[] = [
    { id: "1", name: "Contrato Arrendamiento", src: "https://via.placeholder.com/600x800.pdf" },
    { id: "2", name: "Escritura de Propiedad", src: "https://via.placeholder.com/600x800.pdf" },
    { id: "3", name: "Reglamento de Copropiedad", src: "https://via.placeholder.com/600x800.pdf" },
    { id: "4", name: "Certificado de Tradición", src: "https://via.placeholder.com/600x800.pdf" },
    { id: "5", name: "Oferta de Compra", src: "https://via.placeholder.com/600x800.pdf" }
];

export default function DocumentUploaderSimple({ 
    onSelectDocument,
    onUploadStart,
    onUploadError,
    accept = ".docx"
}: DocumentUploaderProps) {
    const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS)
    const [search, setSearch] = useState("")
    const [dragOver, setDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDocumentUpload = (file: File) => {
        // Validación de tamaño (500 KB máximo)
        const MAX_SIZE_KB = 500;
        if (file.size / 1024 > MAX_SIZE_KB) {
            toast.error("El archivo es demasiado grande. El tamaño máximo permitido es de 500 KB.");
            if (onUploadError) onUploadError();
            return;
        }

        // Validación de tipo de archivo
        const validDocxTypes = [
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-word.document.12',
            'application/octet-stream'
        ];
        
        const isValidDocxType = validDocxTypes.includes(file.type) || 
                               file.name.toLowerCase().endsWith('.docx');
        
        if (!isValidDocxType) {
            toast.error("Solo se permiten archivos DOCX");
            if (onUploadError) onUploadError();
            return;
        }

        if (onUploadStart) onUploadStart();

        // Simular carga del documento
        setTimeout(() => {
            const fileName = file.name.replace(/\.docx$/i, '');
            const newDocument: Document = {
                id: Date.now().toString(),
                name: fileName,
                src: URL.createObjectURL(file), // Usar la URL local del archivo
            }
            
            setDocuments(prev => [...prev, newDocument]);
            
            toast.success("Documento agregado exitosamente");
            
            // Llamar al callback si es necesario
            if (onSelectDocument) {
                // Pequeño delay para mostrar el toast primero
                setTimeout(() => {
                    onSelectDocument(newDocument);
                }, 100);
            }
        }, 500);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            handleDocumentUpload(file)
            // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault()
        setDragOver(false)
        const file = event.dataTransfer.files?.[0]
        if (file) {
            handleDocumentUpload(file)
        }
    }

    const filteredDocuments = documents.filter((doc) => 
        doc.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Buscar documento..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1"
                />
            </div>

            <label
                className={`cursor-pointer block bg-gray-100 p-6 text-center rounded-md border border-dashed ${dragOver ? "border-blue-500" : "border-gray-200"}`}
                onDragOver={(e) => {
                    e.preventDefault()
                    setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
            >
                <Button variant="outline" className="mb-2" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Añadir documento
                </Button>
                <input 
                    ref={fileInputRef} 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept={accept}
                />
                <span className="text-sm text-gray-600 block">Arrastrar y soltar documento aquí</span>
            </label>

            <ScrollArea className="max-h-64 p-4 border border-gray-200 rounded-md">
                {filteredDocuments.length > 0 ? (
                    <div className="space-y-2">
                        {filteredDocuments.map((doc) => (
                            <div 
                                key={doc.id} 
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                onClick={() => onSelectDocument(doc)}
                            >
                                <div className="bg-white p-2 rounded-md">
                                    <FileText className="w-6 h-6 text-red-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm font-medium text-gray-900 block truncate">{doc.name}</span>
                                    <a 
                                        href={doc.src} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-500 hover:text-blue-600 hover:underline"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Ver documento
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-4">
                        No hay documentos disponibles
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}

