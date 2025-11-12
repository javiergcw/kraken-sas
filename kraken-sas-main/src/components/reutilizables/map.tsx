"use client";

import { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L, { LatLngTuple, LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Input } from '@/components/reutilizables/input';
import { Button } from '@/components/reservation/button';
import { Search } from 'lucide-react';

// Coordenadas por defecto (Magdalena, Colombia)
const DEFAULT_COORDS = { lat: 11.2408, lng: -74.1990 };

// Crear un ícono personalizado
const customIcon = new L.Icon({
    iconUrl: '/images/ubi.png',
    iconSize: [20, 32], // tamaño del ícono
    iconAnchor: [16, 32], // punto del ícono que corresponderá a la ubicación del marcador
    popupAnchor: [0, -32] // punto desde donde se abrirán los popups
});

interface MapComponentProps {
    initialPosition?: [number, number];
    onLocationSelect: (lat: number, lng: number) => void;
}

function LocationMarker({ initialPosition, onLocationSelect }: { initialPosition: [number, number], onLocationSelect: (lat: number, lng: number) => void }) {
    const [position, setPosition] = useState<L.LatLng | null>(
        new L.LatLng(initialPosition[0], initialPosition[1])
    );
    
    // Actualizar la posición cuando cambien las props initialPosition
    useEffect(() => {
        setPosition(new L.LatLng(initialPosition[0], initialPosition[1]));
    }, [initialPosition]);
    
    const map = useMapEvents({
        click(e: LeafletMouseEvent) {
            setPosition(e.latlng);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    // Renderizar el marcador siempre, ya sea con la posición inicial o con la posición actualizada
    return position && (
        <Marker position={position} icon={customIcon} />
    );
}

export default function MapComponent({ initialPosition = [DEFAULT_COORDS.lat, DEFAULT_COORDS.lng], onLocationSelect }: MapComponentProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const mapRef = useRef<L.Map | null>(null);

    // Actualizar el centro del mapa cuando cambien las coordenadas iniciales
    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setView(initialPosition as LatLngTuple, 13);
        }
    }, [initialPosition]);

    const handleSearch = async () => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const newPosition: LatLngTuple = [parseFloat(lat), parseFloat(lon)];
                mapRef.current?.setView(newPosition, 13);
                onLocationSelect(parseFloat(lat), parseFloat(lon));
            }
        } catch (error) {
            console.error('Error searching location:', error);
        }
    };

    return (
        <div className="flex flex-col gap-4 relative z-[1] bg-white p-4 rounded-xl shadow-lg">
            <div className="flex gap-2">
                <Input
                    type="text"
                    placeholder="Buscar ubicación..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                    className="flex-1"
                />
                <Button onClick={handleSearch} variant="outline" className="shrink-0">
                    <Search className="h-4 w-4" />
                </Button>
            </div>
            <div className="h-[400px] w-full rounded-lg overflow-hidden relative border border-gray-200">
                <MapContainer
                    center={initialPosition as LatLngTuple}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    ref={mapRef}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker initialPosition={initialPosition} onLocationSelect={onLocationSelect} />
                </MapContainer>
            </div>
        </div>
    );
} 