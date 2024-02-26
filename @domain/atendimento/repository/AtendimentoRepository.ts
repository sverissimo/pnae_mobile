import { AtendimentoModel } from "../entity/Atendimento";

export interface AtendimentoRepository {
  create(atendimento: AtendimentoModel): Promise<string | void>;
  findByRelatorioId(id_relatorio: string): Promise<AtendimentoModel | null>;
  findAll?(): Promise<AtendimentoModel[]>;
  delete: (id_relatorio: string) => Promise<void>;
}
