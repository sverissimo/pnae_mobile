import { useContext } from "react";
import { ProdutorContext } from "@contexts/ProdutorContext";
import { ProdutorService } from "@services/produtor/ProdutorService";
import { Produtor } from "@features/produtor/types/Produtor";
import { useManageConnection, useSnackBar } from "@shared/hooks";
import { isValidCPForCNPJ } from "@shared/utils/cpfUtils";
import { SnackBarStateProps } from "@contexts/SnackbarContext";

export const useSelectProdutor = () => {
  const {
    produtor,
    setProdutor: setProdutorContext,
    isLoading,
    setIsLoading,
  } = useContext(ProdutorContext);

  const { isConnected } = useManageConnection();
  const { setSnackBarOptions } = useSnackBar();

  const fetchProdutor = async (CPFProdutor: string) => {
    if (!CPFProdutor) {
      handleError("É necessário informar o CPF do produtor", "warning");
      return;
    }

    const cpfIsValid = isValidCPForCNPJ(CPFProdutor);
    if (!cpfIsValid && !!CPFProdutor) {
      const doc = CPFProdutor.length > 14 ? "CNPJ" : "CPF";
      handleError(`${doc} inválido`);
      return;
    }

    setIsLoading(true);
    const cpf = CPFProdutor.replace(/\D/g, "");
    const produtorService = new ProdutorService({
      isConnected: !!isConnected,
    });

    const produtor = await produtorService.getProdutor(cpf);

    if (!produtor) {
      handleError("Produtor não encontrado", "warning");
      return;
    }

    const offlinePerfis = await produtorService.getProdutorLocalPerfis(
      produtor.id_pessoa_demeter
    );
    // In case perfis were created offline and not synced yet
    produtor.perfis.push(...offlinePerfis);

    setProdutor(produtor);
    setIsLoading(false);
  };

  const setProdutor = async (produtorDTO: Produtor | null) => {
    if (!produtorDTO) {
      setProdutorContext(null);
      return;
    }

    setProdutorContext({
      id_pessoa_demeter: produtorDTO.id_pessoa_demeter,
      nm_pessoa: produtorDTO.nm_pessoa,
      nr_cpf_cnpj: produtorDTO.nr_cpf_cnpj,
      tp_sexo: produtorDTO.tp_sexo,
      dt_nascimento: produtorDTO.dt_nascimento,
      sn_ativo: produtorDTO?.sn_ativo ? "Ativo" : "Inativo",
      dap: produtorDTO?.dap,
      caf: produtorDTO?.caf,
      perfis: produtorDTO?.perfis,
      propriedades: produtorDTO?.propriedades,
    });
  };

  const resetProdutor = () => {
    setProdutorContext(null);
  };

  const handleError = (
    message: string,
    status?: SnackBarStateProps["status"]
  ) => {
    setSnackBarOptions({
      message: message || "Erro ao buscar o produtor.",
      status: status || "error",
    });
    setIsLoading(false);
  };

  return {
    produtor,
    isLoading,
    setProdutor,
    resetProdutor,
    fetchProdutor,
  };
};
