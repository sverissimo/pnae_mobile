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
import { PaperProvider } from "react-native-paper";

// LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs(["new NativeEventEmitter()"]);
export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    init_db()
      .then(() => {
        setDbInitialized(true);
        console.log("----------------------------------------\n");
        // checkDBSchema();
        // RelatorioService.getAllRelatorios().then((relatorios) =>
        //   relatorios.forEach((relatorio) => console.log(relatorio))
        // );
      })
      .catch((err: unknown) => {
        console.log("🚀 ~ file: App.tsx:16 ~ useEffect ~ err:", err);
      });
  }, []);
  if (!dbInitialized) {
    return <Loading />;
  }

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={globalColors.background[700]}
        barStyle="light-content"
        /* barStyle={statusBarStyle}
        showHideTransition={statusBarTransition}
        hidden={hidden} */
      />
      <UserContextProvider>
        <LocationContextProvider>
          <ProdutorContextProvider>
            <RelatorioContextProvider>
              <ImageContextProvider>
                <PaperProvider>
                  <Authentication />
                </PaperProvider>
              </ImageContextProvider>
            </RelatorioContextProvider>
          </ProdutorContextProvider>
        </LocationContextProvider>
      </UserContextProvider>
    </>
  );
}
