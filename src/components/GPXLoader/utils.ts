import { GpxPoint } from "@/models/gpxPoint";
import { RideStats } from "@/models/rideStats";

const EARTH_RADIUS = 6371000; // Earth radius in meters

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export const calculateRideStats = (
  gpsData: { lat: number; lng: number; ele?: number; time?: string }[]
): RideStats | null => {
  if (gpsData.length < 2) return null; // Not enough data points

  let totalDistance = 0;
  let elevationGain = 0;
  let elevationLoss = 0;
  let movingTime = 0;
  let lastTime = 0;

  for (let i = 1; i < gpsData.length; i++) {
    const prev = gpsData[i - 1];
    const curr = gpsData[i];

    if (!prev.time || !curr.time) continue; // Skip if timestamps are missing

    // Compute distance using the Haversine formula
    const dLat = toRadians(curr.lat - prev.lat);
    const dLon = toRadians(curr.lng - prev.lng);
    const lat1 = toRadians(prev.lat);
    const lat2 = toRadians(curr.lat);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = EARTH_RADIUS * c;
    totalDistance += distance;

    // Elevation gain/loss
    if (prev.ele !== undefined && curr.ele !== undefined) {
      const elevationChange = curr.ele - prev.ele;
      if (elevationChange > 0) elevationGain += elevationChange;
      else elevationLoss -= elevationChange;
    }

    // Moving time calculation
    const prevTime = new Date(prev.time).getTime();
    const currTime = new Date(curr.time).getTime();
    const timeDiff = (currTime - prevTime) / 1000; // Time difference in seconds

    if (distance / timeDiff > 1) {
      // Only count moving time if speed > 1 m/s
      movingTime += timeDiff;
    }

    lastTime = currTime;
  }

  const totalDuration =
    (lastTime - new Date(gpsData[0].time!).getTime()) / 1000;
  const averageSpeed = totalDistance / totalDuration;
  const movingSpeed = totalDistance / movingTime;

  return {
    totalDistance: totalDistance / 1000, // Convert to km
    elevationGain,
    elevationLoss,
    totalDuration, // in seconds
    movingTime, // in seconds
    averageSpeed: averageSpeed * 3.6, // Convert m/s to km/h
    movingSpeed: movingSpeed * 3.6, // Convert m/s to km/h
  };
};

const extractPoints = (
  xml: Document,
  tag: string,
  type: GpxPoint["type"]
): GpxPoint[] => {
  return Array.from(xml.getElementsByTagName(tag)).map((point) => ({
    lat: parseFloat(point.getAttribute("lat") || "0"),
    lng: parseFloat(point.getAttribute("lon") || "0"),
    ele: point.getElementsByTagName("ele")[0]?.textContent
      ? parseFloat(point.getElementsByTagName("ele")[0].textContent!)
      : undefined,
    time: point.getElementsByTagName("time")[0]?.textContent || undefined,
    type,
  }));
};

export const parseGPX = (gpxString: string) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(gpxString, "application/xml");

  // Extract different GPX points in the order they appear
  const waypoints = extractPoints(xml, "wpt", "waypoint"); // Waypoints first
  const routepoints = extractPoints(xml, "rtept", "routepoint"); // Then routes
  const trackpoints = extractPoints(xml, "trkpt", "trackpoint"); // Finally tracks

  // Preserve natural GPX order: waypoints → routepoints → trackpoints
  return [...waypoints, ...routepoints, ...trackpoints];
};
