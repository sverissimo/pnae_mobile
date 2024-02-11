import { GrupoProdutosInput } from "../../../@domain/perfil";

export type PerfilInputDTO = {
  aderiu_pra: string;
  atividade: string;
  at_prf_propriedade_id?: {
    atividade: string;
  };
  agroindustria_precisa_adaptacao_reforma: string;
  atividades_com_regularizacao_ambiental: string[];
  atividades_usam_recursos_hidricos: string[];
  ciente_iniciativas_regularizacao_pra: string;
  condicao_posse: string[];
  credito_rural: string;
  dap_caf_vigente: string;
  fonte_captacao_agua: string[];
  forma_esgotamento_sanitario: string[];
  grau_interesse_pnae: string;
  nivel_tecnologico_cultivo: string[];
  orgao_fiscalizacao_sanitaria: string;
  participa_organizacao: string;
  pessoas_processamento_alimentos: string;
  possui_agroindustria_propria: string;
  possui_cadastro_car: string;
  possui_registro_orgao_fiscalizacao_sanitaria: string;
  procedimento_pos_colheita: string[];
  realiza_escalonamento_producao: string;
  sistema_producao: string[];
  tipo_estabelecimento: string;
  tipo_gestao_unidade: string;
  tipo_perfil: string;
  tipo_pessoa_juridica: string;

  controla_custos_producao: string;
  dificuldade_fornecimento: string[];
  forma_entrega_produtos: string[];
  informacoes_adicionais: string;
  local_comercializacao: string[];
  tipo_regularizacao_ambiental: string;
  tipo_regularizacao_uso_recursos_hidricos: string;
  valor_total_obtido_outros: string;
  valor_total_obtido_pnae: string;

  controla_custos_producao2: string;
  dificuldade_fornecimento2: string[];
  forma_entrega_produtos2: string[];
  informacoes_adicionais2: string;
  local_comercializacao2: string[];
  tipo_regularizacao_ambiental2: string;
  tipo_regularizacao_uso_recursos_hidricos2: string;
  valor_total_obtido_outros2: string;
  valor_total_obtido_pnae2: string;

  gruposNaturaOptions?: GrupoProdutosInput[];
  gruposIndustrialOptions?: GrupoProdutosInput[];
};
