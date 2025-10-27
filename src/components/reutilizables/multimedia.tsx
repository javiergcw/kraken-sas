"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/reservation/button"
import { Input } from "@/components/reutilizables/input"
import { Grid, List, ArrowDownUp, ArrowUpDown, Trash, Upload } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/reutilizables/dropdown-menu"

const MAX_FILE_SIZE_KB = 1000; // 1MB en KB

async function compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Calcular nuevas dimensiones manteniendo la proporción
                const maxDimension = 1920; // Máxima dimensión permitida
                if (width > height && width > maxDimension) {
                    height = Math.round((height * maxDimension) / width);
                    width = maxDimension;
                } else if (height > maxDimension) {
                    width = Math.round((width * maxDimension) / height);
                    height = maxDimension;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                // Comprimir la imagen
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Error al comprimir la imagen'));
                        return;
                    }

                    // Si el blob es más grande que 1MB, reducir la calidad
                    if (blob.size > MAX_FILE_SIZE_KB * 1024) {
                        canvas.toBlob((compressedBlob) => {
                            if (!compressedBlob) {
                                reject(new Error('Error al comprimir la imagen'));
                                return;
                            }
                            const compressedFile = new File([compressedBlob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        }, 'image/jpeg', 0.5); // Reducir calidad al 50%
                    } else {
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    }
                }, 'image/jpeg', 0.8); // Calidad inicial del 80%
            };
            img.onerror = () => reject(new Error('Error al cargar la imagen'));
        };
        reader.onerror = () => reject(new Error('Error al leer el archivo'));
    });
}

interface Image {
    id: string;
    name: string;
    src: string;
    is_primary?: boolean;
    isMain?: boolean;
}

interface ImageUploaderProps {
    onSelectImage: (image: Image | null) => void;
    initialImage?: Image;
    onUploadStart?: (files: FileList | null) => void;
    onUploadError?: () => void;
    accept?: string;
    selectedImages?: Image[];
}

