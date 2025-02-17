"use client";

import { useState } from "react";
import { calculateRideStats, parseGPX } from "./utils";
import MapDisplay from "../MapDisplay";
import { Libraries, LoadScript } from "@react-google-maps/api";
import { GpxPoint } from "@/models/gpxPoint";
import PlaceCardsList from "../PlaceCardsList";
import { RideStats } from "@/models/rideStats";
import RideStatsCard from "../RideStatsCard";
import { PlaceInfo } from "@/models/placeInfo";
import { StoryDisplay } from "../StoryDisplay";

// For sample GPX files, visit https://github.com/gps-touring/sample-gpx or https://maps.harley-davidson.com/

const GOOGLE_MAPS_API_LOADED_LIBRARIES: Libraries = ["places"];

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function GPXLoader() {
  const [gpsData, setGpsData] = useState<GpxPoint[]>([]);
  const [rideStats, setRideStats] = useState<RideStats | null>(null);
  const [places, setPlaces] = useState<PlaceInfo[]>([]);
  const [mapDisplayKey, setMapDisplayKey] = useState(0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const parsedData = parseGPX(e.target.result.toString());

        setMapDisplayKey((prev) => prev + 1);
        setPlaces([]);
        setGpsData(parsedData);
        setRideStats(calculateRideStats(parsedData));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="m-4">
      <label htmlFor="upload-button">
        <div
          style={{ marginRight: 10 }}
          className="mb-4 border-2 border-primary-2 bg-primary-1 text-white cursor-pointer p-2 rounded font-medium w-36"
          role="button"
        >
          Upload GPX File
        </div>
      </label>

      <input
        type="file"
        accept=".gpx"
        onChange={handleFileUpload}
        id="upload-button"
        className="hidden"
      />

      <section className="flex items-start w-[calc(100vw-2rem)] h-[400px]">
        {rideStats && <RideStatsCard rideStats={rideStats} />}

        <div className="grow">
          {gpsData.length > 0 && (
            <LoadScript
              googleMapsApiKey={GOOGLE_MAPS_API_KEY!}
              libraries={GOOGLE_MAPS_API_LOADED_LIBRARIES}
            >
              <MapDisplay gpsData={gpsData} key={`${mapDisplayKey}-map`} />
            </LoadScript>
          )}
        </div>
      </section>

      <section className="mt-4 w-full flex">
        {gpsData.length > 0 && (
          <LoadScript
            googleMapsApiKey={GOOGLE_MAPS_API_KEY!}
            libraries={GOOGLE_MAPS_API_LOADED_LIBRARIES}
          >
            <PlaceCardsList
              gpsData={gpsData}
              places={places}
              setPlaces={setPlaces}
              key={`${mapDisplayKey}-places`}
            />
          </LoadScript>
        )}

        {gpsData.length > 0 && !!rideStats && !!places.length && (
          <StoryDisplay places={places} rideStats={rideStats} />
        )}
      </section>
    </div>
  );
}
