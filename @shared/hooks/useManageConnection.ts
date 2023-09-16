import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export const useManageConnection = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(false);
  const [connectionType, setConnectionType] = useState("none");

  //   const netInfo = useNetInfo();

  //   useEffect(() => {
  //     setIsConnected(netInfo.isConnected);
  //     setConnectionType(netInfo.type);
  //   }, [netInfo.isConnected]);
  //   const unsubscribe = NetInfo.addEventListener((state) => {
  //     console.log("Connection type", state.type);
  //     console.log("Is connected?", state.isConnected);
  //     setIsConnected(state.isConnected);
  //     setConnectionType(state.type);
  //   });

  // To unsubscribe to these update, just use:
  //   unsubscribe();

  return { isConnected, connectionType };
};
