import { Produtor } from "./Produtor";

export type Relatorio = {
  id?: number;
  produtorId?: string;
  tecnicoId?: string;
  numeroRelatorio?: number;
  assunto?: string;
  orientacao?: string;
  produtor?: Produtor;
  pictureURI?: string;
  assinaturaURI?: string;
  createdAt?: any;
  updatedAt?: any;
} | null;
