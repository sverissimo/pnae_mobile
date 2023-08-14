export const formatDate = (date: string) => {
  if (typeof date !== "string") return date;
  const formattedDate = date
    .slice(0, "yyyy-mm-dd".length)
    .split("-")
    .reverse()
    .join("/");

  return formattedDate;
};
