export interface GpxPoint {
  lat: number;
  lng: number;
  ele?: number;
  time?: string;
  type: "trackpoint" | "waypoint" | "routepoint";
}
