export function createQueryString<T extends Object>(entity: T) {
  const keys: (keyof T)[] = Object.keys(entity).filter(
    (key) =>
      entity[key as keyof T] !== null && entity[key as keyof T] !== undefined
  ) as (keyof T)[];

  const values = keys.map((key) => entity[key]);
  const placeholders = keys.map(() => "?").join(", ");
  const columns = keys.join(", ");
  const setClause = columns
    .split(",")
    .map((column) => `${column} = ?`)
    .join(", ");

  return { values, placeholders, columns, setClause };

  const queryString = `
        INSERT INTO entity (${columns})
        VALUES (${placeholders
          .replace(/produtor_id/g, "CAST(? AS BIGINT)")
          .replace(/tecnico_id/g, "CAST(? AS BIGINT)")})
      `;
}
