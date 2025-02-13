import { RideStats } from "@/models/rideStats";

interface RideStatsProps {
  rideStats: RideStats;
}

const safeValue = (value: number, fallback = 0) =>
  isNaN(value) ? fallback : value;

export default function RideStatsCard({ rideStats }: RideStatsProps) {
  return (
    <article className="bg-white p-4 rounded shadow-lg w-80 h-full">
      <h3 className="text-lg font-semibold mb-2">Ride Statistics</h3>
      <p>
        📏 <strong>Distance:</strong>{" "}
        {safeValue(rideStats.totalDistance).toFixed(2)} km
      </p>
      <p>
        ⏳ <strong>Total Duration:</strong>{" "}
        {(safeValue(rideStats.totalDuration) / 60).toFixed(1)} min
      </p>
      <p>
        🏃‍♂️ <strong>Moving Time:</strong>{" "}
        {(safeValue(rideStats.movingTime) / 60).toFixed(1)} min
      </p>
      <p>
        📈 <strong>Elevation Gain:</strong>{" "}
        {safeValue(rideStats.elevationGain).toFixed(1)} m
      </p>
      <p>
        📉 <strong>Elevation Loss:</strong>{" "}
        {safeValue(rideStats.elevationLoss).toFixed(1)} m
      </p>
      <p>
        ⚡ <strong>Avg Speed:</strong>{" "}
        {safeValue(rideStats.averageSpeed).toFixed(2)} km/h
      </p>
      <p>
        🚀 <strong>Moving Speed:</strong>{" "}
        {safeValue(rideStats.movingSpeed).toFixed(2)} km/h
      </p>
    </article>
  );
}
