import { Repository } from "@domain/Repository";
import { RelatorioModel } from "@features/relatorio/types";

export interface RelatorioRepository extends Repository<RelatorioModel> {
  createMany(relatorios: RelatorioModel[]): Promise<void>;
  findByProdutorID(produtorId: string): Promise<RelatorioModel[]>;
  findAll(): Promise<RelatorioModel[]>;
  updateMany(relatorios: Partial<RelatorioModel>[]): Promise<void>;
  delete(id: string): Promise<void>;
}
