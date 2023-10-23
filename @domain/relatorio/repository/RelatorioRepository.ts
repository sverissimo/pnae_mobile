import { Repository } from "@domain/Repository";
import { RelatorioModel } from "@features/relatorio/types";

export interface RelatorioRepository extends Repository<RelatorioModel> {
  create(relatorio: RelatorioModel): Promise<void>;
  findById?(id: unknown): Promise<RelatorioModel | null>;
  findByProdutorID(produtorId: string): Promise<RelatorioModel[]>;
  findAll(): Promise<RelatorioModel[]>;
  update(relatorio: Partial<RelatorioModel>): Promise<void>;
  delete(id: string): Promise<void>;
}