import { useEffect, useState } from "react";
import { pascalize } from "humps";
import { ProdutorModel } from "@domain/produtor/ProdutorModel";
import {
  GrupoDetails,
  GruposProdutosOptions,
  PerfilModel,
  Produto,
  ProdutoDetails,
} from "@domain/perfil";
import { PerfilService } from "@services/perfil/PerfilService";
import { PerfilOptions } from "@infrastructure/api/perfil/PerfilOptions";
import { useManageConnection } from "@shared/hooks";
import { formatDate } from "@shared/utils";
import { FormElement } from "@shared/types";
import {
  producaoNaturaForm as prodNaturaForm,
  producaoIndustrialForm as prodIndustrialForm,
} from "../constants";

export const useManagePerfil = (produtor?: ProdutorModel | null) => {
  const [perfis, setPerfis] = useState<PerfilModel[]>([]);
  const [perfil, setPerfil] = useState<PerfilModel>({} as PerfilModel);
  const [producaoNaturaForm, setProducaoNaturaForm] = useState<FormElement[]>(
    []
  );
  const [producaoIndustrialForm, setProducaoIndustrialForm] = useState<
    FormElement[]
  >([]);

  const [gruposOptions, setGruposOptions] = useState([] as GrupoDetails[]);
  const [produtosOptions, setProdutosOptions] = useState(
    {} as ProdutoDetails[]
  );
  const [selectedGrupos, setSelectedGrupos] = useState({} as GrupoDetails);
  const [filteredProdutosOptions, setFilteredProdutosOptions] = useState(
    [] as ProdutoDetails[]
  );

  const { isConnected } = useManageConnection();

  useEffect(() => {
    if (produtor?.perfis) {
      setPerfis(produtor.perfis);
    }
  }, [produtor]);

  useEffect(() => {
    // if (selectedGrupos.length && produtosOptions.length) {
    if (selectedGrupos && produtosOptions.length) {
      console.log(
        "🚀 - file: useManagePerfil.ts:51 - useEffect - selectedGrupos:",
        selectedGrupos
      );

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
      console.log(
        "🚀 - file: useManagePerfil.ts:56 - useEffect - filteredProdutos:",
        filteredProdutos
      );
    }
  }, [selectedGrupos, produtosOptions]);

  useEffect(() => {
    const getPerfilOptions = async () => {
      const perfilService = new PerfilService({
        isConnected: !!isConnected,
      });
      const [perfilOptions, gruposProdutosOptions] = await Promise.all([
        perfilService.getPerfilOptions(),
        perfilService.getGruposProdutos(),
      ]);

      if (!perfilOptions || !Object.keys(perfilOptions).length) return;

      const pNaturaForm = getDadosProducaoOptions(
        prodNaturaForm,
        perfilOptions
      );
      const pIndustrialForm = getDadosProducaoOptions(
        prodIndustrialForm,
        perfilOptions
      );
      if (gruposProdutosOptions?.grupos && gruposProdutosOptions?.produtos) {
        const { grupos, produtos } = gruposProdutosOptions;
        setGruposOptions(grupos);
        setProdutosOptions(produtos);
        addGruposProdutos(pNaturaForm, gruposProdutosOptions);
      }

      setProducaoNaturaForm(pNaturaForm);
      setProducaoIndustrialForm(pIndustrialForm);
    };

    getPerfilOptions();
  }, []);

  const getPerfilListData = (perfis: PerfilModel[]) =>
    perfis.map((p: any) => ({
      id: p.id,
      tipo_perfil: p.tipo_perfil,
      nome_tecnico: p.usuario.nome_usuario,
      data_preenchimento: formatDate(p.data_preenchimento),
      data_atualizacao: formatDate(p.data_atualizacao),
    }));

  const getDadosProducaoOptions = (
    dadosProducaoFormInput: FormElement[],
    perfilOptions: PerfilOptions
  ) => {
    const dadosProducaoForm = [...dadosProducaoFormInput];

    dadosProducaoForm.forEach((field) => {
      if (!field.options) return;
      const camelizedField = pascalize(field.label)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/De/g, "")
        .replace(/Da/g, "")
        .replace(/Dos/g, "")
        .replace(/Do/g, "")
        .replace(/Que/g, "")
        .replace("ProcedimentoPosColheita", "ProcedimentosPosColheita")
        .replace("TipoEstabelecimento", "TipoOrganizacaoEstabelecimento");
      const options = perfilOptions[camelizedField as keyof PerfilOptions];
      if (options) {
        field.options = options;
      }
    });
    return dadosProducaoForm;
  };

  const addGruposProdutos = (
    dadosProducaoForm: FormElement[],
    gruposProdutosOptions: GruposProdutosOptions
  ) => {
    const { grupos, produtos } = gruposProdutosOptions;
    const gruposOptions = grupos
      .filter((g) => g.tipo === 1)
      .map((g) => g.nm_grupo);
    console.log(
      "🚀 - file: useManagePerfil.ts:120 - useManagePerfil - gruposOptions:",
      gruposOptions
    );

    const produtosOptions = produtos.map((p) => p.nm_produto);

    const gruposOptionsField = dadosProducaoForm.find(
      (f) => f.field === "gruposOptions"
    );
    gruposOptionsField!.options = gruposOptions;
    // const produtosOptionsField = dadosProducaoForm.find((f) => f.field === "produtosOptions")
    // produtosOptionsField!.options = produtosOptions
    return dadosProducaoForm;
  };

  return {
    perfis,
    perfil,
    producaoNaturaForm,
    producaoIndustrialForm,
    gruposOptions,
    produtosOptions,
    setSelectedGrupos,
    setPerfis,
    setPerfil,
    getPerfilListData,
  };
};
