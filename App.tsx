import { useEffect, useState } from "react";
import Authentication from "./Authentication";
import { init_db } from "./@infrastructure/database/config";
import { checkDBSchema } from "./@infrastructure/database/queries/checkDBSchema";
import { UserContextProvider } from "./contexts/UserContext";
import { ProdutorContextProvider } from "./contexts/ProdutorContext";
import { StatusBar } from "react-native";
import { Loading } from "./components/organisms/Loading";
import { globalColors } from "./constants/themes";
import { RelatorioService } from "@services/RelatorioService";

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    init_db()
      .then(() => {
        setDbInitialized(true);
        console.log("---------------\n");
        //checkDBSchema();
        /*  RelatorioService.getAllRelatorios().then((relatorios) =>
          relatorios.forEach((relatorio) => console.log(relatorio))
        ); */
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
          <Authentication />
        </ProdutorContextProvider>
      </UserContextProvider>
    </>
  );
}
