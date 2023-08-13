import { useContext, useState } from "react";
import { ProdutorContext } from "../../../contexts/ProdutorContext";
import { Produtor } from "../types/Produtor";

export const useSelectProdutor = () => {
  const { produtor, setProdutor: setProdutorContext } =
    useContext(ProdutorContext);
  const [state, setState] = useState({} as Produtor);

  const inputHandler = (name: string, value: string) => {
    setState((state) => ({ ...state, [name]: value }));
  };

  const setProdutor = async (produtorDTO: any) => {
    setProdutorContext({
      id_pessoa_demeter: produtorDTO.id_pessoa_demeter,
      nm_pessoa: produtorDTO.nm_pessoa,
      nr_cpf_cnpj: produtorDTO.nr_cpf_cnpj,
      tp_sexo: produtorDTO.tp_sexo,
      dap: produtorDTO.dap,
      caf: produtorDTO.caf,
      perfis: produtorDTO.perfis,
      relatorios: produtorDTO.relatorios,
      propriedades: produtorDTO.propriedades,
    });
  };

  const resetProdutor = () => {
    setProdutorContext(null);
  };

  return {
    produtor,
    inputHandler,
    setProdutor,
    resetProdutor,
  };
};
