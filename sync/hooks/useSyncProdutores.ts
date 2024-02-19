import { useEffect } from "react";

import { useDebounce, useManageConnection } from "@shared/hooks";

export const useSyncProdutores = () => {
  const { isConnected } = useManageConnection();
  const debouncedIsConnected = useDebounce(isConnected, 5000);

  useEffect(() => {
    if (!debouncedIsConnected || !isConnected) return;
    // TODO: Implement this
  }, [debouncedIsConnected, isConnected]);
};
