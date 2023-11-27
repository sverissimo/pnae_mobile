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
    const performSync = async () => {
      if (!debouncedIsConnected) return;
      await atendimentoService.sync();
      await syncHelpers.saveLastSyncDate();
      console.log("Saved last atendimentos sync date");
    };

    performSync();
  }, [debouncedIsConnected]);
};
