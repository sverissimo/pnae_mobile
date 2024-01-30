import { PerfilService } from "@services/perfil/PerfilService";
import { useDebounce, useManageConnection } from "@shared/hooks";
import { useEffect } from "react";

const perfilService = new PerfilService();

export const useSyncPerfil = () => {
  const { isConnected } = useManageConnection();
  const debouncedIsConnected = useDebounce(isConnected, 5000);

  useEffect(() => {
    if (!debouncedIsConnected) return;
    const performSync = async () => {
      await perfilService.sync();
      console.log("Saving remote perfil in remoteRepository");
    };

    performSync();
  }, [debouncedIsConnected]);
};
