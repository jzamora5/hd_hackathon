import { PlaceInfo } from "@/models/placeInfo";
import Image from "next/image";
import Link from "next/link";
import { PHOTO_WIDTH, UNKNOWN_LOCATION } from ".";

const capitalize = (s: string) =>
  (s && String(s[0]).toUpperCase() + String(s).slice(1)) || "";

interface PlaceCardsProps {
  place: PlaceInfo;
}

export default function PlaceCard({ place }: PlaceCardsProps) {
  const formattedTypes = place?.details?.types?.map((type) => {
    return capitalize(type.replaceAll("_", " "));
  });

  return (
    <article>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <Link
          href={place.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border rounded-lg p-4 shadow-lg block"
        >
          <Image
            src={place.photoUrl ?? ""}
            alt={place.name}
            className="w-full h-40 object-cover"
            height={300}
            width={PHOTO_WIDTH}
          />
        </Link>
        <div className="p-4">
          {place.name !== UNKNOWN_LOCATION && (
            <h3 className="text-lg font-semibold">{place.name}</h3>
          )}
          <p className="text-gray-600">{place?.details?.editorialSummary}</p>
          {!!formattedTypes && (
            <p className="text-gray-600">{formattedTypes.join(", ")}</p>
          )}
          <p className="text-xs text-gray-500">{`Lat: ${place.coordinates.lat}, Lng: ${place.coordinates.lng}`}</p>
        </div>
      </div>
    </article>
  );
}
