export function toCapitalCase(str: string) {
  if (!str || typeof str !== "string") return str;
  return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
}
