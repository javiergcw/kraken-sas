"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/reservation/card";
import { Input } from "@/components/reutilizables/input";
import { Label } from "@/components/reutilizables/label";
import { Textarea } from "@/components/reutilizables/text-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/reutilizables/seletc";
import { Switch } from "@/components/reutilizables/switch";
import dynamic from "next/dynamic";
import { IconBack } from "@/components/button/icon_back";
import { Checkbox } from "@/components/reutilizables/checkbox";
import BigMultimediaFavorite from "@/components/reutilizables/big-multimedia-favorite";

// Importar el mapa de forma dinámica para evitar problemas de SSR
const MapComponent = dynamic(() => import("@/components/reutilizables/map"), {
    ssr: false,
    loading: () => <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-lg"></div>
});

interface Image {
    id: string;
    name: string;
    src: string;
    isMain?: boolean;
    position?: number;
}

type Estate = {
    title: string;
    description: string;
    propertyTypeId: number;
    operationTypeId: number;
    status: boolean;
    availability: "available" | "reserved" | "sold" | "rented";
    price: number;
    rentPrice: number;
    deposit: number;
    adminFee: number;
    address: string;
    countryId: number;
    departmentId: number;
    cityId: number;
    neighborhoodId: number;
    zipCode: string;
    latitude: number;
    longitude: number;
    bedrooms: number;
    bathrooms: number;
    garages: number;
    floors: number;
    furnished: boolean;
    petsAllowed: boolean;
    privateSecurity: boolean;
    area: number;
    areaConstruida: number;
    estrato: number;
    builtYear: number;
    images: { url: string; is_main: boolean; position: number }[];
    documents: { 
        name: string; 
        url: string; 
        description?: string;
        file: File | null;
    }[];
    amenityIds: number[];
};

// Coordenadas de Santa Marta, Magdalena
const MAGDALENA_COORDS = {
    lat: 11.2404,
    lng: -74.2031
};

