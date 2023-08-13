import { Produtor } from "../../produtor/types/Produtor";

export type Relatorio = {
  id?: number;
  numeroRelatorio?: number;
  nr_relatorio?: number;
  assunto?: string;
  orientacao?: string;
  produtor?: Produtor;
  produtorId?: string;
  tecnicoId?: string;
  files?: any;
  createdAt?: any;
} | null;
