import { useContext, useState } from "react";
import { User, UserContext } from "../contexts/UserContext";
import { env } from "../config";

export const useAuth = () => {
  const { user, setUser } = useContext(UserContext);
  const [userInput, setUserInput] = useState({});

  const inputHandler = (name: string, value: string) => {
    setUserInput((userInput) => ({ ...userInput, [name]: value }));
  };

  const loginHandler = () => {
    const testUser = env.TEST_USER;
    setUser(testUser || ({} as User));
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