export default function CreateEstatePage() {
    const [mapCoordinates, setMapCoordinates] = useState({
        latitude: MAGDALENA_COORDS.lat,
        longitude: MAGDALENA_COORDS.lng,
    });

    const [estate, setEstate] = useState<Estate>({
        title: "",
        description: "",
        propertyTypeId: 1,
        operationTypeId: 1,
        status: true,
        availability: "available",
        price: 0,
        rentPrice: 0,
        deposit: 0,
        adminFee: 0,
        address: "",
        countryId: 1,
        departmentId: 0,
        cityId: 0,
        neighborhoodId: 0,
        zipCode: "",
        latitude: MAGDALENA_COORDS.lat,
        longitude: MAGDALENA_COORDS.lng,
        bedrooms: 0,
        bathrooms: 0,
        garages: 0,
        floors: 0,
        furnished: false,
        petsAllowed: false,
        privateSecurity: false,
        area: 0,
        areaConstruida: 0,
        estrato: 1,
        builtYear: new Date().getFullYear(),
        images: [],
        documents: [],
        amenityIds: []
    });

    // Datos mock para el frontend
    const [departments] = useState([
        { id: 1, name: "Atlántico", department_id: 1 },
        { id: 2, name: "Magdalena", department_id: 2 },
        { id: 3, name: "Bolívar", department_id: 3 },
    ]);

    const [cities] = useState([
        { id: 1, name: "Barranquilla", department_id: 1, city_id: 1 },
        { id: 2, name: "Cartagena", department_id: 2, city_id: 2 },
        { id: 3, name: "Santa Marta", department_id: 2, city_id: 3 },
    ]);

    const [neighborhoods] = useState([
        { id: 1, name: "Centro", city_id: 1 },
        { id: 2, name: "Bocagrande", city_id: 2 },
        { id: 3, name: "Rodadero", city_id: 3 },
    ]);

    const [filteredDepartments, setFilteredDepartments] = useState<any[]>([]);
    const [filteredCities, setFilteredCities] = useState<any[]>([]);
    const [filteredNeighborhoods, setFilteredNeighborhoods] = useState<any[]>([]);

    // Datos mock para amenidades
    const [amenities] = useState([
        { id: 1, name: "Piscina" },
        { id: 2, name: "Gimnasio" },
        { id: 3, name: "Ascensor" },
        { id: 4, name: "Parqueadero" },
        { id: 5, name: "Seguridad 24/7" },
        { id: 6, name: "Zona BBQ" },
    ]);

    // Datos mock para tipos de operación
    const [operationTypes] = useState([
        { id: 1, name: "Venta" },
        { id: 2, name: "Arriendo" },
        { id: 3, name: "Venta/Arriendo" },
    ]);

    // Datos mock para tipos de propiedad
    const [propertyTypes] = useState([
        { id: 1, name: "Apartamento" },
        { id: 2, name: "Casa" },
        { id: 3, name: "Local Comercial" },
        { id: 4, name: "Oficina" },
        { id: 5, name: "Terreno" },
    ]);

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMapReady(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Efecto para filtrar departamentos
    useEffect(() => {
        if (estate.countryId) {
            setFilteredDepartments(departments);
        } else {
            setFilteredDepartments([]);
        }
    }, [estate.countryId, departments]);

    // Efecto para filtrar ciudades
    useEffect(() => {
        if (estate.departmentId) {
            const departmentCities = cities.filter(
                city => city.department_id === estate.departmentId
            );
            setFilteredCities(departmentCities);
            setEstate(prev => ({ ...prev, cityId: 0, neighborhoodId: 0 }));
        } else {
            setFilteredCities([]);
        }
    }, [estate.departmentId, cities]);

    // Efecto para filtrar barrios
    useEffect(() => {
        if (estate.cityId) {
            const cityNeighborhoods = neighborhoods.filter(
                neighborhood => neighborhood.city_id === estate.cityId
            );
            setFilteredNeighborhoods(cityNeighborhoods);
            setEstate(prev => ({ ...prev, neighborhoodId: 0 }));
        } else {
            setFilteredNeighborhoods([]);
        }
    }, [estate.cityId, neighborhoods]);

    const handleImagesChange = (selectedImages: { url: string; is_main: boolean; position: number }[]) => {
        setEstate(prevEstate => {
            const newEstate = { ...prevEstate };
            newEstate.images = selectedImages.map((img, index) => ({
                ...img,
                position: index
            }));
            return newEstate;
        });
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        setMapCoordinates({ latitude: lat, longitude: lng });
        setEstate(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng
        }));
    };

    return (
        <div>
            <div className="flex items-center mb-6">
                <IconBack className="mr-2" />
                <h1 className="text-2xl font-bold">Crear Inmueble</h1>
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
                                        value={estate.propertyTypeId.toString()}
                                        onValueChange={(value) => setEstate(prev => ({ ...prev, propertyTypeId: Number(value) }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona tipo de propiedad" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {propertyTypes.map((pt) => (
                                                <SelectItem key={pt.id} value={pt.id.toString()}>{pt.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Tipo de Operación *</Label>
                                    <Select
                                        value={estate.operationTypeId.toString()}
                                        onValueChange={(value) => setEstate(prev => ({ ...prev, operationTypeId: Number(value) }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona tipo de operación" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {operationTypes.map((op) => (
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
                                        onValueChange={(value) => setEstate(prev => ({ ...prev, availability: value as Estate['availability'] }))}
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
                                            value={estate.rentPrice}
                                            onChange={(e) => setEstate(prev => ({ ...prev, rentPrice: Number(e.target.value) }))}
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
                                            value={estate.adminFee}
                                            onChange={(e) => setEstate(prev => ({ ...prev, adminFee: Number(e.target.value) }))}
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
                                    value={estate.address}
                                    onChange={(e) => setEstate(prev => ({ ...prev, address: e.target.value }))}
                                    placeholder="Ingresa la dirección completa"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>País *</Label>
                                    <Select
                                        value={estate.countryId.toString()}
                                        onValueChange={(value) => setEstate(prev => ({ ...prev, countryId: Number(value) }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un país" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Colombia</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Departamento *</Label>
                                    <Select
                                        value={estate.departmentId.toString()}
                                        onValueChange={(value) => setEstate(prev => ({ ...prev, departmentId: Number(value) }))}
                                        disabled={!estate.countryId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un departamento" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredDepartments.map((department) => (
                                                <SelectItem key={department.id} value={department.id.toString()}>
                                                    {department.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Ciudad *</Label>
                                    <Select
                                        value={estate.cityId.toString()}
                                        onValueChange={(value) => setEstate(prev => ({ ...prev, cityId: Number(value) }))}
                                        disabled={!estate.departmentId}
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

                                <div className="space-y-2">
                                    <Label>Barrio</Label>
                                    <Select
                                        value={estate.neighborhoodId.toString()}
                                        onValueChange={(value) => setEstate(prev => ({ ...prev, neighborhoodId: Number(value) }))}
                                        disabled={!estate.cityId}
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
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="zipCode">Código Postal</Label>
                                <Input
                                    id="zipCode"
                                    value={estate.zipCode}
                                    onChange={(e) => setEstate(prev => ({ ...prev, zipCode: e.target.value }))}
                                    placeholder="Ingresa el código postal"
                                />
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
                                        value={estate.bedrooms}
                                        onChange={(e) => setEstate(prev => ({ ...prev, bedrooms: Number(e.target.value) }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bathrooms">Baños</Label>
                                    <Input
                                        id="bathrooms"
                                        type="number"
                                        value={estate.bathrooms}
                                        onChange={(e) => setEstate(prev => ({ ...prev, bathrooms: Number(e.target.value) }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="garages">Garajes</Label>
                                    <Input
                                        id="garages"
                                        type="number"
                                        value={estate.garages}
                                        onChange={(e) => setEstate(prev => ({ ...prev, garages: Number(e.target.value) }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="floors">Pisos</Label>
                                    <Input
                                        id="floors"
                                        type="number"
                                        value={estate.floors}
                                        onChange={(e) => setEstate(prev => ({ ...prev, floors: Number(e.target.value) }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="area">Área Total (m²)</Label>
                                    <Input
                                        id="area"
                                        type="number"
                                        value={estate.area}
                                        onChange={(e) => setEstate(prev => ({ ...prev, area: Number(e.target.value) }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="areaConstruida">Área Construida (m²)</Label>
                                    <Input
                                        id="areaConstruida"
                                        type="number"
                                        value={estate.areaConstruida}
                                        onChange={(e) => setEstate(prev => ({ ...prev, areaConstruida: Number(e.target.value) }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="estrato">Estrato</Label>
                                    <Select
                                        value={estate.estrato.toString()}
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
                                        value={estate.builtYear}
                                        onChange={(e) => setEstate(prev => ({ ...prev, builtYear: Number(e.target.value) }))}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={estate.furnished}
                                        onCheckedChange={(checked: boolean) => setEstate(prev => ({ ...prev, furnished: checked }))}
                                    />
                                    <Label>Amueblado</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={estate.petsAllowed}
                                        onCheckedChange={(checked: boolean) => setEstate(prev => ({ ...prev, petsAllowed: checked }))}
                                    />
                                    <Label>Permite mascotas</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={estate.privateSecurity}
                                        onCheckedChange={(checked: boolean) => setEstate(prev => ({ ...prev, privateSecurity: checked }))}
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
                                {amenities.map((amenity) => (
                                    <div key={amenity.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`amenity-${amenity.id}`}
                                            checked={estate.amenityIds.includes(amenity.id)}
                                            onCheckedChange={(checked) => setEstate(prev => ({
                                                ...prev,
                                                amenityIds: checked
                                                    ? [...prev.amenityIds, amenity.id]
                                                    : prev.amenityIds.filter(id => id !== amenity.id)
                                            }))}
                                        />
                                        <Label htmlFor={`amenity-${amenity.id}`}>{amenity.name}</Label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="w-full md:w-2/5 gap-4 rounded-xl flex flex-col justify-center self-start">
                    <BigMultimediaFavorite
                        onImagesChange={handleImagesChange}
                        initialImages={estate.images.map(img => ({
                            id: Math.random().toString(36).substring(2),
                            name: "Imagen",
                            src: img.url,
                            isMain: img.is_main
                        }))}
                    />
                    <div ref={mapContainerRef} className="w-full h-[400px] mb-24">
                        {mapReady && (
                            <MapComponent
                                key={`${mapCoordinates.latitude}-${mapCoordinates.longitude}`}
                                initialPosition={[mapCoordinates.latitude, mapCoordinates.longitude]}
                                onLocationSelect={handleLocationSelect}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}