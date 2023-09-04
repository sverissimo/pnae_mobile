import LoginScreen from "./screens/LoginScreen";
import RootNavigator from "./navigation/RootNavigator";
import { useAuth } from "./auth/hooks/useAuth";
// import { env } from "config";
// import { useEffect } from "react";

export default function Authentication() {
  const { user } = useAuth();

  // //Testing purposes only
  // const testUser = env.TEST_USER;
  // const { user, setUser } = useAuth();

  // useEffect(() => {
  //   if (!user.login_usuario) {
  //     setUser(testUser);
  //   }
  // }, [user]);

  if (!user?.matricula_usuario) {
    return <LoginScreen />;
  }

  return <RootNavigator />;
}
