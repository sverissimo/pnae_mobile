import { useEffect, useState } from "react";
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

import perfilInput from "./perfilInput.json";
import { PerfilDataMapper } from "@services/perfil/mapper/PerfilDataMapper";

export const useManagePerfil = () => {
  const { isConnected } = useManageConnection();
  const { user } = useAuth();
  const { activeContrato } = useManageContratos();
  const { produtor, setProdutor } = useSelectProdutor();

  const [perfil, setPerfil] = useState({} as PerfilInputDTO);
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

      const perfilOptions = await perfilService.getPerfilOptions();
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
    checkForMissingProps(perfil);
  }, [perfil]);

  const getPerfilListData = (perfis: PerfilModel[]) =>
    perfis.map((p: any) => ({
      id: p.id,
      tipo_perfil: toCapitalCase(p.tipo_perfil),
      nome_tecnico: p?.usuario?.nome_usuario || user?.nome_usuario,
      data_preenchimento: formatDate(p?.data_preenchimento),
      id_contrato:
        p.id_contrato === 1 ? p.id_contrato + "/2023" : p.id_contrato + "/2025",
      // data_atualizacao: formatDate(p?.data_atualizacao),
      assunto: p.id ? String(Math.random() * 1000) : undefined,
    }));

  const getDadosProducaoOptions = (
    dadosProducaoFormInput: FormElement[],
    perfilOptions: PerfilOptions
  ) => {
    const dadosProducaoForm = [...dadosProducaoFormInput];

    dadosProducaoForm.forEach((field) => {
      if (!field.options) return;

      const camelizedField = Perfil.toPefilOptionsProp(field.label);

      const options = perfilOptions[camelizedField];
      if (options) {
        field.options = options;
      }
    });

    return dadosProducaoForm;
  };

  const checkForMissingProps = (perfil: PerfilInputDTO) => {
    if (!perfil.atividade) return false;

    const missingFields = new Perfil(perfil)
      .getMissingProps()
      .filter((field) => field !== "tipo_perfil");
    setMissingFields(missingFields);
  };

  const savePerfil = async (tipoPerfil: string) => {
    const perfilService = new PerfilService({ isConnected: !!isConnected });

    const perfilModel: PerfilModel = new PerfilDataMapper(
      perfil
    ).perfilInputToModel();

    Object.assign(perfilModel, {
      id_cliente: produtor!.id_pessoa_demeter,
      id_tecnico: user!.id_usuario,
      id_propriedade: produtor!.propriedades[0].id_pl_propriedade,
      id_contrato: activeContrato?.id_contrato,
      tipo_perfil: tipoPerfil.toUpperCase(),
    });

    await perfilService.create(perfilModel);

    setProdutor({
      ...produtor,
      perfis: [...perfis, perfilModel],
    } as ProdutorModel);
  };

  return {
    perfis,
    perfil,
    producaoNaturaForm,
    producaoIndustrialForm,
    missingFields,
    setPerfil,
    getPerfilListData,
    savePerfil,
    checkForMissingProps,
  };
};
