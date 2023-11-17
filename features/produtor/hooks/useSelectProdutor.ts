import { useContext } from "react";
import { ProdutorContext } from "@contexts/ProdutorContext";
import { ProdutorService } from "@services/produtor/ProdutorService";
import { Produtor } from "@features/produtor/types/Produtor";
import { RelatorioContext } from "@contexts/RelatorioContext";
import { useManageConnection, useSnackBar } from "@shared/hooks";
import { isValidCPForCNPJ } from "@shared/utils/cpfUtils";

import { SyncService } from "@services/system/SyncService";
export const useSelectProdutor = () => {
  const {
    produtor,
    setProdutor: setProdutorContext,
    isLoading,
    setIsLoading,
  } = useContext(ProdutorContext);
  const { setRelatorios } = useContext(RelatorioContext);
  const { isConnected } = useManageConnection();
  const { setSnackBarOptions } = useSnackBar();

  const fetchProdutor = async (CPFProdutor: string) => {
    const cpfIsValid = isValidCPForCNPJ(CPFProdutor);
    if (!cpfIsValid && !!CPFProdutor) {
      const doc = CPFProdutor.length > 14 ? "CNPJ" : "CPF";
      setSnackBarOptions({
        message: `${doc} inválido`,
        status: "error",
      });
      return;
    }
    setIsLoading(true);
    const cpf = CPFProdutor.replace(/\D/g, "") || "15609048605";

    const produtor = await new ProdutorService({
      isConnected: !!isConnected,
    }).getProdutor(cpf);

    // const prods = await new ProdutorService({
    //   isConnected: isConnected,
    // }).getAllLocalProdutoresIds();
    // console.log(
    //   "🚀 - file: useSelectProdutor.ts:39 - fetchProdutor - prods:",
    //   prods
    // );

    // ********** TESTING ONLY
    // const ids = await new SyncService()
    //   .syncRelatorios(true)
    //   .catch((e) => console.log("Callee error --------", e));
    // console.log("🚀 ------------- fetchProdutor - dataFromServer:", ids);

    if (!produtor) {
      setSnackBarOptions({
        message: "Produtor não encontrado",
        status: "warning",
      });
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    setProdutor(produtor);
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
    setRelatorios([]);
  };

  return {
    produtor,
    isLoading,
    setProdutor,
    resetProdutor,
    fetchProdutor,
  };
};
