import { PerfilService } from "@services/perfil/PerfilService";
import { useDebounce, useManageConnection } from "@shared/hooks";
import { useEffect } from "react";

const perfilService = new PerfilService();

export const useSyncPerfilOptions = () => {
  const { isConnected } = useManageConnection();
  const debouncedIsConnected = useDebounce(isConnected, 5000);

  useEffect(() => {
    if (!debouncedIsConnected || !isConnected) return;
    const performSync = async () => {
      await perfilService.getPerfilOptions();
      await perfilService.getGruposProdutos();

      console.log(
        "Getting perfil options/groupsProducts from remoteRepository"
      );
    };

    performSync();
  }, [debouncedIsConnected, isConnected]);
};
