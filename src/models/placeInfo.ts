export type PlaceInfoType = "place" | "streetView" | "satellite";

export type PlaceInfoDetail = {
  types?: string[];
  editorialSummary?: string;
};

export interface PlaceInfo {
  placeId?: string;
  name: string;
  photoUrl?: string;
  address?: string;
  coordinates: { lat?: number; lng?: number };
  type: PlaceInfoType;
  linkUrl: string;
  details?: PlaceInfoDetail;
}
