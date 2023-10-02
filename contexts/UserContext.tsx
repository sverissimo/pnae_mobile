import { FC, ReactNode, createContext, useState } from "react";
import { Usuario } from "../@shared/types/Usuario";

type UserContextType = {
  user: Usuario | null;
  setUser: (user: Usuario | null) => void;
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
  const [user, setUser] = useState<Usuario | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
