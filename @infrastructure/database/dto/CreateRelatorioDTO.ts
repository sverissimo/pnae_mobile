import { Produtor } from "../../../features/produtor/types/Produtor";

export type CreateRelatorioDTO = {
  produtor_id: string | BigInt;
  tecnico_id: string | BigInt;
  numero_relatorio: number;
  assunto: string;
  orientacao: string;
  produtor?: Produtor;
  picture_uri: string;
  assinatura_uri: string;
  outro_extensionista?: string;
  read_only?: boolean;
  coordenadas?: string;
};
