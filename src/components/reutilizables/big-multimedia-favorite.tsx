import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/reservation/dialog";
import { Card, CardContent } from "@/components/reservation/card";
import { Trash, Upload, Plus, Star, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/reservation/button";
import { useState, useEffect, useRef } from "react";
import ImageUploader from "@/components/reutilizables/multimedia"
import { toast } from "sonner";
import { Skeleton } from "@/components/reutilizables/skeleton";

interface Image {
    id: string;
    name: string;
    src: string;
    isMain?: boolean;
    position?: number;
}

interface BigMultimediaFavoriteProps {
    onImagesChange: (images: { url: string; is_main: boolean; position: number }[]) => void;
    initialImages?: Image[];
}

const MAX_IMAGES = 50;

export default function BigMultimediaFavorite({ onImagesChange, initialImages = [] }: BigMultimediaFavoriteProps) {
    const [images, setImages] = useState<Image[]>(() =>
        initialImages.map((img, index) => ({
            ...img,
            isMain: index === 0,
            position: index
        }))
    );
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState<Image[]>([]);
    const [selectedForSwap, setSelectedForSwap] = useState<number | null>(null);
    const [loadingImages, setLoadingImages] = useState<{ [key: string]: boolean }>({});
    const prevImagesRef = useRef(images);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (JSON.stringify(prevImagesRef.current) !== JSON.stringify(images)) {
            const imagesToSend = images.map((img, index) => ({
                url: img.src,
                is_main: img.isMain || false,
                position: index
            }));
            onImagesChange(imagesToSend);
            prevImagesRef.current = images;
        }
    }, [images, onImagesChange]);

    const handleImageSelect = (image: Image | null) => {
        if (!image) return;

        // Verificar si la imagen ya está en la lista principal
        const isAlreadyInList = images.some(img => img.id === image.id);
        if (isAlreadyInList) {
            toast.info("Esta imagen ya está en la lista");
            return;
        }

        // Verificar espacio disponible
        const remainingSlots = MAX_IMAGES - images.length;
        if (remainingSlots <= 0) {
            toast.warning("Has alcanzado el límite máximo de imágenes");
            setDialogOpen(false);
            return;
        }

        // Agregar la nueva imagen al final
        const newImage = {
            ...image,
            position: images.length,
            isMain: images.length === 0
        };

        setLoadingImages(prev => ({ ...prev, [newImage.id]: true }));
        setImages(prevImages => [...prevImages, newImage]);

        if (images.length + 1 >= MAX_IMAGES) {
            toast.success("Límite de imágenes alcanzado");
        } else {
            toast.success("Imagen agregada correctamente");
        }
    };

    const handleMultipleImageSelect = (selectedImages: Image[]) => {
        const remainingSlots = MAX_IMAGES - images.length;
        if (remainingSlots <= 0) {
            toast.warning("Has alcanzado el límite máximo de imágenes");
            setDialogOpen(false);
            return;
        }

        const imagesToAdd = selectedImages.slice(0, remainingSlots);

        // Filtrar imágenes que ya están en la lista
        const newImages = imagesToAdd.filter(img => !images.some(existingImg => existingImg.id === img.id))
            .map((img, index) => ({
                ...img,
                position: images.length + index,
                isMain: images.length === 0 && index === 0
            }));

        if (newImages.length === 0) {
            toast.info("No hay nuevas imágenes para agregar");
            return;
        }

        // Marcar todas las nuevas imágenes como cargando
        const loadingState = newImages.reduce((acc, img) => ({ ...acc, [img.id]: true }), {});
        setLoadingImages(prev => ({ ...prev, ...loadingState }));

        // Agregar las nuevas imágenes
        setImages(prevImages => [...prevImages, ...newImages]);

        toast.success(`${newImages.length} imagen(es) agregada(s) correctamente`);

        if (images.length + newImages.length >= MAX_IMAGES) {
            toast.success("Límite de imágenes alcanzado");
        }
    };

    const handleImageLoad = (imageId: string) => {
        setLoadingImages(prev => ({ ...prev, [imageId]: false }));
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedImages([]);
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index)
            .map((img, i) => ({
                ...img,
                position: i,
                isMain: i === 0 ? true : img.isMain
            }));

        setImages(updatedImages);
    };

    const handleSetMain = (id: string) => {
        const updatedImages = images.map(img => ({
            ...img,
            isMain: img.id === id
        }));

        setImages(updatedImages);
    };

    const moveImage = (index: number, direction: 'left' | 'right') => {
        if (
            (direction === 'left' && index === 0) ||
            (direction === 'right' && index === images.length - 1)
        ) return;

        const newImages = [...images];
        const newIndex = direction === 'left' ? index - 1 : index + 1;

        // Intercambiar posiciones
        [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];

        // Actualizar posiciones
        const updatedImages = newImages.map((img, i) => ({
            ...img,
            position: i
        }));

        setImages(updatedImages);
    };

    const handleSwapSelect = (index: number) => {
        if (selectedForSwap === null) {
            setSelectedForSwap(index);
            toast.info("Selecciona otra imagen para intercambiar posiciones");
        } else if (selectedForSwap === index) {
            setSelectedForSwap(null);
        } else {
            // Realizar el intercambio
            const newImages = [...images];
            [newImages[selectedForSwap], newImages[index]] = [newImages[index], newImages[selectedForSwap]];

            // Actualizar posiciones
            const updatedImages = newImages.map((img, i) => ({
                ...img,
                position: i
            }));

            setImages(updatedImages);
            setSelectedForSwap(null);
            toast.success("Posiciones intercambiadas");
        }
    };

    return (
        <Card className="h-full">
            <CardContent className="p-4 h-full flex flex-col">
                {images.length > 0 ? (
                    <div className="flex flex-col h-full">
                        <div className="flex-1 min-h-0 overflow-y-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {images.map((image, index) => (
                                    <div
                                        key={image.id}
                                        className={`relative group transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${selectedForSwap === index ? 'shadow-lg scale-[1.02]' : ''
                                            }`}
                                        onClick={() => selectedForSwap !== null && handleSwapSelect(index)}
                                    >
                                        <div className={`relative rounded-lg overflow-hidden border-2 ${selectedForSwap === index ? 'border-blue-500' : 'border-gray-200'
                                            } transition-all duration-300`}>
                                            {loadingImages[image.id] && (
                                                <div className="absolute inset-0 z-10">
                                                    <Skeleton className="w-full h-32" />
                                                </div>
                                            )}
                                            {selectedForSwap === null && (
                                                <div className="absolute top-1 left-1 z-10">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSwapSelect(index);
                                                        }}
                                                        className="bg-white rounded-full p-1 hover:bg-gray-100 transition-colors duration-200"
                                                        title="Seleccionar para intercambiar"
                                                    >
                                                        <ArrowUpDown className="h-3 w-3 text-gray-500" />
                                                    </button>
                                                </div>
                                            )}
                                            <img
                                                src={image.src}
                                                alt={image.name}
                                                className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                                                onLoad={() => handleImageLoad(image.id)}
                                                style={{ opacity: loadingImages[image.id] ? 0 : 1 }}
                                            />
                                            <div className={`absolute inset-0 transition-all duration-300 ${selectedForSwap === index ? 'bg-blue-500/20' : 'bg-black/0 group-hover:bg-black/40'
                                                }`}></div>
                                            {selectedForSwap !== null && selectedForSwap !== index && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <ArrowUpDown className="h-12 w-12 text-white animate-pulse" />
                                                </div>
                                            )}
                                            {selectedForSwap === null && (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="absolute top-1 right-1 p-1.5 rounded-full bg-white z-10 hover:bg-gray-100 transition-colors duration-200"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSetMain(image.id);
                                                        }}
                                                        title="Marcar como principal"
                                                    >
                                                        <Star
                                                            size={16}
                                                            className={`transition-all duration-300 ${image.isMain ? "text-yellow-400 fill-yellow-400 scale-110" : "text-gray-400"}`}
                                                        />
                                                    </button>
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-end p-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveImage(index);
                                                            }}
                                                            className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200 transform hover:scale-110"
                                                        >
                                                            <Trash size={16} />
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-xs text-gray-600 truncate flex-1">{image.name}</p>
                                            <span className="text-xs text-gray-500 ml-1 transition-colors duration-200 group-hover:text-gray-700">#{index + 1}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {images.length < MAX_IMAGES && (
                            <div className="flex justify-center mt-4 pt-4 border-t">
                                <Dialog open={dialogOpen} onOpenChange={(open) => {
                                    if (!open) {
                                        setSelectedImages([]);
                                    }
                                    setDialogOpen(open);
                                }}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full max-w-xs transition-all duration-200 hover:scale-[1.02]">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Agregar desde biblioteca
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-4">
                                        <DialogTitle className="text-lg font-semibold">Añadir nuevas imágenes</DialogTitle>
                                        <DialogDescription className="text-sm text-gray-500 mt-1">
                                            Escoge las imágenes de la biblioteca o sube nuevas imágenes. Puedes seleccionar varias antes de cerrar.
                                            {selectedImages.length > 0 && (
                                                <span className="block mt-1 text-sm font-medium text-gray-700">
                                                    {selectedImages.length} imagen(es) seleccionada(s)
                                                </span>
                                            )}
                                        </DialogDescription>
                                        <div className="flex justify-center mb-4">
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const files = e.target.files;
                                                        if (files) {
                                                            const selectedImages = Array.from(files).map(file => ({
                                                                id: Math.random().toString(36).substr(2, 9),
                                                                name: file.name,
                                                                src: URL.createObjectURL(file)
                                                            }));
                                                            handleMultipleImageSelect(selectedImages);
                                                        }
                                                    }}
                                                    className="hidden"
                                                    id="multiple-image-upload"
                                                />
                                                <label
                                                    htmlFor="multiple-image-upload"
                                                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
                                                >
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Subir imágenes
                                                </label>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-h-0 mt-3 overflow-y-auto">
                                            <ImageUploader
                                                onSelectImage={handleImageSelect}
                                                selectedImages={images}
                                                onUploadStart={() => setIsUploading(true)}
                                                onUploadError={() => {
                                                    setIsUploading(false);
                                                    toast.error("Error al subir la imagen");
                                                }}
                                                accept="image/*"
                                            />
                                        </div>
                                        <div className="flex justify-between items-center mt-3 pt-3 border-t">
                                            {selectedImages.length > 0 && (
                                                <span className="text-sm text-gray-600">
                                                    {selectedImages.length} imagen(es) seleccionada(s)
                                                </span>
                                            )}
                                            <div className="flex gap-2">
                                                {selectedImages.length > 0 && (
                                                    <Button onClick={handleDialogClose}>
                                                        Agregar seleccionadas
                                                    </Button>
                                                )}
                                                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                                    Cerrar
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-6 w-full text-center flex-1">
                        <Upload size={32} className="mb-2 text-gray-500" />
                        <p className="text-sm text-gray-600">Acepta imágenes con extensiones jpg, jpeg, png, svg</p>
                        <p className="text-xs text-gray-500 mt-1">Puedes agregar hasta {MAX_IMAGES} imágenes</p>

                        <div className="flex justify-center mt-4">
                            <Dialog open={dialogOpen} onOpenChange={(open) => {
                                if (!open) {
                                    setSelectedImages([]);
                                }
                                setDialogOpen(open);
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="w-full max-w-xs transition-all duration-200 hover:scale-[1.02]">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Agregar desde biblioteca
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-4">
                                    <DialogTitle className="text-lg font-semibold">Añadir nuevas imágenes</DialogTitle>
                                    <DialogDescription className="text-sm text-gray-500 mt-1">
                                        Escoge las imágenes de la biblioteca o sube nuevas imágenes. Puedes seleccionar varias antes de cerrar.
                                        {selectedImages.length > 0 && (
                                            <span className="block mt-1 text-sm font-medium text-gray-700">
                                                {selectedImages.length} imagen(es) seleccionada(s)
                                            </span>
                                        )}
                                    </DialogDescription>
                                    <div className="flex justify-center mb-4">
                                        <div className="relative">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const files = e.target.files;
                                                    if (files) {
                                                        const selectedImages = Array.from(files).map(file => ({
                                                            id: Math.random().toString(36).substr(2, 9),
                                                            name: file.name,
                                                            src: URL.createObjectURL(file)
                                                        }));
                                                        handleMultipleImageSelect(selectedImages);
                                                    }
                                                }}
                                                className="hidden"
                                                id="multiple-image-upload"
                                            />
                                            <label
                                                htmlFor="multiple-image-upload"
                                                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
                                            >
                                                <Upload className="h-4 w-4 mr-2" />
                                                Subir imágenes
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-h-0 mt-3 overflow-y-auto">
                                        <ImageUploader
                                            onSelectImage={handleImageSelect}
                                            selectedImages={images}
                                            onUploadStart={() => setIsUploading(true)}
                                            onUploadError={() => {
                                                setIsUploading(false);
                                                toast.error("Error al subir la imagen");
                                            }}
                                            accept="image/*"
                                        />
                                    </div>
                                    <div className="flex justify-between items-center mt-3 pt-3 border-t">
                                        {selectedImages.length > 0 && (
                                            <span className="text-sm text-gray-600">
                                                {selectedImages.length} imagen(es) seleccionada(s)
                                            </span>
                                        )}
                                        <div className="flex gap-2">
                                            {selectedImages.length > 0 && (
                                                <Button onClick={handleDialogClose}>
                                                    Agregar seleccionadas
                                                </Button>
                                            )}
                                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                                Cerrar
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                )}

                {images.length > 0 && (
                    <p className="text-xs text-gray-500 text-right mt-2">
                        {images.length} de {MAX_IMAGES} imágenes
                    </p>
                )}
            </CardContent>
        </Card>
    );
} 