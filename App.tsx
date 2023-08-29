import { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import Authentication from "./Authentication";
import { init_db } from "./@infrastructure/database/config";
import {
  ImageContextProvider,
  ProdutorContextProvider,
  RelatorioContextProvider,
  UserContextProvider,
} from "./contexts";
import { RelatorioService } from "@services/RelatorioService";
import { Loading } from "./@shared/components/organisms/Loading";
import { globalColors } from "./constants/themes";
import { checkDBSchema } from "./@infrastructure/database/queries/checkDBSchema";

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    init_db()
      .then(() => {
        setDbInitialized(true);
        console.log("--------------------\n");
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
        <ProdutorContextProvider>
          <RelatorioContextProvider>
            <ImageContextProvider>
              <Authentication />
            </ImageContextProvider>
          </RelatorioContextProvider>
        </ProdutorContextProvider>
      </UserContextProvider>
    </>
  );
}
