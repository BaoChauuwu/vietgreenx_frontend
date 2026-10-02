import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix missing marker icons in leaflet with webpack/nextjs
const icon = L.icon({
  iconUrl: "/images/leaflet/marker-icon.png",
  iconRetinaUrl: "/images/leaflet/marker-icon-2x.png",
  shadowUrl: "/images/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
  className?: string;
}

function LocationMarker({
  position,
  setPosition,
}: {
  position: L.LatLng | null;
  setPosition: (p: L.LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : <Marker position={position} icon={icon}></Marker>;
}

function MapUpdater({ position }: { position: L.LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  return null;
}

export default function Map({ latitude, longitude, onChange, className }: MapProps) {
  const defaultPosition: [number, number] = [16.04963, 108.22479]; // Da Nang default
  const [position, setPosition] = useState<L.LatLng | null>(
    latitude && longitude ? L.latLng(latitude, longitude) : null,
  );

  const handleSetPosition = (latlng: L.LatLng) => {
    setPosition(latlng);
    onChange(latlng.lat, latlng.lng);
  };

  useEffect(() => {
    if (
      latitude &&
      longitude &&
      (!position || position.lat !== latitude || position.lng !== longitude)
    ) {
      setPosition(L.latLng(latitude, longitude));
    }
  }, [latitude, longitude, position]);

  return (
    <div
      className={`relative h-[300px] w-full overflow-hidden rounded-md border ${className || ""}`}
    >
      <MapContainer
        center={position || defaultPosition}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={handleSetPosition} />
        <MapUpdater position={position} />
      </MapContainer>
    </div>
  );
}
