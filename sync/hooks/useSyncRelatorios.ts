import { useEffect } from "react";
import { useDebounce, useManageConnection } from "@shared/hooks";
import { RelatorioSyncService } from "@services/@sync/relatorio/RelatorioSyncService";

export const useSyncRelatorios = () => {
  const { isConnected } = useManageConnection();
  const debouncedIsConnected = useDebounce(isConnected, 5000);

  useEffect(() => {
    if (!debouncedIsConnected) return;
    new RelatorioSyncService()
      .syncRelatorios(!!debouncedIsConnected)
      .catch((e) => console.log("Sync error:", e));
  }, [debouncedIsConnected]);
};
