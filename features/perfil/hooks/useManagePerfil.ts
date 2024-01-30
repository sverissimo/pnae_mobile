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
import { toCapitalCase } from "@shared/utils/formatStrings";
import perfilInputTest from "_mockData/perfil/createPerfilInputComplete.json";
import { PerfilInputDTO } from "@services/perfil/dto/PerfilInputDTO";
import { useManageContratos } from "@shared/hooks/useManageContratos";

export const useManagePerfil = (produtor?: ProdutorModel | null) => {
  const { isConnected } = useManageConnection();
  const { user } = useAuth();
  const { activeContrato, tipoPerfil } = useManageContratos();

  const [perfis, setPerfis] = useState<PerfilModel[]>([]);
  const [perfil, setPerfil] = useState<PerfilModel>({} as PerfilModel);
  const [enableSavePerfil, setEnableSavePerfil] = useState<boolean>(false);

  const [producaoNaturaForm, setProducaoNaturaForm] = useState<FormElement[]>(
    []
  );
  const [producaoIndustrialForm, setProducaoIndustrialForm] = useState<
    FormElement[]
  >([]);

  useEffect(() => {
    (async () => {
      if (produtor?.perfis) {
        setPerfis(produtor.perfis);
      }
    })();
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

  useEffect(() => {
    if (activeContrato && perfis.length > 0) {
      const { inclusao_entrada, inclusao_saida } = activeContrato;
      const roomForPerfil =
        perfis.filter((p) => {
          console.log("🚀 - useEffect - p.id_contrato:", p.id_contrato);
          return p.id_contrato === activeContrato.id_contrato;
        }).length < 2;
      const enableSavePerfil =
        (inclusao_entrada || inclusao_saida) && roomForPerfil;

      console.log("🚀 - useEffect - roomForPerfil:", {
        inclusao_entrada,
        inclusao_saida,
        roomForPerfil,
        enableSavePerfil,
        tipoPerfil,
      });
      setEnableSavePerfil(enableSavePerfil);
    }
  }, [activeContrato, perfis]);

  const getPerfilListData = (perfis: PerfilModel[]) =>
    perfis.map((p: any) => ({
      id: p.id,
      tipo_perfil: toCapitalCase(p.tipo_perfil),
      nome_tecnico: p?.usuario?.nome_usuario || user?.nome_usuario,
      data_preenchimento: formatDate(p?.data_preenchimento),
      data_atualizacao: formatDate(p?.data_atualizacao),
      assunto: p.id ? String(Math.random() * 1000) : undefined,
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

  const modelToViewModel = async (perfil: PerfilModel) => {
    const perfilService = new PerfilService({
      isConnected: !!isConnected,
    });

    const perfilViewModel = await perfilService.perfilModelToViewModel(perfil);
    return perfilViewModel;
  };

  const savePerfil = async (perfil: PerfilInputDTO) => {
    const perfilService = new PerfilService({ isConnected: !!isConnected });
    const perfilModel: PerfilModel = await perfilService.perfilInputToModel(
      perfil
    );

    const id_tecnico = user!.id_usuario;
    const { id_pessoa_demeter, propriedades, perfis } = produtor!;
    const id_propriedade = propriedades[0].id_pl_propriedade;
    const { id_contrato } = activeContrato!;
    // perfis?.length && perfis[0].at_prf_see_propriedade?.atividade
    //   ? perfis[0].at_prf_see_propriedade.id_propriedade
    //   : propriedades[0].id_pl_propriedade;

    Object.assign(perfilModel, {
      id_cliente: id_pessoa_demeter,
      id_tecnico,
      id_propriedade,
      id_contrato,
    });

    perfis.push(perfilModel);
    await perfilService.create(perfilModel);
    return;
  };

  return {
    perfis,
    perfil,
    producaoNaturaForm,
    producaoIndustrialForm,
    enableSavePerfil,
    setPerfis,
    setPerfil,
    getPerfilListData,
    modelToViewModel,
    savePerfil,
  };
};
