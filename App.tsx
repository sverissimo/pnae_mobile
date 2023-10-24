import React, { useEffect, useState } from "react";
import { LogBox, StatusBar } from "react-native";
import Authentication from "./Authentication";
import { init_db } from "./@infrastructure/database/config";
import {
  ImageContextProvider,
  LocationContextProvider,
  ProdutorContextProvider,
  RelatorioContextProvider,
  UserContextProvider,
} from "./contexts";
import { RelatorioService } from "@services/RelatorioService";
import { Loading } from "./@shared/components/organisms/Loading";
import { globalColors } from "./@shared/constants/themes";
import { checkDBSchema } from "./@infrastructure/database/queries/checkDBSchema";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { deleteFile, fileExists } from "@shared/utils";
import { SnackBarProvider } from "@contexts/SnackbarContext";
import { ConnectionContextProvider } from "@contexts/ConnectionContext";

LogBox.ignoreLogs(["new NativeEventEmitter()"]);

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    init_db()
      .then(() => {
        setDbInitialized(true);
        console.log("----------------------------------------\n");
        // checkDBSchema();
        // new RelatorioService(true).getAllRelatorios().then((relatorios) => {
        //   console.log(
        //     "🚀 ~ file: App.tsx:33 ~ .then ~ relatorios:",
        //     relatorios
        //   );
        //   return relatorios.forEach((relatorio) => console.log(relatorio));
        // });
      })
      .catch((err: unknown) => {
        console.log("🚀 ~ file: App.tsx:16 ~ useEffect ~ err:", err);
      });
  }, []);
  if (!dbInitialized) {
    return <Loading />;
  }
  const { primary, background } = globalColors;

  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: primary[600],
      accent: primary.A400,
    },
  };

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={background[700]}
        barStyle="light-content"
        /* barStyle={statusBarStyle}
        showHideTransition={statusBarTransition}
        hidden={hidden} */
      />
      <UserContextProvider>
        <LocationContextProvider>
          <ConnectionContextProvider>
            <ProdutorContextProvider>
              <RelatorioContextProvider>
                <ImageContextProvider>
                  <PaperProvider theme={theme}>
                    <SnackBarProvider>
                      <Authentication />
                    </SnackBarProvider>
                  </PaperProvider>
                </ImageContextProvider>
              </RelatorioContextProvider>
            </ProdutorContextProvider>
          </ConnectionContextProvider>
        </LocationContextProvider>
      </UserContextProvider>
    </>
  );
}
