import { useEffect, useState } from "react";
import { PerfilService } from "@services/perfil/PerfilService";
import { useManageConnection } from "@shared/hooks/useManageConnection";
import {
  GrupoDetails,
  GrupoProdutos,
  Produto,
  ProdutoDetails,
} from "@domain/perfil/GrupoProdutos";
import { PerfilModel } from "@domain/perfil";
import { log } from "@shared/utils/log";

export const useManageGrupos = (
  field?: string,
  selectedItems?: GrupoProdutos[]
) => {
  const { isConnected } = useManageConnection();

  const [gruposOptions, setGruposOptions] = useState([] as GrupoDetails[]);
  const [produtosOptions, setProdutosOptions] = useState(
    [] as ProdutoDetails[]
  );

  const [selectedGrupos, setSelectedGrupos] = useState<GrupoProdutos[]>([
    {} as GrupoProdutos,
  ]);
  const [availableGrupos, setAvailableGrupos] = useState<string[]>([]);
  const [selectedProdutos, setSelectedProdutos] = useState<Produto[]>([]);
  const [enableAddGrupo, setEnableAddGrupo] = useState<boolean>(false);

  useEffect(() => {
    fetchGruposProdutosOptions();
  }, []);

  useEffect(() => {
    updateAvailableGrupos();
  }, [gruposOptions, selectedGrupos]);

  useEffect(() => {
    if (!selectedItems) return;
    const availableGrupos = gruposOptions
      .filter((g) => !selectedGrupos.some((sg) => sg?.nm_grupo === g?.nm_grupo))
      .map((g) => g.nm_grupo);

    setAvailableGrupos(availableGrupos);
    setSelectedGrupos(selectedItems);
  }, [gruposOptions]);

  useEffect(() => {
    const shouldEnable = selectedGrupos.every(
      (grupo) =>
        Object.keys(grupo).length > 0 &&
        grupo.at_prf_see_produto.some((produto) => !!produto.nm_produto) &&
        availableGrupos.length > 0
    );
    setEnableAddGrupo(shouldEnable);
  }, [selectedGrupos, availableGrupos]);

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

    const produtos = selectedProdutos.filter((p: ProdutoDetails) =>
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

  const handleSelectProduto = (
    produto: string,
    selectedGroup: GrupoDetails
  ) => {
    const selectedProduto = produtosOptions.find(
      (p) =>
        p.nm_produto === produto &&
        p.id_grupo_legado === selectedGroup.id_grupo_legado
    )!;
    console.log({ selectedGroup, selectedProduto });

    const alreadySelectedProdutos = selectedGroup?.at_prf_see_produto ?? [];
    const produtos = [...alreadySelectedProdutos];

    produtos.splice(produtos.length - 1, 0, selectedProduto as Produto);
    if (alreadySelectedProdutos.length === produtos.length) {
      produtos.push({} as Produto);
    }

    const updatedGrupos = selectedGrupos.map((group) =>
      group.nm_grupo === selectedGroup.nm_grupo
        ? { ...group, at_prf_see_produto: produtos }
        : group
    );

    setSelectedGrupos(updatedGrupos);
    setSelectedProdutos(produtos);
  };

  const handleChange = (
    inputField: string,
    value: number,
    groupIndex: number,
    productIndex?: number
  ) => {
    if (groupIndex === null || groupIndex === undefined) return;

    const grupos = [...selectedGrupos];
    const inputObject = { [inputField]: value };

    if (
      grupos[groupIndex].dados_producao_estratificados_por_produto === false
    ) {
      grupos[groupIndex] = {
        ...grupos[groupIndex],
        ...inputObject,
      };

      setSelectedGrupos(grupos);
      return;
    }

    if (productIndex === undefined || productIndex === null) return;

    grupos[groupIndex].at_prf_see_produto[productIndex] = {
      ...grupos[groupIndex].at_prf_see_produto[productIndex],
      ...inputObject,
    };

    setSelectedGrupos(grupos);
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
    availableGrupos,
    enableAddGrupo,
    handleChange,
    handleSelectGrupo,
    handleSelectProduto,
    addGrupo,
    filterAddProdutoOptions,
    removeProduto,
  };
};
