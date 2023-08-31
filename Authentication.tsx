import LoginScreen from "./screens/LoginScreen";
import RootNavigator from "./navigation/RootNavigator";
import { useAuth } from "./hooks/useAuth";

export default function Authentication() {
  const { user } = useAuth();
  if (!user?.matricula_usuario) {
    return <LoginScreen />;
  }

  return <RootNavigator />;
}
