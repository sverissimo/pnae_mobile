import { Produtor } from "../../produtor/types/Produtor";

export type RelatorioDTO = {
  id: string;
  produtor_id: string;
  tecnico_id: string;
  numero_relatorio: number;
  id_contrato: number;
  assunto: string;
  orientacao: string;
  picture_uri: string;
  assinatura_uri: string;
  id_at_atendimento?: string;
  produtor?: Produtor;
  outro_extensionista?: string;
  created_at: any;
  updated_at?: any;
};
