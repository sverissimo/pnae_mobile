import { useMemo } from "react";
import { getPerfilHelperMessage } from "../utils/getPerfilHelperMessage";
import { useSelectProdutor } from "@features/produtor/hooks";
import { useManageRelatorio } from "@features/relatorio/hooks";
import { useManageContratos } from "@shared/hooks/useManageContratos";
import { useManagePerfil } from "./useManagePerfil";
import { ContractInfo } from "@domain/perfil/ContractInfo";
import { getCreatePerfilRules } from "../utils/createPerfilRules";

export const usePerfilPermissions = () => {
  const { produtor } = useSelectProdutor();
  const { relatoriosCount } = useManageRelatorio();
  const { activeContrato } = useManageContratos();
  const { perfis } = useManagePerfil();

  const {
    tipoPerfil,
    canAddEntrada,
    canAddSaida,
    roomForPerfil,
    hasPerfilEntradaForActiveContract,
    canCreatePerfilForThisContract,
  } = useMemo(
    () => getCreatePerfilRules(perfis, activeContrato ?? ({} as ContractInfo)),
    [perfis, activeContrato]
  );

  const produtorHasNoPropriedades = !produtor?.propriedades?.length;

  const createPerfilForbbiden = useMemo(() => {
    const notEnoughRelatorios =
      hasPerfilEntradaForActiveContract && relatoriosCount < 4;

    return (
      produtorHasNoPropriedades ||
      !canCreatePerfilForThisContract ||
      notEnoughRelatorios
    );
  }, [
    canCreatePerfilForThisContract,
    produtorHasNoPropriedades,
    relatoriosCount,
    perfis,
    activeContrato,
  ]);

  const helperMessage = useMemo(
    () =>
      getPerfilHelperMessage({
        produtorHasNoPropriedades,
        isContractExpired: !activeContrato?.contrato_ativo,
        canAddEntrada,
        canAddSaida,
        roomForPerfil,
        relatoriosCount,
      }),
    [
      produtorHasNoPropriedades,
      canAddEntrada,
      canAddSaida,
      roomForPerfil,
      relatoriosCount,
    ]
  );

  return {
    tipoPerfil,
    canCreatePerfilForThisContract,
    createPerfilForbbiden,
    helperMessage,
  };
};
