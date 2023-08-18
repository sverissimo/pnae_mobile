import { Produtor } from "../../../types/Produtor";

export type RelatorioDTO = {
  id?: number;
  produtor_id?: string | BigInt;
  tecnico_id?: string | BigInt;
  numero_relatorio?: number;
  assunto?: string;
  orientacao?: string;
  produtor?: Produtor;
  picture_uri: string;
  assinatura_uri?: string;
  created_at?: any;
  updated_at?: any;
  [key: string]: any;
};
