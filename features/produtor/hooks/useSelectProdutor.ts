import { useContext } from "react";
import { ProdutorContext } from "@contexts/ProdutorContext";
import { ProdutorService } from "@services/produtor/ProdutorService";
import { Produtor } from "@features/produtor/types/Produtor";
import { RelatorioContext } from "@contexts/RelatorioContext";
import { useManageConnection, useSnackBar } from "@shared/hooks";
import { isValidCPForCNPJ } from "@shared/utils/cpfUtils";

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
    const cpf = CPFProdutor.replace(/\D/g, "") || "06627559609";

    const produtorService = new ProdutorService({
      isConnected: !!isConnected,
    });

    const produtor = await produtorService.getProdutor(cpf);

    if (!produtor) {
      setSnackBarOptions({
        message: "Produtor não encontrado",
        status: "warning",
      });

      setIsLoading(false);
      return;
    }
    const offlinePerfis = await produtorService.getProdutorLocalPerfis(
      produtor.id_pessoa_demeter
    );
    produtor.perfis.push(...offlinePerfis);
    // produtor.perfis.sort((a, b) =>
    //   Date.parse(a.data_preenchimento) < Date.parse(b.data_preenchimento)
    //     ? 1
    //     : -1
    // );

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
