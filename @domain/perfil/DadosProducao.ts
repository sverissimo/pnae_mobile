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

export type DadosProducaoInput = {
  controla_custos_producao: string;
  dificuldade_fornecimento: string[];
  forma_entrega_produtos: string[];
  informacoes_adicionais: string;
  local_comercializacao: string[];
  tipo_regularizacao_ambiental: string;
  tipo_regularizacao_uso_recursos_hidricos: string;
  valor_total_obtido_outros: string;
  valor_total_obtido_pnae: string;
  at_prf_see_grupos_produtos: GrupoProdutos[];
};

export type DadosProducaoIndustrialViewModel = {
  controla_custos_producao2: boolean;
  dificuldade_fornecimento2: string;
  forma_entrega_produtos2: string;
  informacoes_adicionais2: string;
  local_comercializacao2: string;
  tipo_regularizacao_ambiental2: string;
  tipo_regularizacao_uso_recursos_hidricos2: string;
  valor_total_obtido_outros2: string;
  valor_total_obtido_pnae2: string;
  at_prf_see_grupos_produtos2: GrupoProdutos[];
};

export type DadosProducaoIndustrialInput = {
  controla_custos_producao2: string;
  dificuldade_fornecimento2: string[];
  forma_entrega_produtos2: string[];
  informacoes_adicionais2: string;
  local_comercializacao2: string[];
  tipo_regularizacao_ambiental2: string;
  tipo_regularizacao_uso_recursos_hidricos2: string;
  valor_total_obtido_outros2: string;
  valor_total_obtido_pnae2: string;
  at_prf_see_grupos_produtos2: GrupoProdutos[];
};
