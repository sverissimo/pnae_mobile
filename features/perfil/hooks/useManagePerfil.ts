import { useEffect, useState } from "react";
import { pascalize } from "humps";
import { ProdutorModel } from "@domain/produtor/ProdutorModel";
import { PerfilModel } from "@domain/perfil";
import { PerfilService } from "@services/perfil/PerfilService";
import { PerfilOptions } from "@infrastructure/api/perfil/PerfilOptions";
import { useManageConnection } from "@shared/hooks";
import { formatDate } from "@shared/utils";
import { FormElement } from "@shared/types";
import {
  producaoNaturaForm as prodNaturaForm,
  producaoIndustrialForm as prodIndustrialForm,
} from "../constants";
import { useAuth } from "@auth/hooks/useAuth";

export const useManagePerfil = (produtor?: ProdutorModel | null) => {
  const { isConnected } = useManageConnection();
  const { user } = useAuth();

  const [perfis, setPerfis] = useState<PerfilModel[]>([]);
  const [perfil, setPerfil] = useState<PerfilModel>({} as PerfilModel);
  const [producaoNaturaForm, setProducaoNaturaForm] = useState<FormElement[]>(
    []
  );
  const [producaoIndustrialForm, setProducaoIndustrialForm] = useState<
    FormElement[]
  >([]);

  useEffect(() => {
    if (produtor?.perfis) {
      setPerfis(produtor.perfis);
    }
  }, [produtor]);

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

  const savePerfil = async (perfil: PerfilModel) => {
    const perfilService = new PerfilService({ isConnected: !!isConnected });
    const id_tecnico = user!.id_usuario;

    const { id_pessoa_demeter, propriedades, perfis } = produtor!;
    const id_propriedade =
      perfis?.length && perfis[0].at_prf_see_propriedade?.atividade
        ? perfis[0].at_prf_see_propriedade.atividade
        : propriedades[0].id_pl_propriedade;

    await perfilService.create({
      ...perfil,
      id_cliente: id_pessoa_demeter,
      id_tecnico,
      id_propriedade,
    });
    return;
  };

  return {
    perfis,
    perfil,
    producaoNaturaForm,
    producaoIndustrialForm,
    setPerfis,
    setPerfil,
    getPerfilListData,
    savePerfil,
  };
};
