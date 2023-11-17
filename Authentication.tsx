import LoginScreen from "./screens/LoginScreen";
import RootNavigator from "./navigation/RootNavigator";
import { useAuth } from "./auth/hooks/useAuth";
import { useLocation } from "@shared/hooks";
import { GetLocationScreen } from "screens";
import { useSyncRelatorios } from "@shared/hooks/useBackendSync";

export default function Authentication() {
  const { user } = useAuth();
  const { locationPermission, getLocationPermission } = useLocation();

  useSyncRelatorios();

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
