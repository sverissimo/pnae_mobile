import { UserContextProvider } from "./contexts/UserContext";
import Authentication from "./Authentication";
import { ProdutorContextProvider } from "./contexts/ProdutorContext";
import { StatusBar } from "react-native";
import { globalColors } from "./constants/colorsPallete";

export default function App() {
  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={globalColors.primary700}
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
