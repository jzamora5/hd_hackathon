import { GpxPoint } from "@/models/gpxPoint";

export function selectEvenlySpacedPoints(
  points: GpxPoint[],
  count: number
): GpxPoint[] {
  if (points.length <= count) return points;

  const selectedPoints: GpxPoint[] = [points[0]];
  const totalDistance = haversineDistance(points[0], points[points.length - 1]);
  const segmentLength = totalDistance / (count - 1);

  let lastIndex = 0;
  for (let i = 1; i < count - 1; i++) {
    let bestIndex = lastIndex + 1;
    let bestDistance = 0;

    for (let j = lastIndex + 1; j < points.length - 1; j++) {
      const distance = haversineDistance(points[lastIndex], points[j]);
      if (
        Math.abs(distance - segmentLength) <
        Math.abs(bestDistance - segmentLength)
      ) {
        bestIndex = j;
        bestDistance = distance;
      }
    }

    selectedPoints.push(points[bestIndex]);
    lastIndex = bestIndex;
  }

  selectedPoints.push(points[points.length - 1]);
  return selectedPoints;
}

// Helper function to calculate the Haversine distance between two points
function haversineDistance(point1: GpxPoint, point2: GpxPoint): number {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km

  const lat1 = toRadians(point1.lat);
  const lat2 = toRadians(point2.lat);
  const dLat = lat2 - lat1;
  const dLng = toRadians(point2.lng - point1.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
