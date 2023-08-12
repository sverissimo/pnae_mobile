import { useContext, useState } from "react";
import { Produtor, ProdutorContext } from "../contexts/ProdutorContext";

export const useSelectProdutor = () => {
  const { produtor, setProdutor } = useContext(ProdutorContext);
  const [state, setState] = useState({} as Produtor);

  const inputHandler = (name: string, value: string) => {
    setState((state) => ({ ...state, [name]: value }));
  };

  const getProdutor = (cpf: string) => {
    setProdutor({
      produtorName: "Evandro de Albuquerque Resende Jr.",
      cpf,
    });
  };

  const resetProdutor = () => {
    setProdutor(null);
  };

  return {
    produtor,
    inputHandler,
    getProdutor,
    resetProdutor,
  };
};
