import { useContext } from "react";
import { ProdutorContext } from "@contexts/ProdutorContext";
import { ProdutorService } from "@services/produtor/ProdutorService";
import { Produtor } from "@features/produtor/types/Produtor";
import { RelatorioContext } from "@contexts/RelatorioContext";
import { useSnackBar } from "@shared/hooks";
import { isValidCPForCNPJ } from "@shared/utils/cpfUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useSelectProdutor = () => {
  const {
    produtor,
    setProdutor: setProdutorContext,
    isLoading,
    setIsLoading,
  } = useContext(ProdutorContext);
  const { setRelatorios } = useContext(RelatorioContext);
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

    // const allData = await AsyncStorage.getItem("produtores");
    // const p = JSON.parse(allData!);
    // console.log("🚀 - fetchProdutoraaaaaaaaaaaaaaaaaaaaa - p:", Object.keys(p));
    // console.log("🚀 - fetchProdutor - allDataZzzzXxxxxxxxx:", allData);

    const produtor = await new ProdutorService().getProdutor(cpf);
    const ids = await new ProdutorService().getAllLocalProdutoresIds();
    console.log("🚀 - ALL --------- right:", { ids });

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

  const setProdutor = async (produtorDTO: Produtor) => {
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
      relatorios: produtorDTO?.relatorios,
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
