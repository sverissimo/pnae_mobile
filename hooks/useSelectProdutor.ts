import { useContext, useState } from "react";
import { Produtor, ProdutorContext } from "../contexts/ProdutorContext";

export const useSelectProdutor = () => {
  const { produtor, setProdutor } = useContext(ProdutorContext);
  const [state, setState] = useState({} as Produtor);

  const inputHandler = (name: string, value: string) => {
    setState((state) => ({ ...state, [name]: value }));
  };

  const getProdutor = () => {
    setProdutor(state);
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
