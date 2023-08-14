import { Produtor } from "../../produtor/types/Produtor";

export type Propriedade = {
  id_pl_propriedade?: number;
  nome_propriedade?: string;
  area_total?: string;
  atividade_principal?: string;
  geo_ponto_texto: string;
  id_municipio?: number;
  produtor?: Produtor;
  atividade?: any;
} | null;
