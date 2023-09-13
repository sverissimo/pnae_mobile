export function getUpdatedProps<T extends { id: string | number }>(
  originalEntity: T,
  updatedEntity: Partial<T>
): Partial<T> {
  if (!originalEntity) {
    return updatedEntity;
  }

  const updatedProps: Partial<T> = {};

  for (const key in updatedEntity) {
    if (key !== "id" && updatedEntity[key] !== originalEntity[key as keyof T]) {
      updatedProps[key as keyof T] = updatedEntity[key];
    }
  }

  return { id: updatedEntity.id, ...updatedProps };
}

// export function getUpdatedProps<T extends { id: string | number }>(
//   entity: Partial<T>,
//   entityList: T[]
// ) {
//   const originalEntity = entityList.find((e) => e.id === entity.id);
//   if (!originalEntity) {
//     throw new Error(`Entity with id ${entity.id} not found in entityList`);
//   }

//   const updatedProps: Partial<T> = {};
//   for (const key in entity) {
//     if (
//       entity.hasOwnProperty(key) &&
//       entity[key] !== originalEntity[key] &&
//       key !== "id"
//     ) {
//       updatedProps[key] = entity[key];
//     }
//   }

//   return { ...updatedProps, id: entity.id } as T;
// }
