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
