import { useEffect } from "react";
import { useDebounce, useManageConnection } from "@shared/hooks";
import { RelatorioSyncService } from "@sync/relatorio/RelatorioSyncService";
import { useLastSyncDate } from "./useSync";

const relatorioSyncService = new RelatorioSyncService();

export const useSyncRelatorios = () => {
  const { saveLastSyncDate } = useLastSyncDate();
  const { isConnected } = useManageConnection();
  const debouncedIsConnected = useDebounce(isConnected, 5000);

  useEffect(() => {
    if (!debouncedIsConnected) return;

    const performSync = async () => {
      try {
        await relatorioSyncService.syncRelatorios();
        saveLastSyncDate();
        console.log("Saved last relatorios sync date");
      } catch (error) {
        console.error("Sync error:", error);
      }
    };

    performSync();
  }, [debouncedIsConnected]);
};
