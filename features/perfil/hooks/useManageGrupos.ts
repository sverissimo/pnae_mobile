import { useEffect, useState } from "react";
import { PerfilService } from "@services/perfil/PerfilService";
import { useManageConnection } from "@shared/hooks/useManageConnection";
import {
  GrupoDetails,
  GrupoProdutos,
  Produto,
  ProdutoDetails,
} from "@domain/perfil/GrupoProdutos";

export const useManageGrupos = (field?: string) => {
  const { isConnected } = useManageConnection();

  const [gruposOptions, setGruposOptions] = useState([] as GrupoDetails[]);
  const [produtosOptions, setProdutosOptions] = useState(
    [] as ProdutoDetails[]
  );

  const [selectedGrupos, setSelectedGrupos] = useState<GrupoProdutos[]>([
    {} as GrupoProdutos,
  ]);
  const [availableGrupos, setAvailableGrupos] = useState<string[]>([]);
  const [selectedProdutos, setSelectedProdutos] = useState<ProdutoDetails[]>(
    []
  );

  useEffect(() => {
    fetchGruposProdutosOptions();
  }, []);

  useEffect(() => {
    updateAvailableGrupos();
  }, [gruposOptions, selectedGrupos]);

  const fetchGruposProdutosOptions = async () => {
    const perfilService = new PerfilService({ isConnected: !!isConnected });
    const gruposProdutosOptions = await perfilService.getGruposProdutos();

    if (gruposProdutosOptions?.grupos && gruposProdutosOptions?.produtos) {
      const { grupos, produtos } = gruposProdutosOptions;

      const filteredGroups = filterByProductionType(grupos);
      const filteredProducts = filterByProductionType(produtos);
      setGruposOptions(filteredGroups);
      setProdutosOptions(filteredProducts);
    }
  };

  const updateAvailableGrupos = () => {
    if (!selectedGrupos[0]?.nm_grupo) {
      const allGroupOptions = gruposOptions
        .map((g) => g.nm_grupo)
        .sort((a, b) => a.localeCompare(b));

      setAvailableGrupos(allGroupOptions);
      return;
    }

    const produtos = selectedProdutos.filter((p) =>
      selectedGrupos.some(
        (g) => g?.id_grupo_produtos === p?.id_grupo_legado?.toString()
      )
    );
    if (!produtos.length) return;

    const availableGrupos = gruposOptions
      .filter((g) => !selectedGrupos.some((sg) => sg?.nm_grupo === g?.nm_grupo))
      .map((g) => g.nm_grupo);
    setAvailableGrupos(availableGrupos);
  };

  const filterByProductionType = <T extends GrupoDetails | ProdutoDetails>(
    list: T[]
  ) => {
    const filteredList = list?.filter((p) =>
      field === "gruposNaturaOptions" ? p.tipo === 1 : p.tipo === 0
    );
    return filteredList;
  };

  const filterAddProdutoOptions = (grupo: GrupoProdutos) => {
    const alreadySelectedProducts = grupo.at_prf_see_produto
      .filter((p) => !!p?.nm_produto)
      .map((p) => p.nm_produto);

    const filteredProdutos = produtosOptions
      ?.filter(
        (p) =>
          p.id_grupo_legado ===
          gruposOptions.find((g) => g.nm_grupo === grupo.nm_grupo)
            ?.id_grupo_legado
      )
      .map((p) => p.nm_produto)
      .sort((a, b) => a.localeCompare(b));

    return filteredProdutos.filter(
      (nomeProduto) => !alreadySelectedProducts?.includes(nomeProduto)
    );
  };

  const handleSelectGrupo = (grupo: string) => {
    const grupoDetails = gruposOptions.find(
      (g) => g.nm_grupo === grupo
    )! as GrupoProdutos;
    console.log("🚀 - handleSelectGrupo - grupoDetails:", grupoDetails);

    grupoDetails.at_prf_see_produto = [{} as Produto];

    const grupos = [...selectedGrupos];
    const index = grupos.findIndex(
      (g) =>
        Object.keys(g).length === 0 ||
        g?.at_prf_see_produto?.length === 0 ||
        !g?.at_prf_see_produto[0].nm_produto
    );

    grupos[index] = grupoDetails;
    setSelectedGrupos(grupos);
  };

  // ***** TODO: Fix when changing selection in different group *****
  const handleSelectProduto = (produto: string) => {
    const selectedProduto = produtosOptions.find(
      (p) => p.nm_produto === produto
    )!;

    const selectedGroup = gruposOptions.find(
      (g) => g.id_grupo_legado == selectedProduto?.id_grupo_legado
    )!;

    const grupos = selectedGrupos.map((group) => group) as GrupoDetails[];

    const alreadySelectedProdutos =
      (grupos.find(
        (g) => g.id_grupo_legado === selectedProduto?.id_grupo_legado
      )?.at_prf_see_produto as Produto[]) || [];

    const produtos = [...alreadySelectedProdutos];
    const productIndex = produtos.findIndex((p) => !p.nm_produto);

    if (productIndex === -1) {
      produtos.push(selectedProduto as Produto);
    } else {
      produtos[productIndex] = selectedProduto as Produto;
    }

    produtos.push({} as Produto);

    const updatedGrupos = selectedGrupos.map((group) =>
      group.nm_grupo === selectedGroup.nm_grupo
        ? { ...group, at_prf_see_produto: produtos }
        : group
    );

    setSelectedGrupos(updatedGrupos);
    setSelectedProdutos(produtos);
  };

  const addGrupo = () => {
    const grupos = [...selectedGrupos];
    grupos.push({} as GrupoProdutos);
    setSelectedGrupos(grupos);
  };

  const removeProduto = (produto: ProdutoDetails) => {
    let updatedGrupos = [...selectedGrupos];
    const activeGroupName = gruposOptions.find(
      (g) => g.id_grupo_legado === produto?.id_grupo_legado
    )?.nm_grupo!;

    const groupIndex = selectedGrupos.findIndex(
      (g) => g?.nm_grupo === activeGroupName
    );

    const grupo = updatedGrupos[groupIndex];
    const selectedProdutos = grupo?.at_prf_see_produto;

    const produtos = selectedProdutos.filter(
      (p) => p.nm_produto !== produto.nm_produto
    );

    if (produtos.length <= 1) {
      const removed = updatedGrupos.splice(groupIndex, 1);
      const available = [...availableGrupos, removed[0].nm_grupo];
      setAvailableGrupos(available);
    } else {
      updatedGrupos[groupIndex].at_prf_see_produto = produtos as Produto[];
    }

    setSelectedGrupos(updatedGrupos);
    setSelectedProdutos(produtos);
  };

  return {
    gruposOptions,
    produtosOptions,
    selectedGrupos,
    selectedProdutos,
    availableGrupos,
    handleSelectGrupo,
    handleSelectProduto,
    addGrupo,
    filterAddProdutoOptions,
    removeProduto,
  };
};
