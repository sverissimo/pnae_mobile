import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Usuario } from "../../@shared/types/Usuario";
import { UsuarioAPIRepository } from "@infrastructure/api/usuario/UsuarioAPIRepository";
import { getData, removeValue, storeData } from "@shared/utils";
import { Alert } from "react-native";
import { perfisAutorizados } from "@auth/constants";
import { useSelectProdutor } from "@features/produtor/hooks";
import { useSnackBar } from "@shared/hooks";

export const useAuth = () => {
  const { user, setUser } = useContext(UserContext);
  const { setProdutor } = useSelectProdutor();
  const { setSnackBarOptions } = useSnackBar();
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
    setIsLoading(true);
    const { matricula_usuario, password } = userInput;

    if (!matricula_usuario || !password) {
      const emptyField = !matricula_usuario ? "matrícula" : "senha";
      handleLoginError(`É necessário informar a ${emptyField}.`);
      return;
    }

    try {
      const usuario = await attemptLogin(matricula_usuario, password);

      if (!isUserAuthorized(usuario)) {
        handleLoginError("Usuário não autorizado.");
        setIsLoading(false);
        return;
      }

      await storeData("user", usuario);
      setUser(usuario);
      setIsLoading(false);
    } catch (error) {
      handleLoginError("Matrícula ou senha inválidos.");
    }
  };

  const attemptLogin = async (matricula_usuario: string, password: string) => {
    return await UsuarioAPIRepository.login({
      matricula_usuario,
      password,
    });
  };

  const isUserAuthorized = (usuario: Usuario) => {
    const authorized = usuario?.perfis?.some((perfil) =>
      perfisAutorizados.includes(perfil)
    );

    return !!authorized;
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
      }
    );

  const logoutHandler = async () => {
    setProdutor(null);
    setUser(null);
    await removeValue("user");
    return;
  };

  const handleLoginError = (message: string) => {
    setSnackBarOptions({
      message: message || "Erro ao fazer login.",
      status: "error",
    });
    setIsLoading(false);
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
