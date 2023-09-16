import { FC, ReactNode, createContext, useState } from "react";
import { LocationObject } from "@shared/types";

type LocationContextType = {
  location: LocationObject | null;
  setLocation: (location: LocationObject | null) => void;
};

export const LocationContext = createContext<LocationContextType>(
  {} as LocationContextType
);

type LocationContextProviderProps = {
  children: ReactNode;
};

export const LocationContextProvider: FC<LocationContextProviderProps> = ({
  children,
}) => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
