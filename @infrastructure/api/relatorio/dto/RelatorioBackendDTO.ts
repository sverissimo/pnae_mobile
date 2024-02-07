export type RelatorioBackendDTO = {
  id: string;
  produtorId: string;
  tecnicoId: string;
  contratoId: number;
  numeroRelatorio: number;
  assunto: string;
  orientacao: string;
  pictureURI: string;
  assinaturaURI: string;
  outroExtensionista?: string;
  readOnly: boolean;
  coordenadas?: string;
  createdAt: string;
  updatedAt?: any;
};
