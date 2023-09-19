import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Usuario } from "../../@shared/types/Usuario";
import { env } from "../../config";
import { UsuarioAPI } from "@infrastructure/api/UsuarioAPI";
import { getData, removeValue, storeData } from "@shared/utils";
import { Alert } from "react-native";

export const useAuth = () => {
  const { user, setUser } = useContext(UserContext);
  const [userInput, setUserInput] = useState({} as Usuario);

  useEffect(() => {
    (async () => {
      const loggedUser = (await getData("user")) as Usuario;
      if (loggedUser?.login_usuario) {
        setUser(loggedUser);
      }
    })();
  }, []);

  const inputHandler = (name: string, value: string) => {
    setUserInput((userInput) => ({ ...userInput, [name]: value }));
  };

  const loginHandler = async () => {
    const testUser = env.TEST_USER;

    if (!userInput?.matricula_usuario && !user?.matricula_usuario) {
      setUser(testUser);
      await storeData("user", testUser);
      return;
    }

    const queryResult: any = await UsuarioAPI.getUsuariosByMatricula(
      userInput.matricula_usuario
    );
    const result = queryResult[0];

    if (result?.error) {
      alert(result.message);
      return;
    }
    setUser(result);
  };

  const confirmLogout = () =>
    Alert.alert(
      "Fazer Logout",
      "Deseja realmente sair do PNAE APP?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Sair", onPress: () => logoutHandler() },
      ],
      {
        cancelable: true,
        onDismiss: () => {
          setUser({} as Usuario);
          removeValue("user");
        },
      }
    );

  const logoutHandler = async () => {
    console.log(" logoutHandler llllllllll");
    // setUser({} as Usuario);
    // await removeValue("user");
  };

  return {
    user,
    userInput,
    setUser,
    inputHandler,
    loginHandler,
    confirmLogout,
    logoutHandler,
  };
};
