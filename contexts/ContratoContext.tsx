//this should be like UserContext.tsx
import { FC, ReactNode, createContext, useState } from "react";
import { ContractInfo } from "@domain/perfil/ContractInfo";

type ContratoContextType = {
  activeContract: ContractInfo | null;
  setActiveContract: (activeContract: ContractInfo | null) => void;
};

export const ContratoContext = createContext<ContratoContextType>({
  activeContract: null,
  setActiveContract: () => {},
});

type ContratoContextProviderProps = {
  children: ReactNode;
};

export const ContratoContextProvider: FC<ContratoContextProviderProps> = ({
  children,
}) => {
  const [activeContract, setActiveContract] = useState<ContractInfo | null>(
    null
  );
  return (
    <ContratoContext.Provider value={{ activeContract, setActiveContract }}>
      {children}
    </ContratoContext.Provider>
  );
};
