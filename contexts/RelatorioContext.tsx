import { createContext, FC, useState } from "react";
import { RelatorioModel } from "@features/relatorio/types/RelatorioModel";

type RelatorioContextType = {
  relatorios: RelatorioModel[];
  setRelatorios: (
    relatorios:
      | RelatorioModel[]
      | ((relatorios: RelatorioModel[]) => RelatorioModel[])
  ) => void;
};

export const RelatorioContext = createContext<RelatorioContextType>(
  {} as RelatorioContextType
);

type RelatorioContextProviderProps = {
  children: React.ReactNode;
};

export const RelatorioContextProvider: FC<RelatorioContextProviderProps> = ({
  children,
}) => {
  const [relatorios, setRelatorios] = useState<RelatorioModel[]>([]);
  const [state, setState] = useState({});

  return (
    <RelatorioContext.Provider value={{ relatorios, setRelatorios }}>
      {children}
    </RelatorioContext.Provider>
  );
};
