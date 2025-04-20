import { RelatorioModel } from "./RelatorioModel";

export type CreateRelatorioInputDTO = RelatorioModel & {
  temas_atendimento?: string[];
};
