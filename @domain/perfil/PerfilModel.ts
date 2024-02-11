import { DadosProducao } from ".";
import { Usuario } from "@shared/types";

//Essa é a forma que o backEnd envia o Perfil
export type PerfilModel = {
  id: string;
  id_cliente: string;
  id_tecnico: string;
  id_contrato: number;
  data_atualizacao: string;
  data_preenchimento: string;
  tipo_perfil: string;
  at_prf_see_propriedade: {
    atividade: string;
    producao_dedicada_pnae?: boolean;
  };
  aderiu_pra?: string;
  agroindustria_precisa_adaptacao_reforma?: string;
  atividades_com_regularizacao_ambiental?: string;
  atividades_usam_recursos_hidricos?: string;
  ciente_iniciativas_regularizacao_pra?: string;
  condicao_posse?: string;
  credito_rural?: string;
  dados_producao_agro_industria: DadosProducao;
  dados_producao_in_natura: DadosProducao;
  dap_caf_vigente?: string;
  fonte_captacao_agua?: string;
  forma_esgotamento_sanitario?: string;
  grau_interesse_pnae?: string;
  nivel_tecnologico_cultivo?: string;
  orgao_fiscalizacao_sanitaria?: string;
  participa_organizacao?: string;
  pessoas_processamento_alimentos?: number;
  possui_agroindustria_propria?: string;
  possui_cadastro_car?: string;
  possui_registro_orgao_fiscalizacao_sanitaria?: string;
  procedimento_pos_colheita?: string;
  realiza_escalonamento_producao?: string;
  sistema_producao?: string;
  tipo_estabelecimento?: string;
  tipo_gestao_unidade?: string;
  tipo_pessoa_juridica?: string;
  usuario: Usuario;
};
