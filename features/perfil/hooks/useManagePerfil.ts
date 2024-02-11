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
import { PerfilInputDTO } from "@services/perfil/dto/PerfilInputDTO";
import { useManageContratos } from "@shared/hooks/useManageContratos";
import { useSelectProdutor } from "@features/produtor/hooks";
import { log } from "@shared/utils/log";
import { Perfil } from "@domain/perfil/Perfil";

export const useManagePerfil = (produtor?: ProdutorModel | null) => {
  const { isConnected } = useManageConnection();
  const { user } = useAuth();
  const { activeContrato } = useManageContratos(produtor?.perfis);
  const { setProdutor } = useSelectProdutor();

  const [perfil, setPerfil] = useState<PerfilModel>({} as PerfilModel);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const [producaoNaturaForm, setProducaoNaturaForm] = useState<FormElement[]>(
    []
  );
  const [producaoIndustrialForm, setProducaoIndustrialForm] = useState<
    FormElement[]
  >([]);

  const perfis = produtor?.perfis || [];

  useEffect(() => {
    if (producaoIndustrialForm.length && producaoNaturaForm.length) return;

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

  const checkForMissingProps = (perfil: PerfilInputDTO) => {
    if (!perfil.atividade) return false;

    const missingFields = new Perfil(perfil).getMissingProps();

    // log(missingFields);

    setMissingFields(missingFields);
  };

  const savePerfil = async (perfil: PerfilInputDTO) => {
    console.log("🚀 - savePerfil - perfil:", JSON.stringify(perfil));
    const perfilService = new PerfilService({ isConnected: !!isConnected });
    const perfilModel: PerfilModel = await perfilService.perfilInputToModel(
      perfil
    );

    const id_tecnico = user!.id_usuario;
    const { id_pessoa_demeter, propriedades } = produtor!;
    const id_propriedade = propriedades[0].id_pl_propriedade;
    const { id_contrato } = activeContrato!;

    Object.assign(perfilModel, {
      id_cliente: id_pessoa_demeter,
      id_tecnico,
      id_propriedade,
      id_contrato,
    });

    setProdutor({
      ...produtor,
      perfis: [...perfis, perfilModel],
    } as ProdutorModel);

    await perfilService.create(perfilModel);
    return;
  };

  return {
    perfis,
    perfil,
    producaoNaturaForm,
    producaoIndustrialForm,
    missingFields,
    setPerfil,
    getPerfilListData,
    modelToViewModel,
    savePerfil,
    checkForMissingProps,
  };
};
