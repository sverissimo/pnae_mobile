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
  id_at_atendimento?: string | null;
  outro_extensionista?: string;
  read_only?: boolean | number;
  coordenadas?: string;
  created_at: any;
  updated_at?: any;
};
