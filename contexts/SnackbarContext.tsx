import { globalColors } from "@constants/themes";
import { SnackBar } from "@shared/components/molecules";
import { FC, ReactNode, createContext, useState } from "react";

export type SnackBarStateProps = {
  visible?: boolean;
  message: string;
  status?: "success" | "error" | "warning" | "info";
  duration?: number;
  color?: string;
};
const intialState = {
  visible: false,
  message: "",
  duration: 3000,
  color: globalColors.secondary[500],
};

interface SnackBarContextProps {
  snackBarOptions: SnackBarStateProps;
  setSnackBarOptions: (options: SnackBarStateProps) => void;
}

export const SnackBarContext = createContext<SnackBarContextProps>(
  {} as SnackBarContextProps
);

interface SnackBarProviderProps {
  children: ReactNode;
}

export const SnackBarProvider: FC<SnackBarProviderProps> = ({ children }) => {
  const [snackBarOptions, setSnackBarOptions] =
    useState<SnackBarStateProps>(intialState);

  const hideSnackBar = () => {
    setSnackBarOptions(() => ({ ...intialState }));
  };

  return (
    <SnackBarContext.Provider
      value={{
        snackBarOptions,
        setSnackBarOptions,
      }}
    >
      {children}
      <SnackBar {...snackBarOptions} onDismiss={hideSnackBar} />
    </SnackBarContext.Provider>
  );
};
