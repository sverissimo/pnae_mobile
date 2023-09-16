import { LocationObject } from "@shared/types";

export function locationObjToText(
  locationObj: LocationObject | null | undefined
) {
  if (
    !locationObj ||
    !locationObj.coords ||
    typeof locationObj.coords.longitude !== "number" ||
    typeof locationObj.coords.latitude !== "number"
  ) {
    return "";
  }
  return `${locationObj.coords.longitude},${locationObj.coords.latitude}`;
}
