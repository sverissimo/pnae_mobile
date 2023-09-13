import { Usuario } from "@shared/types/Usuario";

import { Produtor } from "../../produtor/types/Produtor";

export type RelatorioModel = {
  id: string;
  produtorId: string;
  tecnicoId: string;
  nomeTecnico: string;
  numeroRelatorio: number;
  assunto: string;
  orientacao: string;
  produtor?: Produtor;
  pictureURI: string;
  assinaturaURI: string;
  outroExtensionista?: Usuario[];
  matriculaOutroExtensionista?: string;
  nomeOutroExtensionista?: string;
  createdAt: any;
  updatedAt?: any;
};
