import { ReactNode, createContext, useState } from "react";

type SyncContextType = {
  lastSync: string;
  setLastSync: (lastSync: string) => void;
};

type SyncProviderProps = {
  children: ReactNode;
};

export const SyncContext = createContext<SyncContextType>(
  {} as SyncContextType
);

export const SyncContextProvider: React.FC<SyncProviderProps> = ({
  children,
}) => {
  const [lastSync, setLastSync] = useState<string>("");

  return (
    <SyncContext.Provider value={{ lastSync, setLastSync }}>
      {children}
    </SyncContext.Provider>
  );
};
