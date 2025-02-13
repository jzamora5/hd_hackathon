"use client";

import { GpxPoint } from "@/models/gpxPoint";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { useState } from "react";

interface MapDisplayProps {
  gpsData: GpxPoint[];
}

const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // Default: San Francisco

const calculateBounds = (gpsData: MapDisplayProps["gpsData"]) => {
  if (!gpsData.length) return null;

  const latLngBounds = new window.google.maps.LatLngBounds();
  gpsData.forEach((point) =>
    latLngBounds.extend({ lat: point.lat, lng: point.lng })
  );
  return latLngBounds;
};

export default function MapDisplay({ gpsData }: MapDisplayProps) {
  const [selectedPoint, setSelectedPoint] = useState<GpxPoint | null>(null);

  return (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "400px",
      }}
      zoom={12} // Initial zoom (gets overridden by `fitBounds`)
      center={gpsData.length ? gpsData[0] : defaultCenter}
      onLoad={(map) => {
        const bounds = calculateBounds(gpsData);

        if (bounds) {
          map.fitBounds(calculateBounds(gpsData)!);
        }
      }}
    >
      {gpsData.map((point, index) => (
        <Marker
          key={index}
          position={{ lat: point.lat, lng: point.lng }}
          onClick={() => setSelectedPoint(point)}
        />
      ))}

      {selectedPoint && (
        <InfoWindow
          position={{ lat: selectedPoint.lat, lng: selectedPoint.lng }}
          onCloseClick={() => setSelectedPoint(null)}
        >
          <div>
            <h3>Point Info</h3>
            <p>
              <strong>Latitude:</strong> {selectedPoint.lat}
            </p>
            <p>
              <strong>Longitude:</strong> {selectedPoint.lng}
            </p>
            {selectedPoint.time && (
              <p>
                <strong>Time:</strong> {selectedPoint.time}
              </p>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
