import { parseURI } from "./parseURI";

type Comparator<T> = (a: T, b: T) => boolean;

export function getUpdatedProps<T extends { id: string | number }>(
  originalEntity: T,
  updatedEntity: Partial<T>,
  specialComparators?: Record<string, Comparator<any>>
): Partial<T> {
  if (!originalEntity) {
    return updatedEntity;
  }

  const updatedProps: Partial<T> = {};

  const handleUpdate = (key: keyof T, comparator: Comparator<any>) => {
    if (comparator(updatedEntity[key], originalEntity[key])) {
      delete updatedProps[key];
    } else {
      updatedProps[key] = updatedEntity[key];
    }
  };

  for (const key in updatedEntity) {
    if (key !== "id") {
      if (specialComparators && specialComparators[key]) {
        handleUpdate(key as keyof T, specialComparators[key]);
      } else if (updatedEntity[key] !== originalEntity[key as keyof T]) {
        updatedProps[key as keyof T] = updatedEntity[key];
      }
    }
  }

  return { id: updatedEntity.id, ...updatedProps };
}

// export function getUpdatedProps<T extends { id: string | number }>(
//   originalEntity: T,
//   updatedEntity: Partial<T>
// ): Partial<T> {
//   if (!originalEntity) {
//     return updatedEntity;
//   }

//   const updatedProps: Partial<T> = {};

//   for (const key in updatedEntity) {
//     if (key !== "id" && updatedEntity[key] !== originalEntity[key as keyof T]) {
//       updatedProps[key as keyof T] = updatedEntity[key];
//     }
//   }

//   return { id: updatedEntity.id, ...updatedProps };
// }
