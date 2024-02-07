export type RelatorioLocalDTO = {
  id: string;
  produtor_id: string;
  tecnico_id: string;
  numero_relatorio: number;
  id_contrato: number;
  assunto: string;
  orientacao: string;
  picture_uri: string;
  assinatura_uri: string;
  outro_extensionista?: string;
  read_only?: boolean;
  coordenadas?: string;
  created_at: any;
  updated_at?: any;
};
