export function getUpdatedProps<T extends { id: string | number }>(
  entity: Partial<T>,
  entityList: T[]
) {
  const originalEntity = entityList.find((e) => e.id === entity.id);
  if (!originalEntity) {
    throw new Error(`Entity with id ${entity.id} not found in entityList`);
  }

  const updatedProps: Partial<T> = {};
  for (const key in entity) {
    if (
      entity.hasOwnProperty(key) &&
      entity[key] !== originalEntity[key] &&
      key !== "id"
    ) {
      updatedProps[key] = entity[key];
    }
  }

  return { ...updatedProps, id: entity.id } as T;
}
