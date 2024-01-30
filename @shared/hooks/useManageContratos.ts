import { ContratoContext } from "@contexts/ContratoContext";
import { PerfilService } from "@services/perfil/PerfilService";
import { useContext, useEffect, useState } from "react";
import { useManageConnection } from ".";

export const useManageContratos = () => {
  const { activeContract, setActiveContract } = useContext(ContratoContext);
  const { isConnected } = useManageConnection();
  const [tipoPerfil, setTipoPerfil] = useState<string>("");

  useEffect(() => {
    fetchContratos();
  }, []);

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

  return {
    activeContrato: activeContract,
    tipoPerfil,
    fetchContratos,
  };
};
