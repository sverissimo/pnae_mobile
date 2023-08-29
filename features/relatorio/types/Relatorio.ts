import { Produtor } from "../../../types/Produtor";

export type Relatorio = {
  id: string;
  produtorId: string;
  tecnicoId: string;
  nomeTecnico?: string;
  numeroRelatorio: number;
  assunto: string;
  orientacao: string;
  produtor?: Produtor;
  pictureURI: string;
  assinaturaURI: string;
  createdAt: any;
  updatedAt?: any;
};
