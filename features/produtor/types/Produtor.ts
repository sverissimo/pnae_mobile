export type Produtor = {
  id_pessoa_demeter: string;
  nm_pessoa: string;
  nr_cpf_cnpj: string;
  tp_sexo?: string;
  dt_nascimento?: string;
  sn_ativo?: string;
  dap?: string;
  caf?: string;
  propriedades?: any[];
  perfis?: any[];
  relatorios?: any[];
  dt_update_record?: Date;
  ds_email?: string;
};
