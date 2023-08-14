export const formatCoordinates = (coordinates: string | undefined) => {
  if (typeof coordinates !== "string") return coordinates;
  const formattedCoordinates = coordinates
    .split(" ")
    .slice(1, 3)
    .map((p) => p.replace(/\(/, "").slice(0, 7))
    .join(", ");

  return formattedCoordinates;
};
