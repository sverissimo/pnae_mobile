import { Usuario } from "@shared/types";
import { DadosProducao } from "../../../@domain/perfil";

export type PerfilDTO = {
  aderiu_pra: boolean;
  agroindustria_precisa_adaptacao_reforma: boolean;
  at_prf_see_propriedade: {
    atividade: string;
    producao_dedicada_pnae: boolean;
  };
  atividades_com_regularizacao_ambiental: string;
  atividades_usam_recursos_hidricos: string;
  cient_iniciativas_regularizacao_pra: boolean;
  condicao_posse: string;
  credito_rural: boolean;
  dados_producao_agro_industria: DadosProducao;
  dados_producao_in_natura: DadosProducao;
  dap_caf_vigente: boolean;
  data_atualizacao: string;
  data_preenchimento: string;
  fonte_captacao_agua: string;
  forma_esgotamento_sanitario: string;
  grau_interesse_pnae: string;
  id: string;
  id_cliente: string;
  id_dados_producao_agro_industria: string;
  id_dados_producao_in_natura: string;
  id_tecnico: string;
  nivel_tecnologico_cultivo: string;
  orgao_fiscalizacao_sanitaria: null;
  participa_organizacao: boolean;
  pessoas_processamento_alimentos: number;
  possui_agroindustria_propria: null;
  possui_cadastro_car: boolean;
  possui_registro_orgao_fiscalizacao_sanitaria: boolean;
  procedimento_pos_colheita: string;
  realiza_escalonamento_producao: boolean;
  sistema_producao: string;
  tipo_estabelecimento: string;
  tipo_gestao_unidade: string;
  tipo_perfil: string;
  tipo_pessoa_juridica: string;
  usuario: Usuario;
};
