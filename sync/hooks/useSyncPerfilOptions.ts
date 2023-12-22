import { PerfilService } from "@services/perfil/PerfilService";
import { useDebounce, useManageConnection } from "@shared/hooks";
import { useEffect } from "react";

const perfilService = new PerfilService();

export const useSyncPerfilOptions = () => {
  const { isConnected } = useManageConnection();
  const debouncedIsConnected = useDebounce(isConnected, 5000);

  useEffect(() => {
    // if (!debouncedIsConnected) return;
    if (!isConnected) return;
    const performSync = async () => {
      await perfilService.getGruposProdutos();
      // await syncHelpers.saveLastSyncDate();
      console.log("Getting perfil and options from remoteRepository");
    };

    performSync();
  }, [isConnected]);
};
