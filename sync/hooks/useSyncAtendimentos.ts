import { AtendimentoService } from "@services/atendimento/AtendimentoService";
import { useManageConnection, useDebounce } from "@shared/hooks";
import { SyncHelpers } from "@sync/SyncHelpers";
import { useEffect } from "react";

const atendimentoService = new AtendimentoService();
const syncHelpers = new SyncHelpers();
export const useSyncAtendimentos = () => {
  const { isConnected } = useManageConnection();
  const debouncedIsConnected = useDebounce(isConnected, 5000);

  useEffect(() => {
    // if (!debouncedIsConnected) return;
    if (!isConnected) return;
    const performSync = async () => {
      await atendimentoService.sync();
      // await syncHelpers.saveLastSyncDate();
      console.log("Saved last atendimentos sync date");
    };

    performSync();
  }, [isConnected]);
};
