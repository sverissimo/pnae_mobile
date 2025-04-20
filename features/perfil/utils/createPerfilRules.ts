import { ContractInfo } from "@domain/perfil/ContractInfo";
import { PerfilModel } from "@domain/perfil/PerfilModel";

export function getCreatePerfilRules(
  perfis: PerfilModel[],
  activeContrato: ContractInfo
) {
  if (!activeContrato)
    return {
      roomForPerfil: false,
      canAddEntrada: false,
      canAddSaida: false,
      tipoPerfil: "",
    };

  const { inclusao_entrada, inclusao_saida, id_contrato } = activeContrato;

  const perfisInThisContract = perfis

    .filter((p) => p.id_contrato === id_contrato)
    .map((p) => ({
      tipo_perfil: p.tipo_perfil,
      id_contrato: p.id_contrato,
    }));

  const perfisEntrada = perfisInThisContract.filter(
    (p) => p.tipo_perfil.toLowerCase() === "entrada"
  );

  const perfisSaida = perfisInThisContract.filter(
    (p) => p.tipo_perfil === "SAIDA" || p.tipo_perfil === "Saída"
  );

  const roomForPerfil = perfisInThisContract.length < 2;
  const canAddEntrada = Boolean(inclusao_entrada && perfisEntrada.length === 0);
  const canAddSaida = Boolean(
    inclusao_saida && perfisEntrada.length > 0 && perfisSaida.length === 0
  );

  const hasPerfilEntradaForActiveContract = perfis.some(
    (p) =>
      p.tipo_perfil === "Entrada" &&
      p.id_contrato === activeContrato?.id_contrato
  );
  const tipoPerfil = canAddEntrada ? "Entrada" : canAddSaida ? "Saída" : "";

  const canCreatePerfilForThisContract =
    (canAddEntrada || canAddSaida) && roomForPerfil;

  return {
    tipoPerfil,
    canAddEntrada,
    canAddSaida,
    roomForPerfil,
    hasPerfilEntradaForActiveContract,
    canCreatePerfilForThisContract,
  };
}
