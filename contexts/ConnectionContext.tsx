import { FC, ReactNode, createContext, useEffect, useState } from "react";
import { useNetInfo } from "@react-native-community/netinfo";

interface ConnectionContextProps {
  isConnected: boolean | null;
  connectionType: string;
}

export const ConnectionContext = createContext<ConnectionContextProps>(
  {} as ConnectionContextProps
);

type ConnectionContextProviderProps = {
  children: ReactNode;
};

export const ConnectionContextProvider: FC<ConnectionContextProviderProps> = ({
  children,
}): any => {
  const [isConnected, setIsConnected] = useState<boolean | null>(false);
  const [connectionType, setConnectionType] = useState("none");

  const netInfo = useNetInfo();

  useEffect(() => {
    setIsConnected(netInfo.isConnected);
    setConnectionType(netInfo.type);
  }, [netInfo]);

  return (
    <ConnectionContext.Provider value={{ isConnected, connectionType }}>
      {children}
    </ConnectionContext.Provider>
  );
};
