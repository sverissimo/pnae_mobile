import LoginScreen from "./screens/LoginScreen";
import RootNavigator from "./navigation/RootNavigator";
import { useAuth } from "./hooks/useAuth";

export default function Authentication() {
  const { user } = useAuth();
  if (!user) {
    return <LoginScreen />;
  }

  return <RootNavigator />;
}
