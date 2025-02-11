"use client";

import { useState } from "react";
import { calculateRideStats, parseGPX } from "./utils";
import MapDisplay from "../MapDisplay";
import { LoadScript } from "@react-google-maps/api";
import { GpxPoint } from "@/models/gpxPoint";

// For sample GPX files, visit https://github.com/gps-touring/sample-gpx or https://maps.harley-davidson.com/

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function GPXLoader() {
  const [gpsData, setGpsData] = useState<GpxPoint[]>([]);

  const [rideStats, setRideStats] = useState<null | ReturnType<
    typeof calculateRideStats
  >>(null);

  const [mapDisplayKey, setMapDisplayKey] = useState(0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const parsedData = parseGPX(e.target.result.toString());

        setMapDisplayKey((prev) => prev + 1);
        setGpsData(parsedData);
        setRideStats(calculateRideStats(parsedData));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept=".gpx"
        onChange={handleFileUpload}
        className="mb-4"
      />
      <div className="border p-4 mt-4">
        <h3 className="font-bold">Extracted GPS Points:</h3>
        <ul>
          {gpsData.slice(0, 5).map((point, index) => (
            <li key={index}>
              📍 Lat: {point.lat}, Lon: {point.lng}{" "}
              {point.time ? `, Time: ${point.time}` : ""}
            </li>
          ))}
        </ul>
      </div>

      {rideStats && (
        <div className="bg-white p-4 rounded shadow-lg w-80">
          <h3 className="text-lg font-semibold mb-2">Ride Statistics</h3>
          <p>
            📏 <strong>Distance:</strong> {rideStats.totalDistance.toFixed(2)}{" "}
            km
          </p>
          <p>
            ⏳ <strong>Total Duration:</strong>{" "}
            {(rideStats.totalDuration / 60).toFixed(1)} min
          </p>
          <p>
            🏃‍♂️ <strong>Moving Time:</strong>{" "}
            {(rideStats.movingTime / 60).toFixed(1)} min
          </p>
          <p>
            📈 <strong>Elevation Gain:</strong>{" "}
            {rideStats.elevationGain.toFixed(1)} m
          </p>
          <p>
            📉 <strong>Elevation Loss:</strong>{" "}
            {rideStats.elevationLoss.toFixed(1)} m
          </p>
          <p>
            ⚡ <strong>Avg Speed:</strong> {rideStats.averageSpeed.toFixed(2)}{" "}
            km/h
          </p>
          <p>
            🚀 <strong>Moving Speed:</strong> {rideStats.movingSpeed.toFixed(2)}{" "}
            km/h
          </p>
        </div>
      )}

      {gpsData.length > 0 && (
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY!}>
          <MapDisplay gpsData={gpsData} key={mapDisplayKey} />
        </LoadScript>
      )}
    </div>
  );
}
