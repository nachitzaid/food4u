"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

interface MapPickerProps {
    onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
    restaurantLocation: { lat: number; lng: number };
}

export default function MapPicker({ onLocationSelect, restaurantLocation }: MapPickerProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const marker = useRef<mapboxgl.Marker | null>(null);
    const [selectedPos, setSelectedPos] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [restaurantLocation.lng, restaurantLocation.lat],
            zoom: 13,
        });

        // Add restaurant marker (fixed)
        new mapboxgl.Marker({ color: "#f97316" })
            .setLngLat([restaurantLocation.lng, restaurantLocation.lat])
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML("<h3>Food4U HQ</h3>"))
            .addTo(map.current);

        map.current.on("click", (e) => {
            const { lng, lat } = e.lngLat;
            setSelectedPos({ lat, lng });

            if (marker.current) {
                marker.current.setLngLat([lng, lat]);
            } else {
                marker.current = new mapboxgl.Marker({ draggable: true, color: "#111827" })
                    .setLngLat([lng, lat])
                    .addTo(map.current!);

                marker.current.on("dragend", () => {
                    const newLngLat = marker.current!.getLngLat();
                    setSelectedPos({ lat: newLngLat.lat, lng: newLngLat.lng });
                    onLocationSelect({
                        lat: newLngLat.lat,
                        lng: newLngLat.lng,
                        address: `Location: ${newLngLat.lat.toFixed(4)}, ${newLngLat.lng.toFixed(4)}`
                    });
                });
            }

            onLocationSelect({
                lat,
                lng,
                address: `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
            });
        });

        return () => {
            map.current?.remove();
        };
    }, [restaurantLocation, onLocationSelect]);

    return (
        <div className="relative w-full h-[400px] rounded-[40px] overflow-hidden border-4 border-white shadow-2xl">
            <div ref={mapContainer} className="w-full h-full" />

            <div className="absolute top-6 left-6 right-6 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-lg border border-white/20 text-sm font-bold text-gray-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                        <MapPin size={18} />
                    </div>
                    Click on the map to select your delivery spot
                </div>
            </div>
        </div>
    );
}
