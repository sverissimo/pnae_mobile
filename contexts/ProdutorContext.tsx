import { FC, ReactNode, createContext, useState } from "react";
import { Produtor } from "../features/produtor/types/Produtor";

type ProdutorContextType = {
  produtor: Produtor | null;
  isLoading: boolean;
  setProdutor: (produtor: Produtor | null) => void;
  setIsLoading: (isLoading: boolean) => void;
};

export const ProdutorContext = createContext<ProdutorContextType>(
  {} as ProdutorContextType
);

type ProdutorContextProviderProps = {
  children: ReactNode;
};

export const ProdutorContextProvider: FC<ProdutorContextProviderProps> = ({
  children,
}) => {
  const [produtor, setProdutor] = useState<Produtor | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <ProdutorContext.Provider
      value={{ produtor, setProdutor, isLoading, setIsLoading }}
    >
      {children}
    </ProdutorContext.Provider>
  );
};