export default function ImageUploader({ 
    onSelectImage, 
    initialImage,
    onUploadStart,
    onUploadError,
    accept = "image/*",
    selectedImages = []
}: ImageUploaderProps) {
    const [images, setImages] = useState<Image[]>(initialImage ? [initialImage] : [])
    const [viewMode, setViewMode] = useState("grid")
    const [search, setSearch] = useState("")
    const [sortOrder, setSortOrder] = useState("asc")
    const [dragOver, setDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(new Set())
    const [localSelectedImages, setLocalSelectedImages] = useState<Image[]>([])
    const [deletingImages, setDeletingImages] = useState<Set<string>>(new Set())

    useEffect(() => {
        if (selectedImages && selectedImages.length > 0) {
            const newSelectedIds = new Set(selectedImages.map(img => img.id));
            setSelectedImageIds(newSelectedIds);
            setLocalSelectedImages(selectedImages);
        }
    }, [selectedImages]);

    // Datos mock de imágenes
    useEffect(() => {
        const mockImages: Image[] = [
            {
                id: "1",
                name: "imagen-1.jpg",
                src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=500&fit=crop",
                is_primary: false
            },
            {
                id: "2",
                name: "imagen-2.jpg",
                src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&h=500&fit=crop",
                is_primary: false
            },
            {
                id: "3",
                name: "imagen-3.jpg",
                src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=500&fit=crop",
                is_primary: false
            },
            {
                id: "4",
                name: "imagen-4.jpg",
                src: "https://images.unsplash.com/photo-1600566753091-362e8cc7e4cf?w=500&h=500&fit=crop",
                is_primary: false
            },
            {
                id: "5",
                name: "imagen-5.jpg",
                src: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=500&h=500&fit=crop",
                is_primary: false
            },
        ];
        setImages(mockImages);
    }, []);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        onUploadStart?.(files);

        const successfulUploads: Image[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                console.error(`El archivo ${file.name} no es una imagen válida`);
                continue;
            }

            try {
                // Comprimir la imagen antes de subirla
                const compressedFile = await compressImage(file);
                
                // Crear una URL local para la imagen
                const reader = new FileReader();
                const imageUrl = await new Promise<string>((resolve) => {
                    reader.onloadend = () => {
                        resolve(reader.result as string);
                    };
                    reader.readAsDataURL(compressedFile);
                });
                
                // Simular subida exitosa con datos locales
                const newImage: Image = {
                    id: `local-${Date.now()}-${i}`,
                    name: file.name,
                    src: imageUrl,
                    is_primary: false
                };
                
                successfulUploads.push(newImage);
                
                // Agregar a la lista de imágenes
                setImages(prev => [...prev, newImage]);
                
                // Notificar al componente padre sobre cada imagen individualmente
                onSelectImage(newImage);
            } catch (error) {
                console.error(`Error al procesar ${file.name}:`, error);
                onUploadError?.();
            }
        }

        if (successfulUploads.length > 0) {
            console.log(`Se agregaron ${successfulUploads.length} imagen(es) correctamente`);
        }

        // Limpiar el input para permitir seleccionar los mismos archivos nuevamente
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDrop = async (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault()
        setDragOver(false)
        const file = event.dataTransfer.files?.[0]
        if (file) {
            onUploadStart?.(null);

            try {
                // Crear una URL local para la imagen
                const reader = new FileReader();
                const imageUrl = await new Promise<string>((resolve) => {
                    reader.onloadend = () => {
                        resolve(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                });

                const newImage: Image = {
                    id: `local-${Date.now()}`,
                    name: file.name,
                    src: imageUrl,
                    is_primary: false
                };

                setImages([...images, newImage])
                onSelectImage(newImage)
            } catch (error) {
                console.error("Error al subir el archivo:", error);
                onUploadError?.();
            }
        }
    }

    const handleRemoveImage = useCallback((img: Image) => {
        // Solo actualizamos los estados locales para deseleccionar
        setSelectedImageIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(img.id);
            return newSet;
        });
        
        setLocalSelectedImages(prev => prev.filter(image => image.id !== img.id));
        
        // Notificamos al componente padre que se deseleccionó la imagen
        onSelectImage(null);
    }, [onSelectImage]);

    const handleImageSelect = useCallback((img: Image) => {
        const isSelected = selectedImageIds.has(img.id);
        
        if (isSelected) {
            // Deseleccionar la imagen
            setSelectedImageIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(img.id);
                return newSet;
            });
            
            setLocalSelectedImages(prev => prev.filter(image => image.id !== img.id));
            
            // Notificar al componente padre
            onSelectImage(null);
        } else {
            // Verificar si la imagen ya está en localSelectedImages
            const isAlreadySelected = localSelectedImages.some(image => image.id === img.id);
            if (!isAlreadySelected) {
                setSelectedImageIds(prev => {
                    const newSet = new Set(prev);
                    newSet.add(img.id);
                    return newSet;
                });
                
                setLocalSelectedImages(prev => [...prev, img]);
                
                // Notificar al componente padre con la imagen seleccionada
                onSelectImage(img);
            }
        }
    }, [onSelectImage, localSelectedImages, selectedImageIds]);

    const handleDeleteImage = async (fileID: string) => {
        const confirmed = window.confirm("¿Estás seguro de que deseas eliminar esta imagen?")
        if (confirmed) {
            // Agregar la imagen al conjunto de imágenes en proceso de eliminación
            setDeletingImages(prev => new Set([...prev, fileID]))

            try {
                // Simular eliminación con retraso
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Actualizar las imágenes de la galería
                setImages(images.filter(img => img.id !== fileID))
                
                // Deseleccionar y remover la imagen de las seleccionadas
                setSelectedImageIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(fileID);
                    return newSet;
                });
                
                // Remover de las imágenes seleccionadas locales
                setLocalSelectedImages(prev => prev.filter(img => img.id !== fileID));
                
                // Notificar al componente padre
                onSelectImage(null);
                
                console.log("Imagen eliminada con éxito")
            } catch (error) {
                console.error("Error al eliminar la imagen:", error);
            } finally {
                // Remover la imagen del conjunto de imágenes en proceso de eliminación
                setDeletingImages(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(fileID);
                    return newSet;
                });
            }
        }
    }

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    }

    const filteredImages = [...images]
        .filter((img) => img.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => (sortOrder === "asc" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)))

    useEffect(() => {
        console.log("Preview URL actualizado:", images);
    }, [images]);

    return (
        <>
            {localSelectedImages.length > 0 && (
                <div className="mb-3 p-2 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-700">
                            Imágenes seleccionadas ({localSelectedImages.length})
                        </h3>
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                                setLocalSelectedImages([]);
                                setSelectedImageIds(new Set());
                                onSelectImage(null);
                            }}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 px-2"
                        >
                            <Trash className="h-3.5 w-3.5 mr-1" />
                            Limpiar
                        </Button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                        {localSelectedImages.map((img, index) => (
                            <div key={img.id} className="relative group">
                                <div className="relative rounded-lg overflow-hidden ring-2 ring-blue-500 ring-offset-1 shadow-sm hover:shadow-md transition-all duration-200">
                                    <img
                                        src={img.src || "/placeholder.svg"}
                                        alt={img.name}
                                        className="w-full h-20 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-end p-1">
                                        <button
                                            className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveImage(img);
                                            }}
                                        >
                                            <Trash className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-xs text-gray-600 truncate flex-1">{img.name}</p>
                                    <span className="text-xs text-gray-500 ml-1">#{index + 1}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex items-center gap-2 mb-2">
                <Input
                    placeholder="Buscar imagen..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 h-8 text-sm"
                />
                <Button variant="outline" onClick={toggleSortOrder} className="shrink-0 h-8 w-8 p-0">
                    {sortOrder === "asc" ? <ArrowDownUp className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="shrink-0 h-8 w-8 p-0">
                            {viewMode === "grid" ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setViewMode("grid")}>
                            <Grid className="mr-2 h-4 w-4" /> Cuadrícula
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setViewMode("list")}>
                            <List className="mr-2 h-4 w-4" /> Lista
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto">
                <label
                    className={`cursor-pointer block bg-white p-2 text-center rounded-lg border-2 border-dashed transition-colors duration-200 ${
                        dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDragOver={(e) => {
                        e.preventDefault()
                        setDragOver(true)
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                >
                    <div className="flex flex-col items-center">
                        <div className="bg-gray-50 rounded-full p-1.5 mb-1.5">
                            <Upload className="h-4 w-4 text-gray-500" />
                        </div>
                        <Button variant="outline" size="sm" className="mb-1.5 h-8" onClick={() => fileInputRef.current?.click()}>
                            Añadir multimedia
                        </Button>
                        <input 
                            ref={fileInputRef} 
                            type="file" 
                            className="hidden" 
                            onChange={handleImageUpload}
                            accept={accept}
                            multiple
                        />
                        <p className="text-xs text-gray-600">Arrastrar y soltar archivos aquí</p>
                        <p className="text-xs text-gray-500 mt-0.5">Formatos permitidos: jpg, jpeg, png, svg</p>
                    </div>
                </label>

                <div className="bg-white rounded-lg border p-2">
                    {loading ? (
                        <div className="flex items-center justify-center h-20">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                        </div>
                    ) : viewMode === "grid" ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                            {filteredImages.map((img) => (
                                <div key={img.id} className="relative group">
                                    <div 
                                        className={`relative rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
                                            selectedImageIds.has(img.id) 
                                                ? 'ring-2 ring-blue-500 ring-offset-1 shadow-md' 
                                                : 'hover:shadow-sm'
                                        } ${deletingImages.has(img.id) ? 'opacity-50' : ''}`}
                                        onClick={() => handleImageSelect(img)}
                                    >
                                        <img
                                            src={img.src || "/placeholder.svg"}
                                            alt={img.name}
                                            className={`w-full h-20 object-cover transition-all duration-200 ${
                                                selectedImageIds.has(img.id) ? 'opacity-75' : 'hover:opacity-90'
                                            }`}
                                        />
                                        {selectedImageIds.has(img.id) && (
                                            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                                                <div className="bg-white rounded-full p-1 shadow-sm">
                                                    <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                        {deletingImages.has(img.id) && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-start justify-end p-1">
                                            <button
                                                className={`bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200 ${
                                                    deletingImages.has(img.id) ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (!deletingImages.has(img.id)) {
                                                        handleDeleteImage(img.id);
                                                    }
                                                }}
                                                disabled={deletingImages.has(img.id)}
                                            >
                                                <Trash className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <p className="text-xs text-gray-600 truncate flex-1">{img.name}</p>
                                        {selectedImageIds.has(img.id) && (
                                            <span className="text-xs text-blue-500 font-medium ml-1">Seleccionada</span>
                                        )}
                                        {deletingImages.has(img.id) && (
                                            <span className="text-xs text-gray-500 ml-1">Eliminando...</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <ul className="space-y-1">
                            {filteredImages.map((img) => (
                                <li
                                    key={img.id}
                                    className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors duration-200 ${
                                        selectedImageIds.has(img.id) 
                                            ? 'bg-blue-50 hover:bg-blue-100 ring-1 ring-blue-500' 
                                            : 'hover:bg-gray-50'
                                    } ${deletingImages.has(img.id) ? 'opacity-50' : ''}`}
                                    onClick={() => handleImageSelect(img)}
                                >
                                    <div className="relative">
                                        <img 
                                            src={img.src || "/placeholder.svg"} 
                                            alt={img.name} 
                                            className="w-12 h-12 object-cover rounded-md"
                                        />
                                        {selectedImageIds.has(img.id) && (
                                            <div className="absolute inset-0 bg-blue-500/20 rounded-md flex items-center justify-center">
                                                <div className="bg-white rounded-full p-0.5">
                                                    <svg className="w-2.5 h-2.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                        {deletingImages.has(img.id) && (
                                            <div className="absolute inset-0 bg-black/40 rounded-md flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-medium text-gray-900 truncate">{img.name}</p>
                                            {selectedImageIds.has(img.id) && (
                                                <span className="text-xs text-blue-500 font-medium">Seleccionada</span>
                                            )}
                                            {deletingImages.has(img.id) && (
                                                <span className="text-xs text-gray-500">Eliminando...</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 truncate">{img.src}</p>
                                    </div>
                                    <button
                                        className={`p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors duration-200 ${
                                            deletingImages.has(img.id) ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!deletingImages.has(img.id)) {
                                                handleDeleteImage(img.id);
                                            }
                                        }}
                                        disabled={deletingImages.has(img.id)}
                                    >
                                        <Trash className="h-3 w-3" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    )
}
