import { FC, ReactNode, createContext, useState } from "react";

type ImageContextType = {
  pictureURI: string;
  pictureURIList: string[];
  setPictureURI: (
    pictureURI: string | ((pictureURI: string) => string)
  ) => void;
  setPictureURIList: (
    pictureURIList: string[] | ((pictureURIList: string[]) => string[])
  ) => void;
  assinaturaURI: string;
  assinaturaURIList: string[];
  setAssinaturaURI: (
    assinaturaURI: string | ((assinaturaURI: string) => string)
  ) => void;
  setAssinaturaURIList: (
    assinaturaURIList: string[] | ((assinaturaURIList: string[]) => string[])
  ) => void;
};

type ImageContextProviderProps = {
  children: ReactNode;
};

export const ImageContext = createContext<ImageContextType>(
  {} as ImageContextType
);

export const ImageContextProvider: FC<ImageContextProviderProps> = ({
  children,
}: any) => {
  const [pictureURI, setPictureURI] = useState<string>("");
  const [pictureURIList, setPictureURIList] = useState<string[]>([]);
  const [assinaturaURI, setAssinaturaURI] = useState<string>("");
  const [assinaturaURIList, setAssinaturaURIList] = useState<string[]>([]);

  return (
    <ImageContext.Provider
      value={{
        pictureURI,
        setPictureURI,
        pictureURIList,
        setPictureURIList,
        assinaturaURI,
        assinaturaURIList,
        setAssinaturaURI,
        setAssinaturaURIList,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
