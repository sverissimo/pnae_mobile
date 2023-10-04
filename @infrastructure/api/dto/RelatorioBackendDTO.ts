export type RelatorioBackendDTO = {
  id: string;
  produtorId: string;
  tecnicoId: string;
  nomeTecnico: string;
  numeroRelatorio: number;
  assunto: string;
  orientacao: string;
  pictureURI: string;
  assinaturaURI: string;
  outroExtensionista?: string;
  readOnly?: boolean;
  coordenadas?: string;
  createdAt: any;
  updatedAt?: any;
};
