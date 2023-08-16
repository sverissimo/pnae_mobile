import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { Usuario } from "../types/Usuario";
import { env } from "../config";

export const useAuth = () => {
  const { user, setUser } = useContext(UserContext);
  const [userInput, setUserInput] = useState({});

  const inputHandler = (name: string, value: string) => {
    setUserInput((userInput) => ({ ...userInput, [name]: value }));
  };

  const loginHandler = () => {
    const testUser = env.TEST_USER;
    setUser(testUser || ({} as Usuario));
  };

  const logoutHandler = () => {
    setUser(null);
  };

  return {
    user,
    setUser,
    inputHandler,
    loginHandler,
    logoutHandler,
  };
};
