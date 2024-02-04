import { ContratoContext } from "@contexts/ContratoContext";
import { PerfilService } from "@services/perfil/PerfilService";
import { useContext, useEffect, useState } from "react";
import { useManageConnection } from ".";
import { PerfilModel } from "@domain/perfil";

export const useManageContratos = (perfis?: PerfilModel[]) => {
  const { isConnected } = useManageConnection();

  const { activeContract: activeContrato, setActiveContract } =
    useContext(ContratoContext);

  const [tipoPerfil, setTipoPerfil] = useState<string>("");
  const [enableSavePerfil, setEnableSavePerfil] = useState<boolean>(false);
  const [contractPermissionMessage, setContractPermissionMessage] =
    useState<string>("");

  useEffect(() => {
    if (activeContrato?.id_contrato) return;
    fetchContratos();
  }, []);

  useEffect(() => {
    if (!activeContrato || !perfis) return;

    const { enableSavePerfil, tipoPerfil, contractPermissionMessage } =
      getContractPermissions(perfis);
    console.log("🚀 - useEffect  tipoPerfil:", tipoPerfil);

    setEnableSavePerfil(enableSavePerfil);
    setTipoPerfil(tipoPerfil);
    setContractPermissionMessage(contractPermissionMessage);
  }, [activeContrato, perfis]);

  const getContractPermissions = (perfis: PerfilModel[]) => {
    const { inclusao_entrada, inclusao_saida } = activeContrato!;

    const perfisInThisContract = perfis.filter(
      (p) => p.id_contrato === activeContrato!.id_contrato
    );

    const roomForPerfil = perfisInThisContract.length < 2;
    const perfisEntrada = perfisInThisContract.filter(
      (p) => p.tipo_perfil === "Entrada"
    );
    const perfisSaida = perfisInThisContract.filter(
      (p) => p.tipo_perfil === "Saída"
    );

    const canAddEntrada = inclusao_entrada && perfisEntrada.length === 0;

    const canAddSaida =
      inclusao_saida && perfisEntrada.length > 0 && perfisSaida.length === 0;

    const enableSavePerfil = (canAddEntrada || canAddSaida) && roomForPerfil;

    const contractPermissionMessage = createPermissionMessage(
      canAddEntrada,
      canAddSaida,
      roomForPerfil
    );
    let tipoPerfil = "";

    if (canAddEntrada) tipoPerfil = "Entrada";
    if (canAddSaida) tipoPerfil = "Saída";
    if (canAddEntrada && canAddSaida) tipoPerfil = "Ambos";

    return { enableSavePerfil, tipoPerfil, contractPermissionMessage };
  };

  const fetchContratos = async () => {
    const contratos = await new PerfilService({
      isConnected: !!isConnected,
    }).getContractInfo();

    if (contratos && contratos.length > 0) {
      const activeContrato =
        contratos.findLast((contrato) => !!contrato.contrato_ativo) || null;

      const { inclusao_entrada, inclusao_saida } = activeContrato || {};
      const tipoPerfil =
        inclusao_entrada && inclusao_saida
          ? "Ambos"
          : inclusao_entrada
          ? "Entrada"
          : inclusao_saida
          ? "Saída"
          : "";
      setTipoPerfil(tipoPerfil);
      setActiveContract(activeContrato);
    }
  };

  const createPermissionMessage = (
    canAddEntrada: boolean,
    canAddSaida: boolean,
    roomForPerfil: boolean
  ) => {
    if ((canAddEntrada || canAddSaida) && roomForPerfil) return "";

    let contractPermissionMessage =
      "Não é possível criar um novo perfil para o contrato vigente.";

    if (!roomForPerfil) {
      return contractPermissionMessage;
    }

    if (!canAddEntrada) {
      contractPermissionMessage +=
        " Não foi criado um perfil de entrada em tempo hábil para esse contrato.";
    } else if (!canAddSaida) {
      contractPermissionMessage =
        " Não é possível criar um perfil de saída para esse contrato.";
    }
    return contractPermissionMessage;
  };

  return {
    activeContrato,
    enableSavePerfil,
    tipoPerfil,
    contractPermissionMessage,
    fetchContratos,
  };
};
