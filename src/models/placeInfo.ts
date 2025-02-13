export type PlaceInfoLoadedType = "place" | "streetView" | "satellite";

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
  loadedType: PlaceInfoLoadedType;
  linkUrl: string;
  details?: PlaceInfoDetail;
}
