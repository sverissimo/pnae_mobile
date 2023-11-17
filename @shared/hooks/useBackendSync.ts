import { useEffect } from "react";
import { SyncService } from "@services/system/SyncService";
import { useDebounce } from "./useDebounce";
import { useManageConnection } from "./useManageConnection";

export const useSyncRelatorios = () => {
  const { isConnected } = useManageConnection();
  const debouncedIsConnected = useDebounce(isConnected, 5000);

  useEffect(() => {
    if (!debouncedIsConnected) return;
    new SyncService()
      .syncRelatorios(!!debouncedIsConnected)
      .catch((e) => console.log("Sync error:", e));
  }, [debouncedIsConnected]);
};
