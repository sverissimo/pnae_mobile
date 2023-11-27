import { Repository } from "@domain/Repository";
import { ProdutorModel } from "../ProdutorModel";

export interface ProdutorRepository extends Repository<ProdutorModel> {
  findByCPF?: (cpf: string) => Promise<ProdutorModel | undefined>;
  getAllProdutoresIds?: () => Promise<string[]>;
}
