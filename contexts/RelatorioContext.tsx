import * as FileSystem from "expo-file-system";
import { Relatorio } from "features/relatorio/types/Relatorio";
import { createContext, useState } from "react";

type RelatorioContextType = {
  relatorios: Relatorio[];
  setRelatorios: (
    relatorios: Relatorio[] | ((relatorios: Relatorio[]) => Relatorio[])
  ) => void;
  handleGetSignature: (signature: any) => Promise<string | null>;
};

export const RelatorioContext = createContext<RelatorioContextType>(
  {} as RelatorioContextType
);

type RelatorioContextProviderProps = {
  children: React.ReactNode;
};

export const RelatorioContextProvider = ({
  children,
}: RelatorioContextProviderProps) => {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [state, setState] = useState({});

  async function handleGetSignature(signature: any) {
    /*  const file = await FileSystem.deleteAsync(
      "file:///data/user/0/host.exp.exponent/files/signature_1692313334681.jpeg"
    );
    console.log(file); */

    try {
      const fileName = `signature_${Date.now()}.png`;
      const filePath = `${FileSystem.cacheDirectory}${fileName}`;
      const base64Data = signature.replace("data:image/png;base64,", "");

      await FileSystem.writeAsStringAsync(filePath, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const file = await FileSystem.getInfoAsync(filePath);
      const fileURI = file.uri;

      setState((state: any) => ({ ...state, assinaturaURI: fileURI }));
      return fileURI;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  return (
    <RelatorioContext.Provider
      value={{ relatorios, setRelatorios, handleGetSignature }}
    >
      {children}
    </RelatorioContext.Provider>
  );
};
