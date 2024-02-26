import { Usuario } from "@shared/types/Usuario";

export type RelatorioModel = {
  id: string;
  produtorId: string;
  tecnicoId: string;
  contratoId: number;
  nomeTecnico: string;
  numeroRelatorio: number;
  assunto: string;
  orientacao: string;
  pictureURI: string;
  assinaturaURI: string;
  atendimentoId?: string;
  outroExtensionista?: Usuario[];
  matriculaOutroExtensionista?: string;
  nomeOutroExtensionista?: string;
  readOnly?: boolean;
  coordenadas?: string;
  createdAt?: any;
  updatedAt?: any;
};
