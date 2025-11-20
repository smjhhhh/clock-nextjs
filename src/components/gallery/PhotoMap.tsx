'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Photo } from '@/lib/supabase'
import L from 'leaflet'
import { useEffect } from 'react'

// Fix Leaflet default icon issue in Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png'
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png'
const shadowUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png'

const customIcon = new L.Icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})

export default function PhotoMap({ photos }: { photos: Photo[] }) {
    // Filter photos that have location data
    const locatedPhotos = photos.filter(p => p.latitude && p.longitude)

    if (locatedPhotos.length === 0) {
        return (
            <div className="h-[400px] w-full bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-gray-500">
                No photos with location data found.
            </div>
        )
    }

    // Calculate center
    const centerLat = locatedPhotos.reduce((sum, p) => sum + (p.latitude || 0), 0) / locatedPhotos.length
    const centerLng = locatedPhotos.reduce((sum, p) => sum + (p.longitude || 0), 0) / locatedPhotos.length

    return (
        <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg z-0 relative">
            <MapContainer
                center={[centerLat, centerLng]}
                zoom={3}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locatedPhotos.map(photo => (
                    <Marker
                        key={photo.id}
                        position={[photo.latitude!, photo.longitude!]}
                        icon={customIcon}
                    >
                        <Popup>
                            <div className="w-48">
                                <img
                                    src={photo.image_url}
                                    alt={photo.title || 'Photo'}
                                    className="w-full h-32 object-cover rounded mb-2"
                                />
                                <p className="font-bold text-sm">{photo.title}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(photo.taken_at || photo.created_at).toLocaleDateString()}
                                </p>
                                {photo.location_name && (
                                    <p className="text-xs text-blue-500">{photo.location_name}</p>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}
