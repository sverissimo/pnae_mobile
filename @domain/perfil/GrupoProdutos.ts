export type ProdutoDetails = {
  nm_produto: string;
  sg_und_medida: string;
};

export type Produto = {
  id_produto: string;
  area_utilizada?: number | null;
  producao_aproximada_ultimo_ano_pnae: string | null;
  producao_aproximada_ultimo_ano_total: string | null;
  at_prf_produto: ProdutoDetails;
  nm_produto: string;
  sg_und_medida: string;
};

export type GrupoDetails = {
  nm_grupo: string;
};

export type GrupoProdutos = {
  id: string;
  area_utilizada?: number | null;
  producao_aproximada_ultimo_ano_pnae: string | null;
  producao_aproximada_ultimo_ano_total: string | null;
  at_prf_grupo_produto: GrupoDetails;
  at_prf_see_produto: Produto[];
  nm_grupo: string;
};
