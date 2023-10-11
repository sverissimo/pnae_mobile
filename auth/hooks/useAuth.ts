import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Usuario } from "../../@shared/types/Usuario";
import { env } from "../../config/env";
import { UsuarioAPI } from "@infrastructure/api/UsuarioAPI";
import { getData, removeValue, storeData } from "@shared/utils";
import { Alert } from "react-native";
import { perfisAutorizados } from "@auth/constants";
import { useSelectProdutor } from "@features/produtor/hooks";

export const useAuth = () => {
  const { user, setUser } = useContext(UserContext);
  const { setProdutor } = useSelectProdutor();
  const [userInput, setUserInput] = useState({} as Usuario);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const loggedUser = (await getData("user")) as Usuario;
      // console.log("🚀 ~ file: useAuth.ts:20 ~ loggedUser:", loggedUser);
      if (loggedUser?.matricula_usuario) {
        setUser(loggedUser);
      }
      return () => {
        setIsLoading(false);
        setUser({} as Usuario);
      };
    })();
  }, []);

  const inputHandler = (name: string, value: string) => {
    setUserInput((userInput) => ({ ...userInput, [name]: value }));
  };

  const loginHandler = async () => {
    const testUser = env.TEST_USER;
    setIsLoading(true);
    if (!userInput?.matricula_usuario && !user?.matricula_usuario) {
      setUser(testUser);
      await storeData("user", testUser);
      // setIsLoading(false);
      return;
    }
    const queryResult: any = await UsuarioAPI.getUsuarios({
      matricula: userInput.matricula_usuario,
    });

    const result = queryResult[0];
    console.log("🚀 ~ file: useAuth.ts:41 ~ loginHandler ~ result:", result);
    if (!result) {
      Alert.alert(
        "Usuário não encontrado",
        "Favor verificar a matrícula e tentar novamente."
      );
      setIsLoading(false);
      return;
    }

    if (result?.error) {
      alert(result.message);
      setIsLoading(false);
      return;
    }
    const usuario = result as Usuario;

    const authorized =
      usuario?.perfis?.some((perfil: string) =>
        perfisAutorizados.includes(perfil)
      ) || false;

    console.log({ authorized, result });
    if (!authorized) {
      Alert.alert(
        "Usuário não autorizado",
        "O perfil de usuário não está autorizado a acessar o aplicativo. Favor contatar o administrador do sistema."
      );
      setIsLoading(false);
      return;
    }

    await storeData("user", result);
    setUser(result);
    setIsLoading(false);
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
        { text: "Sair", onPress: logoutHandler },
      ],
      {
        cancelable: true,
        onDismiss: () => {
          // setUser({} as Usuario);
          // removeValue("user");
        },
      }
    );

  const logoutHandler = async () => {
    setProdutor(null);
    setUser(null);
    await removeValue("user");
    console.log(await getData("user"));
    return;
  };

  return {
    user,
    userInput,
    isLoading,
    setUser,
    inputHandler,
    loginHandler,
    confirmLogout,
    logoutHandler,
  };
};
