"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/reservation/card";
import { Input } from "@/components/reutilizables/input";
import { Label } from "@/components/reutilizables/label";
import { Textarea } from "@/components/reutilizables/text-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/reutilizables/seletc";
import { Switch } from "@/components/reutilizables/switch";
import { Checkbox } from "@/components/reutilizables/checkbox";
import { Button } from "@/components/reservation/button";
import BigMultimediaFavorite from "@/components/reutilizables/big-multimedia-favorite";
import BigDocuments from "@/components/reutilizables/big-documents";
import dynamic from "next/dynamic";

// Importar el mapa de forma dinámica para evitar problemas de SSR
const MapComponent = dynamic(() => import("@/components/reutilizables/map"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="animate-spin border-4 border-gray-300 border-t-primary rounded-full w-12 h-12"></span>
        </div>
    )
});

// Mock data
const mockEstate = {
    id: 1,
    title: "Moderno apartamento en el centro",
    description: "Hermoso apartamento con amplias zonas",
    property_type_id: 1,
    operation_type_id: 1,
    status: true,
    availability: "available" as const,
    price: 500000000,
    rent_price: 2000000,
    deposit: 5000000,
    admin_fee: 200000,
    area_total: 85,
    area_construida: 65,
    estrato: 3,
    built_year: 2020,
    location: {
        address: "Calle 123 #45-67",
        country_id: 1,
        department_id: 1,
        city_id: 1,
        neighborhood_id: 1,
        zipCode: "050012",
        latitude: 6.2442,
        longitude: -75.5812
    },
    features: {
        bedrooms: 3,
        bathrooms: 2,
        garages: 1,
        floors: 1,
        furnished: false,
        pets_allowed: true,
        private_security: true
    },
    images: [
        { url: "https://via.placeholder.com/600x400", is_main: true, position: 0 }
    ],
    documents: [] as Array<{ id: number; property_id: number; created_at: string; name: string; url: string; description: string }>,
    amenities: [] as Array<{ id: number; name: string; description: string; icon: string }>
};

const mockDepartments = [
    { id: 1, name: "Antioquia" },
    { id: 2, name: "Valle del Cauca" },
    { id: 3, name: "Cundinamarca" }
];

const mockCities = [
    { id: 1, name: "Medellín", department_id: 1 },
    { id: 2, name: "Cali", department_id: 2 },
    { id: 3, name: "Bogotá", department_id: 3 }
];

const mockNeighborhoods = [
    { id: 1, name: "El Poblado", city_id: 1 },
    { id: 2, name: "Laureles", city_id: 1 },
    { id: 3, name: "Bella Vista", city_id: 1 }
];

const mockAmenities = [
    { id: 1, name: "Piscina" },
    { id: 2, name: "Gimnasio" },
    { id: 3, name: "Garaje" },
    { id: 4, name: "Ascensor" }
];

const mockPropertyTypes = [
    { id: 1, name: "Apartamento" },
    { id: 2, name: "Casa" },
    { id: 3, name: "Local Comercial" }
];

const mockOperationTypes = [
    { id: 1, name: "Venta" },
    { id: 2, name: "Arriendo" },
    { id: 3, name: "Venta y Arriendo" }
];

