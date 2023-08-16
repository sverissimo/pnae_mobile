import { FC, ReactNode, createContext, useState } from "react";

export type User = {
  login_usuario: string;
  matricula_usuario?: string;
  digito_matricula?: string;
  nome_usuario: string;
  password: string;
  role?: string;
} | null;

const a = {
  digito_matricula: "7",
  login_usuario: "10382",
  matricula_usuario: "10382",
  nome_usuario: "Flavio Sena Ferreira",
};
type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
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
  const [user, setUser] = useState<User | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
