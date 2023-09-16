import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Usuario } from "../../@shared/types/Usuario";
import { env } from "../../config";
import { UsuarioAPI } from "@infrastructure/api/UsuarioAPI";

export const useAuth = () => {
  const { user, setUser } = useContext(UserContext);
  const [userInput, setUserInput] = useState({} as Usuario);

  const inputHandler = (name: string, value: string) => {
    setUserInput((userInput) => ({ ...userInput, [name]: value }));
  };

  const loginHandler = async () => {
    const testUser = env.TEST_USER;
    if (!userInput || !userInput.matricula_usuario) {
      setUser(testUser);
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

  const logoutHandler = () => {
    setUser({} as Usuario);
  };

  return {
    user,
    userInput,
    setUser,
    inputHandler,
    loginHandler,
    logoutHandler,
  };
};
