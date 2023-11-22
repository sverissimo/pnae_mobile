import LoginScreen from "./screens/LoginScreen";
import RootNavigator from "./navigation/RootNavigator";
import { useAuth } from "./auth/hooks/useAuth";
import { useLocation } from "@shared/hooks";
import { GetLocationScreen } from "screens";
import { SyncComponent } from "sync/SyncComponent";

export default function Authentication() {
  const { user } = useAuth();
  const { locationPermission, getLocationPermission } = useLocation();

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

  return (
    <>
      <SyncComponent />
      <RootNavigator />
    </>
  );
}
