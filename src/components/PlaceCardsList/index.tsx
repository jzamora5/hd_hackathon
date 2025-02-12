import { GpxPoint } from "@/models/gpxPoint";
import { PlaceInfo, PlaceInfoDetail } from "@/models/placeInfo";
import { useEffect, useRef, useState } from "react";
import PlaceCard from "./PlaceCard";
import { selectEvenlySpacedPoints } from "./utils";

export const UNKNOWN_LOCATION = "Unknown location";
export const NUMBER_OF_POINTS = 6;
export const PLACE_RADIUS_SEARCH = 200;
export const PHOTO_WIDTH = 800;

interface PlaceCardsListProps {
  gpsData: GpxPoint[];
}

const checkIfHasStreetView = async (url: string) => {
  try {
    const response = await fetch(url);
    const body = await response.json();

    return body.status === "ZERO_RESULTS" ? false : true;
  } catch {
    return false;
  }
};

const fetchPlaceDetails = (
  service: google.maps.places.PlacesService,
  placeId: string
): Promise<PlaceInfoDetail | undefined> => {
  return new Promise((resolve) => {
    service.getDetails(
      {
        placeId,
        fields: ["editorial_summary", "types"],
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          const placeDetailTyped = place as google.maps.places.Place;

          resolve({
            editorialSummary: placeDetailTyped?.editorialSummary ?? "",
            types: place?.types,
          });
        } else {
          resolve(undefined);
        }
      }
    );
  });
};

export default function PlaceCardsList({ gpsData }: PlaceCardsListProps) {
  const [places, setPlaces] = useState<PlaceInfo[]>([]);
  const loadingData = useRef(false);

  useEffect(() => {
    if (gpsData.length > 0 && !loadingData.current) {
      fetchAllPlaceInfo(gpsData);
    }
  }, [gpsData]);

  const fetchAllPlaceInfo = async (points: GpxPoint[]) => {
    loadingData.current = true;
    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );
    const placeList: PlaceInfo[] = [];

    const slicedPoints = selectEvenlySpacedPoints(points, NUMBER_OF_POINTS);

    for (const point of slicedPoints) {
      const request = {
        location: new google.maps.LatLng(point.lat, point.lng),
        radius: PLACE_RADIUS_SEARCH,
        type: "point_of_interest",
      };

      const results = await new Promise<google.maps.places.PlaceResult[]>(
        (resolve) => {
          service.nearbySearch(request, (results, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              results?.length
            ) {
              resolve(results);
            } else {
              resolve([]); // If no place found, resolve with an empty array
            }
          });
        }
      );

      const place = results?.[0];

      if (place && place?.place_id && place?.name) {
        const details = await fetchPlaceDetails(service, place.place_id);

        placeList.push({
          placeId: place.place_id,
          name: place.name as string,
          address: place.vicinity || "No address available",
          photoUrl:
            place.photos?.[0]?.getUrl({ maxWidth: PHOTO_WIDTH }) ||
            "/placeholder.jpg",
          coordinates: {
            lat: place.geometry?.location?.lat?.(),
            lng: place.geometry?.location?.lng?.(),
          },
          type: "place",
          linkUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
          details,
        });
      } else {
        // No place found, generate Street View / Satellite image
        const streetViewImage = `https://maps.googleapis.com/maps/api/streetview?size=1000x1000&location=${point.lat},${point.lng}&heading=151.78&pitch=0&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
        const isStreetViewValid = await checkIfHasStreetView(
          `https://maps.googleapis.com/maps/api/streetview/metadata?location=${point.lat},${point.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const satelliteImage = `https://maps.googleapis.com/maps/api/staticmap?center=${point.lat},${point.lng}&zoom=14&size=400x400&markers=color:red|${point.lat},${point.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

        const streetViewLinkUrl = `http://maps.google.com/maps?q=&layer=c&cbll=${point.lat},${point.lng}&cbp=`;
        const satelliteLinkUrl = `https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`;

        placeList.push({
          name: UNKNOWN_LOCATION,
          address: "No place found",
          photoUrl: isStreetViewValid ? streetViewImage : satelliteImage,
          coordinates: { lat: point.lat, lng: point.lng },
          type: isStreetViewValid ? "streetView" : "satellite",
          linkUrl: isStreetViewValid ? streetViewLinkUrl : satelliteLinkUrl,
        });
      }
    }
    setPlaces([...placeList]);
    loadingData.current = false;
  };

  return (
    <section>
      {places.map((place, idx) => {
        return <PlaceCard key={idx} place={place} />;
      })}
    </section>
  );
}