export default function SimpleEditEstateForm() {
    const router = useRouter();
    const [estate, setEstate] = useState(mockEstate);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        console.log('Datos del formulario:', estate);
        
        // Simular guardado
        setTimeout(() => {
            toast.success("Formulario guardado exitosamente");
            setIsSaving(false);
        }, 1000);
    };

    const handleImagesChange = (selectedImages: any[]) => {
        if (!selectedImages || selectedImages.length === 0) return;

        const formattedImages = selectedImages.map((img, index) => ({
            url: img.url || img.src,
            is_main: img.isMain || false,
            position: index
        }));

        const hasMainImage = formattedImages.some(img => img.is_main);
        if (!hasMainImage && formattedImages.length > 0) {
            formattedImages[0].is_main = true;
        }

        setEstate(prev => ({
            ...prev,
            images: formattedImages
        }));
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        setEstate(prev => ({
            ...prev,
            location: {
                ...prev.location,
                latitude: lat,
                longitude: lng
            }
        }));
    };

    const filteredCities = mockCities.filter(city => city.department_id === estate.location.department_id);
    const filteredNeighborhoods = mockNeighborhoods.filter(n => n.city_id === estate.location.city_id);

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => router.back()}
                    className="hover:bg-accent"
                >
                    ←
                </Button>
                <h1 className="text-2xl font-bold">Editar Inmueble</h1>
            </div>

            <div className="flex w-full h-auto gap-4 items-start flex-wrap md:flex-nowrap">
                <div className="flex flex-col w-full md:w-3/5 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información General</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título *</Label>
                                <Input
                                    id="title"
                                    value={estate.title}
                                    onChange={(e) => setEstate(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Ej: Moderno apartamento en el centro"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    value={estate.description}
                                    onChange={(e) => setEstate(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Describe el inmueble..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tipo de Propiedad *</Label>
                                    <Select
                                        value={estate.property_type_id?.toString()}
                                        onValueChange={(value) => setEstate(prev => ({ ...prev, property_type_id: Number(value) }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona tipo de propiedad" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockPropertyTypes.map((pt) => (
                                                <SelectItem key={pt.id} value={pt.id.toString()}>{pt.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Tipo de Operación *</Label>
                                    <Select
                                        value={estate.operation_type_id?.toString()}
                                        onValueChange={(value) => setEstate(prev => ({ ...prev, operation_type_id: Number(value) }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona tipo de operación" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockOperationTypes.map((op) => (
                                                <SelectItem key={op.id} value={op.id.toString()}>{op.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Estado</Label>
                                    <Select
                                        value={estate.availability}
                                        onValueChange={(value) => setEstate(prev => ({ ...prev, availability: value as any }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona el estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="available">Disponible</SelectItem>
                                            <SelectItem value="reserved">Reservado</SelectItem>
                                            <SelectItem value="sold">Vendido</SelectItem>
                                            <SelectItem value="rented">Arrendado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Activo</Label>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={estate.status}
                                            onCheckedChange={(checked: boolean) => setEstate(prev => ({ ...prev, status: checked }))}
                                        />
                                        <Label>{estate.status ? "Activo" : "Inactivo"}</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Precio de Venta</Label>
                                    <div className="relative">
                                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={estate.price}
                                            onChange={(e) => setEstate(prev => ({ ...prev, price: Number(e.target.value) }))}
                                            className="pl-6"
                                            placeholder="Ingresa el precio de venta"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="rentPrice">Precio de Alquiler</Label>
                                    <div className="relative">
                                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                        <Input
                                            id="rentPrice"
                                            type="number"
                                            value={estate.rent_price}
                                            onChange={(e) => setEstate(prev => ({ ...prev, rent_price: Number(e.target.value) }))}
                                            className="pl-6"
                                            placeholder="Ingresa el precio de alquiler"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="deposit">Depósito de Garantía</Label>
                                    <div className="relative">
                                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                        <Input
                                            id="deposit"
                                            type="number"
                                            value={estate.deposit}
                                            onChange={(e) => setEstate(prev => ({ ...prev, deposit: Number(e.target.value) }))}
                                            className="pl-6"
                                            placeholder="Ingresa el depósito"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="adminFee">Cuota de Administración</Label>
                                    <div className="relative">
                                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                        <Input
                                            id="adminFee"
                                            type="number"
                                            value={estate.admin_fee}
                                            onChange={(e) => setEstate(prev => ({ ...prev, admin_fee: Number(e.target.value) }))}
                                            className="pl-6"
                                            placeholder="Ingresa la cuota de administración"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Dirección *</Label>
                                <Input
                                    id="address"
                                    value={estate.location.address}
                                    onChange={(e) => setEstate(prev => ({ 
                                        ...prev, 
                                        location: { ...prev.location, address: e.target.value } 
                                    }))}
                                    placeholder="Ingresa la dirección completa"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Departamento *</Label>
                                    <Select
                                        value={estate.location.department_id?.toString()}
                                        onValueChange={(value) => setEstate(prev => ({ 
                                            ...prev, 
                                            location: { ...prev.location, department_id: Number(value) } 
                                        }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un departamento" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockDepartments.map((department) => (
                                                <SelectItem key={department.id} value={department.id.toString()}>
                                                    {department.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Ciudad *</Label>
                                    <Select
                                        value={estate.location.city_id?.toString()}
                                        onValueChange={(value) => setEstate(prev => ({ 
                                            ...prev, 
                                            location: { ...prev.location, city_id: Number(value) } 
                                        }))}
                                        disabled={!estate.location.department_id}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una ciudad" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredCities.map((city) => (
                                                <SelectItem key={city.id} value={city.id.toString()}>
                                                    {city.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Barrio</Label>
                                    <Select
                                        value={estate.location.neighborhood_id?.toString()}
                                        onValueChange={(value) => setEstate(prev => ({ 
                                            ...prev, 
                                            location: { ...prev.location, neighborhood_id: Number(value) } 
                                        }))}
                                        disabled={!estate.location.city_id}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un barrio" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredNeighborhoods.map((neighborhood) => (
                                                <SelectItem key={neighborhood.id} value={neighborhood.id.toString()}>
                                                    {neighborhood.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="zipCode">Código Postal</Label>
                                    <Input
                                        id="zipCode"
                                        value={estate.location.zipCode}
                                        onChange={(e) => setEstate(prev => ({ 
                                            ...prev, 
                                            location: { ...prev.location, zipCode: e.target.value } 
                                        }))}
                                        placeholder="Ingresa el código postal"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Características</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bedrooms">Habitaciones</Label>
                                    <Input
                                        id="bedrooms"
                                        type="number"
                                        value={estate.features.bedrooms}
                                        onChange={(e) => setEstate(prev => ({ 
                                            ...prev, 
                                            features: { ...prev.features, bedrooms: Number(e.target.value) } 
                                        }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bathrooms">Baños</Label>
                                    <Input
                                        id="bathrooms"
                                        type="number"
                                        value={estate.features.bathrooms}
                                        onChange={(e) => setEstate(prev => ({ 
                                            ...prev, 
                                            features: { ...prev.features, bathrooms: Number(e.target.value) } 
                                        }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="garages">Garajes</Label>
                                    <Input
                                        id="garages"
                                        type="number"
                                        value={estate.features.garages}
                                        onChange={(e) => setEstate(prev => ({ 
                                            ...prev, 
                                            features: { ...prev.features, garages: Number(e.target.value) } 
                                        }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="floors">Pisos</Label>
                                    <Input
                                        id="floors"
                                        type="number"
                                        value={estate.features.floors}
                                        onChange={(e) => setEstate(prev => ({ 
                                            ...prev, 
                                            features: { ...prev.features, floors: Number(e.target.value) } 
                                        }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="area">Área Total (m²)</Label>
                                    <Input
                                        id="area"
                                        type="number"
                                        value={estate.area_total}
                                        onChange={(e) => setEstate(prev => ({ ...prev, area_total: Number(e.target.value) }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="areaConstruida">Área Construida (m²)</Label>
                                    <Input
                                        id="areaConstruida"
                                        type="number"
                                        value={estate.area_construida}
                                        onChange={(e) => setEstate(prev => ({ ...prev, area_construida: Number(e.target.value) }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="estrato">Estrato</Label>
                                    <Select
                                        value={estate.estrato?.toString()}
                                        onValueChange={(value) => setEstate(prev => ({ ...prev, estrato: Number(value) }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona el estrato" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5, 6].map((estrato) => (
                                                <SelectItem key={estrato} value={estrato.toString()}>
                                                    {estrato}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="builtYear">Año de Construcción</Label>
                                    <Input
                                        id="builtYear"
                                        type="number"
                                        min={1900}
                                        max={new Date().getFullYear()}
                                        value={estate.built_year}
                                        onChange={(e) => setEstate(prev => ({ ...prev, built_year: Number(e.target.value) }))}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={estate.features.furnished}
                                        onCheckedChange={(checked: boolean) => setEstate(prev => ({ 
                                            ...prev, 
                                            features: { ...prev.features, furnished: checked } 
                                        }))}
                                    />
                                    <Label>Amueblado</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={estate.features.pets_allowed}
                                        onCheckedChange={(checked: boolean) => setEstate(prev => ({ 
                                            ...prev, 
                                            features: { ...prev.features, pets_allowed: checked } 
                                        }))}
                                    />
                                    <Label>Permite mascotas</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={estate.features.private_security}
                                        onCheckedChange={(checked: boolean) => setEstate(prev => ({ 
                                            ...prev, 
                                            features: { ...prev.features, private_security: checked } 
                                        }))}
                                    />
                                    <Label>Seguridad privada</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Amenidades</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                {mockAmenities.map((amenity) => (
                                    <div key={amenity.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`amenity-${amenity.id}`}
                                            checked={estate.amenities.some(a => a.id === amenity.id)}
                                            onCheckedChange={(checked: boolean) => {
                                                setEstate(prev => {
                                                    const exists = prev.amenities.some(a => a.id === amenity.id);
                                                    let newAmenities;
                                                    if (checked && !exists) {
                                                        newAmenities = [
                                                            ...prev.amenities,
                                                            { id: amenity.id, name: amenity.name, description: "", icon: "" }
                                                        ];
                                                    } else if (!checked && exists) {
                                                        newAmenities = prev.amenities.filter(a => a.id !== amenity.id);
                                                    } else {
                                                        newAmenities = prev.amenities;
                                                    }
                                                    return { ...prev, amenities: newAmenities };
                                                });
                                            }}
                                        />
                                        <Label htmlFor={`amenity-${amenity.id}`}>{amenity.name}</Label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                        <Button variant="outline" onClick={() => router.back()}>
                            Cancelar
                        </Button>
                    </div>
                </div>

                <div className="w-full md:w-2/5 gap-4 rounded-xl flex flex-col justify-center self-start">
                    <BigMultimediaFavorite
                        onImagesChange={handleImagesChange}
                        initialImages={estate.images.map(img => ({
                            id: img.url,
                            name: "Imagen",
                            src: img.url,
                            isMain: img.is_main
                        }))}
                    />
                    <div className="w-full h-[400px] mb-24">
                        {estate.location.latitude && estate.location.longitude && (
                            <MapComponent
                                key={`${estate.location.latitude}-${estate.location.longitude}`}
                                initialPosition={[estate.location.latitude, estate.location.longitude]}
                                onLocationSelect={handleLocationSelect}
                            />
                        )}
                    </div>
                    <BigDocuments
                        onDocumentSelect={(doc) => {
                            if (doc) {
                                setEstate(prev => ({
                                    ...prev,
                                    documents: [{
                                        id: 1,
                                        property_id: prev.id,
                                        created_at: "",
                                        name: doc.name,
                                        url: doc.url,
                                        description: ""
                                    }]
                                }));
                            } else {
                                setEstate(prev => ({ ...prev, documents: [] }));
                            }
                        }}
                        initialDocument={estate.documents.length > 0 ? {
                            id: String(estate.documents[0].id),
                            name: estate.documents[0].name,
                            url: estate.documents[0].url,
                            type: "application/pdf"
                        } : undefined}
                    />
                </div>
            </div>
        </div>
    );
}

