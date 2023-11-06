import { GrupoProdutos } from ".";

export type DadosProducao = {
  controla_custos_producao: boolean;
  dificuldade_fornecimento: string;
  forma_entrega_produtos: string;
  informacoes_adicionais: string;
  local_comercializacao: string;
  tipo_regularizacao_ambiental: string;
  tipo_regularizacao_uso_recursos_hidricos: string;
  valor_total_obtido_outros: string;
  valor_total_obtido_pnae: string;
  at_prf_see_grupos_produtos: GrupoProdutos[];
};
