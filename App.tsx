import { LogBox, StatusBar } from "react-native";
import Authentication from "./Authentication";
import {
  ImageContextProvider,
  LocationContextProvider,
  ProdutorContextProvider,
  RelatorioContextProvider,
  UserContextProvider,
} from "./contexts";
import { Loading } from "./@shared/components/organisms/Loading";
import { globalColors } from "./@shared/constants/themes";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { SnackBarProvider } from "@contexts/SnackbarContext";
import { ConnectionContextProvider } from "@contexts/ConnectionContext";

import { SyncContextProvider } from "@contexts/SyncContext";
import { ContratoContextProvider } from "@contexts/ContratoContext";
import { grayscale } from "@constants/colorsPallete";
import { useSystemInitialization } from "system/hooks/useSystemInitialization";

LogBox.ignoreLogs(["new NativeEventEmitter()"]);
export default function App() {
  const systemInitialized = useSystemInitialization();
  if (!systemInitialized) {
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
        backgroundColor={grayscale[700]}
        // backgroundColor="#000"
        barStyle="default"
        /* barStyle={statusBarStyle}
        showHideTransition={statusBarTransition}
        hidden={hidden} */
      />
      <UserContextProvider>
        <LocationContextProvider>
          <ConnectionContextProvider>
            <ContratoContextProvider>
              <ProdutorContextProvider>
                <RelatorioContextProvider>
                  <ImageContextProvider>
                    <PaperProvider theme={theme}>
                      <SyncContextProvider>
                        <SnackBarProvider>
                          <Authentication />
                        </SnackBarProvider>
                      </SyncContextProvider>
                    </PaperProvider>
                  </ImageContextProvider>
                </RelatorioContextProvider>
              </ProdutorContextProvider>
            </ContratoContextProvider>
          </ConnectionContextProvider>
        </LocationContextProvider>
      </UserContextProvider>
    </>
  );
}
