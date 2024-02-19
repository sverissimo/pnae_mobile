import { PerfilService } from "@services/perfil/PerfilService";
import { useDebounce, useManageConnection, useSnackBar } from "@shared/hooks";
import { useEffect } from "react";

export const useSyncPerfil = () => {
  const { isConnected } = useManageConnection();
  const { setSnackBarOptions } = useSnackBar();
  const debouncedIsConnected = useDebounce(isConnected, 5000);

  useEffect(() => {
    if (!debouncedIsConnected || !isConnected) return;
    const performSync = async () => {
      try {
        await new PerfilService({
          isConnected: !!debouncedIsConnected,
        }).sync();
        console.log("Saving remote perfil in remoteRepository");
      } catch (error) {
        console.log("🚀 - performSync - error:", error);

        setSnackBarOptions({
          message: "Não foi possível sincronizar o perfil.",
          status: "warning",
        });
      }
    };

    performSync();
  }, [debouncedIsConnected, isConnected]);
};
