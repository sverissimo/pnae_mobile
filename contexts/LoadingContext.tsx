import React, { ReactNode, createContext, useState } from "react";

type LocationContextType = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export const LoadingContext = createContext<LocationContextType>(
  {} as LocationContextType
);
const [isLoading, setIsLoading] = useState(false);

type LoadingContextProviderProps = {
  children: ReactNode;
};

export const LoadingProvider = (props: LoadingContextProviderProps) => {
  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {props.children}
    </LoadingContext.Provider>
  );
};
