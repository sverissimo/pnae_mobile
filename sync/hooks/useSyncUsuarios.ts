import { useEffect } from "react";
import { useManageConnection, useDebounce } from "@shared/hooks";
import { UsuarioSyncService } from "@sync/usuario/UsuarioSyncService";

const usuarioSyncService = new UsuarioSyncService();

export const useSyncUsuarios = () => {
  const { isConnected } = useManageConnection();
  const debouncedIsConnected = useDebounce(isConnected, 5000);

  useEffect(() => {
    const performSync = async () => {
      if (!debouncedIsConnected) return;
      await usuarioSyncService.sync();
    };

    performSync();
  }, [debouncedIsConnected]);
};
