import { FC, ReactNode, createContext, useState } from "react";
import { Usuario } from "../types/Usuario";

type UserContextType = {
  user: Usuario;
  setUser: (user: Usuario) => void;
};

export const UserContext = createContext<UserContextType>(
  {} as UserContextType
);

type UserContextProviderProps = {
  children: ReactNode;
};

export const UserContextProvider: FC<UserContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<Usuario>({} as Usuario);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
