import { GrupoDetails, ProdutoDetails } from "@domain/perfil/GrupoProdutos";
import { PerfilService } from "@services/perfil/PerfilService";
import { useManageConnection } from "@shared/hooks/useManageConnection";
import { useEffect, useState } from "react";

enum Atividade {
  primaria = "Atividade Primária",
  secundaria = "Atividade Secundária",
  Ambas = "Ambas",
}

export const useManageGrupos = () => {
  const { isConnected } = useManageConnection();
  const [selectedGrupos, setSelectedGrupos] = useState({} as GrupoDetails);
  const [filteredProdutosOptions, setFilteredProdutosOptions] = useState(
    [] as ProdutoDetails[]
  );
  const [typeOfAtividade, setTypeOfAtividade] = useState<Atividade>(
    "" as Atividade
  );
  const [gruposOptions, setGruposOptions] = useState([] as GrupoDetails[]);
  const [produtosOptions, setProdutosOptions] = useState(
    [] as ProdutoDetails[]
  );

  useEffect(() => {
    const getGruposProdutosOptions = async () => {
      const perfilService = new PerfilService({
        isConnected: !!isConnected,
      });
      const gruposProdutosOptions = await perfilService.getGruposProdutos();
      if (gruposProdutosOptions?.grupos && gruposProdutosOptions?.produtos) {
        const { grupos, produtos } = gruposProdutosOptions;

        setGruposOptions(grupos);
        setProdutosOptions(produtos);
        //   addGruposProdutos(pNaturaForm, gruposProdutosOptions);
      }
    };
    getGruposProdutosOptions();
  }, []);

  useEffect(() => {
    // if (selectedGrupos.length && produtosOptions.length) {
    if (selectedGrupos && produtosOptions.length) {
      /*   const filteredProdutos = produtosOptions.filter((p: ProdutoDetails) =>
            selectedGrupos.find(
              (g: GrupoDetails) => g.id_grupo_legado === p.id_grupo_legado
            )
          );
         */ const filteredProdutos = produtosOptions.filter(
        (p: ProdutoDetails) =>
          selectedGrupos.id_grupo_legado === p.id_grupo_legado
      );
      setFilteredProdutosOptions(filteredProdutos);
    }
  }, [selectedGrupos, produtosOptions]);

  return {
    gruposOptions,
    produtosOptions,
    setSelectedGrupos,
    setTypeOfAtividade,
  };
};

//   const addGruposProdutos = (
//     dadosProducaoForm: FormElement[],
//     gruposProdutosOptions: GruposProdutosOptions
//   ) => {
//     const { grupos, produtos } = gruposProdutosOptions;
//     const gruposOptions = grupos
//       .filter((g) => g.tipo === 1)
//       .map((g) => g.nm_grupo);
//     console.log(
//       "🚀 - file: useManagePerfil.ts:120 - useManagePerfil - gruposOptions:",
//       gruposOptions
//     );

//     const produtosOptions = produtos.map((p) => p.nm_produto);

//     const gruposOptionsField = dadosProducaoForm.find(
//       (f) => f.field === "gruposOptions"
//     );
//     gruposOptionsField!.options = gruposOptions;
//     // const produtosOptionsField = dadosProducaoForm.find((f) => f.field === "produtosOptions")
//     // produtosOptionsField!.options = produtosOptions
//     return dadosProducaoForm;
//   };
