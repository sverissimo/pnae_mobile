import { PerfilModel } from "@domain/perfil";
import { PropriedadeModel } from "@domain/propriedade/PropriedadeModel";

export type ProdutorModel = {
  id_pessoa_demeter: string;
  nm_pessoa: string;
  nr_cpf_cnpj: string;
  tp_sexo: string;
  dt_nascimento: string;
  sn_ativo?: string;
  dap: string | null;
  caf?: string | null;
  dt_update_record?: string;
  propriedades: PropriedadeModel[];
  perfis: PerfilModel[];
};
