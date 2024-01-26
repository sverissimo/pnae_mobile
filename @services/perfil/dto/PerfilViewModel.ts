import {
  DadosProducao,
  DadosProducaoIndustrialViewModel,
  PerfilModel,
} from "../../../@domain/perfil";

export type PerfilViewModel = Omit<
  PerfilModel,
  "dados_producao_agro_industria" | "dados_producao_in_natura"
> & {
  dados_producao_in_natura: DadosProducao;
  dados_producao_agro_industria: DadosProducaoIndustrialViewModel;
};
