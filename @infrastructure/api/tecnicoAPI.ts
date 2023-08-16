import { env } from "../../config";

export function getTecnicoData(id: number) {
  const url = `${env.BASE_URL}/tecnico/${id}`;

  return fetch(url).then((res) => res.json());
}
