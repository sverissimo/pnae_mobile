import { Repository } from "@domain/Repository";
import { Produtor } from "@features/produtor/types/Produtor";

export interface ProdutorRepository extends Repository<Produtor> {
  findByCPF: (cpf: string) => Promise<Produtor | undefined>;
}
