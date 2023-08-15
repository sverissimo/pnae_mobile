export function truncateString(
  string: string | undefined,
  maxLength: number = 25
) {
  if (typeof string !== "string") return string;

  if (string.length > maxLength) {
    return string.substring(0, maxLength - 3) + "...";
  }
  return string;
}
