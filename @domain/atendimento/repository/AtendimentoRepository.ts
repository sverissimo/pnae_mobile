import { AtendimentoModel } from "../entity/Atendimento";
import { Repository } from "@domain/Repository";
export interface AtendimentoRepository extends Repository<AtendimentoModel> {
  create(atendimento: AtendimentoModel): Promise<void>;
  findByRelatorioId(id_relatorio: string): Promise<AtendimentoModel | null>;
  delete: (id_relatorio: string) => Promise<void>;
}
