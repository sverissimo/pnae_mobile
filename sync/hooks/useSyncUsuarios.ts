import { useEffect } from "react";
import { useManageConnection, useDebounce } from "@shared/hooks";
import { UsuarioSyncService } from "@sync/usuario/UsuarioSyncService";

const usuarioSyncService = new UsuarioSyncService();

export const useSyncUsuarios = () => {
  const { isConnected } = useManageConnection();
  const debouncedIsConnected = useDebounce(isConnected, 5000);

  useEffect(() => {
    if (!debouncedIsConnected || !isConnected) return;
    const performSync = async () => {
      await usuarioSyncService.sync();
    };

    performSync();
  }, [debouncedIsConnected, isConnected]);
};
