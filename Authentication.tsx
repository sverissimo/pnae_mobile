import LoginScreen from "./screens/LoginScreen";
import RootNavigator from "./navigation/RootNavigator";
import { useAuth } from "./auth/hooks/useAuth";
import { useLocation, useManageConnection } from "@shared/hooks";
import { GetLocationScreen } from "screens";
import { useEffect } from "react";
import { SyncService } from "@services/system/SyncService";
import { useDebounce } from "@shared/hooks/useDebounce";

export default function Authentication() {
  const { user } = useAuth();
  const { locationPermission, getLocationPermission } = useLocation();
  const { isConnected } = useManageConnection();

  const debouncedIsConnected = useDebounce(isConnected, 5000);

  useEffect(() => {
    if (!debouncedIsConnected) return;
    new SyncService()
      .syncRelatorios(!!debouncedIsConnected)
      .catch((e) => console.log(e));
    console.log("🚀 - useEffect - isConnected:", isConnected);
  }, [debouncedIsConnected]);

  if (!user?.matricula_usuario) {
    return <LoginScreen />;
  }

  if (locationPermission !== "granted") {
    return (
      <GetLocationScreen
        locationPermission={locationPermission}
        getLocationPermission={getLocationPermission}
      />
    );
  }

  return <RootNavigator />;
}
