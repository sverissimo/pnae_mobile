import { ContratoContext } from "@contexts/ContratoContext";
import { PerfilService } from "@services/perfil/PerfilService";
import { useContext, useEffect } from "react";
import { useManageConnection } from ".";

export const useManageContratos = () => {
  const { isConnected } = useManageConnection();
  const { activeContract: activeContrato, setActiveContract } =
    useContext(ContratoContext);

  useEffect(() => {
    if (activeContrato?.id_contrato) return;
    fetchContratos();
  }, []);

  const fetchContratos = async () => {
    const contratos = await new PerfilService({
      isConnected: !!isConnected,
    }).getContractInfo();

    if (contratos && contratos.length > 0) {
      const activeContrato =
        contratos.findLast(
          (contrato) => !!contrato.contrato_ativo && !!contrato.inclusao_entrada
        ) || null;

      setActiveContract(activeContrato);
    }
  };

  return {
    activeContrato,

    fetchContratos,
  };
};
