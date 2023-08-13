import { FC, ReactNode, createContext, useState } from "react";
import { Produtor } from "../features/produtor/types/Produtor";

type ProdutorContextType = {
  produtor: Produtor | null;
  setProdutor: (produtor: Produtor | null) => void;
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
  return (
    <ProdutorContext.Provider value={{ produtor, setProdutor }}>
      {children}
    </ProdutorContext.Provider>
  );
};
