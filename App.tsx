import { UserContextProvider } from "./contexts/UserContext";
import Authentication from "./Authentication";
import { ProdutorContextProvider } from "./contexts/ProdutorContext";
import { StatusBar } from "react-native";
import { globalColors } from "./constants/themes";

export default function App() {
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
