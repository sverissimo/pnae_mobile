import { Repository } from "@domain/Repository";
import { RelatorioModel } from "@features/relatorio/types";

export interface RelatorioRepository extends Repository<RelatorioModel> {
  findByProdutorID(produtorId: string): Promise<RelatorioModel[]>;
  findAll(): Promise<RelatorioModel[]>;
  delete(id: string): Promise<void>;
}
