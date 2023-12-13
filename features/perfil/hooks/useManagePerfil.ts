import { useEffect, useState } from "react";
import { Perfil } from "../types";
import { formatDate } from "@shared/utils";
import { ProdutorModel } from "@domain/produtor/ProdutorModel";
import { PerfilService } from "@services/perfil/PerfilService";
import { useManageConnection } from "@shared/hooks";
import { PerfilOptions } from "@infrastructure/api/perfil/PerfilOptions";
import { FormElement } from "@shared/types";
import { pascalize } from "humps";
import {
  producaoNaturaForm as prodNaturaForm,
  producaoIndustrialForm as prodIndustrialForm,
} from "../constants";

export const useManagePerfil = (produtor?: ProdutorModel | null) => {
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [perfil, setPerfil] = useState<Perfil>({} as Perfil);
  const [producaoNaturaForm, setProducaoNaturaForm] = useState<FormElement[]>(
    []
  );
  const [producaoIndustrialForm, setProducaoIndustrialForm] = useState<
    FormElement[]
  >([]);
  const { isConnected } = useManageConnection();

  useEffect(() => {
    if (produtor?.perfis) {
      setPerfis(produtor.perfis);
    }
  }, [produtor]);

  useEffect(() => {
    const getPerfilOptions = async () => {
      const perfilOptions = await new PerfilService({
        isConnected: !!isConnected,
      }).getPerfilOptions();

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

  const getPerfilListData = (perfis: Perfil[]) =>
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

    dadosProducaoForm.sort((a, b) => {
      if (a.label < b.label) return -1;
      if (a.label > b.label) return 1;
      return 0;
    });

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
        if (field.type === "selectMultiple") {
          field.items = options.map((option) => ({
            id: option,
            name: option,
          }));
        }
        field.options = options;
      }
    });
    return dadosProducaoForm;
  };

  return {
    perfis,
    perfil,
    producaoNaturaForm,
    producaoIndustrialForm,
    setPerfis,
    setPerfil,
    getPerfilListData,
  };
};
