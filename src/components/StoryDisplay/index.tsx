import { PlaceInfo } from "@/models/placeInfo";
import { RideStats } from "@/models/rideStats";
import { useCallback, useEffect, useState } from "react";
import Loader from "../Loader";

export interface StoryDisplayProps {
  places: PlaceInfo[];
  rideStats: RideStats;
}

export function StoryDisplay({ places, rideStats }: StoryDisplayProps) {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStoryGeneration = useCallback(async () => {
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ places, rideStats }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.reply);
      } else {
        setResponse(`Error: ${data.error}`);
      }
    } catch (error) {
      setResponse(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  }, [places, rideStats]);

  useEffect(() => {
    console.log("Story Fetch!!!");

    if (places.length > 0 && rideStats) {
      handleStoryGeneration();
    }
  }, [places, rideStats, handleStoryGeneration]);

  return (
    <div className="border border-gray-500 w-[65%] mx-auto shadow-lg rounded">
      <header className="bg-secondary-1 flex justify-center text-white my-2">
        <h2 className="font-semibold h-10 flex items-center">My Story</h2>
      </header>

      <div className="grow mb-2">{loading && <Loader />}</div>

      {response && <p className="p-4 text-justify">{response}</p>}
    </div>
  );
}
