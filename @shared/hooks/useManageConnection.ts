import { ConnectionContext } from "@contexts/ConnectionContext";
import { useContext } from "react";

export const useManageConnection = () => {
  const { isConnected, connectionType } = useContext(ConnectionContext);
  // return { isConnected: false, connectionType };
  return { isConnected, connectionType };
};
