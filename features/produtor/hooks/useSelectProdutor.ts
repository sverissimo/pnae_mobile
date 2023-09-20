import { useContext, useState } from "react";
import { ProdutorContext } from "@contexts/ProdutorContext";
import { ProdutorService } from "@services/ProdutorService";
import { Produtor } from "@features/produtor/types/Produtor";
import { RelatorioContext } from "@contexts/RelatorioContext";
import produtorSample from "@config/produtor.json";

export const useSelectProdutor = () => {
  const { produtor, setProdutor: setProdutorContext } =
    useContext(ProdutorContext);
  const { setRelatorios } = useContext(RelatorioContext);
  const [state, setState] = useState({} as Produtor);

  const inputHandler = (name: string, value: string) => {
    setState((state) => ({ ...state, [name]: value }));
  };

  const fetchProdutor = async (CPFProdutor: string) => {
    const produtor = await ProdutorService.getProdutor(CPFProdutor);
    // const produtor = produtorSample;
    setProdutor(produtor);
  };

  const setProdutor = async (produtorDTO: any) => {
    setProdutorContext({
      id_pessoa_demeter: produtorDTO.id_pessoa_demeter,
      nm_pessoa: produtorDTO.nm_pessoa,
      nr_cpf_cnpj: produtorDTO.nr_cpf_cnpj,
      tp_sexo: produtorDTO.tp_sexo,
      dt_nascimento: produtorDTO.dt_nascimento,
      sn_ativo: produtorDTO.sn_ativo ? "Ativo" : "Inativo",
      dap: produtorDTO.dap,
      caf: produtorDTO.caf,
      perfis: produtorDTO.perfis,
      relatorios: produtorDTO.relatorios,
      propriedades: produtorDTO.propriedades,
    });
  };

  const resetProdutor = () => {
    setProdutorContext(null);
    setRelatorios([]);
  };

  return {
    produtor,
    inputHandler,
    setProdutor,
    resetProdutor,
    fetchProdutor,
  };
};
